import asyncio
import json
import logging
from typing import Dict, List, Set
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vytrix-backend")

app = FastAPI(title="Vytrix emergency response API", version="1.0.0")

# CORS middleware for Next.js dev server access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Disaster Scenario Flow definition
STAGES = [
    {"id": 0, "name": "Cyclone Detected", "status": "Category 4 Storm Approaching", "severity": "WARNING"},
    {"id": 1, "name": "Flood Propagation", "status": "Levee Breach & Coastal Inundation", "severity": "CRITICAL"},
    {"id": 2, "name": "Infrastructure Stress", "status": "Power Grid Failure & Substation Shutdown", "severity": "CRITICAL"},
    {"id": 3, "name": "Hospitals Overloaded", "status": "Triage Overflow & Casualty Surge", "severity": "EMERGENCY"},
    {"id": 4, "name": "Evacuation Optimization", "status": "Rerouting & Airlift Dispatch", "severity": "ACTIVE"},
    {"id": 5, "name": "Citizen Alerts", "status": "Civilian Broadcast & SOS Signals", "severity": "ACTIVE"},
    {"id": 6, "name": "Recovery Planning", "status": "Damage Assessment & Rebuilding", "severity": "RECOVERY"}
]

# In-memory database
class SystemState:
    def __init__(self):
        self.current_stage_id = 0
        self.active_connections: Set[WebSocket] = set()

    def get_current_stage(self):
        return STAGES[self.current_stage_id]

state = SystemState()

class StageUpdate(BaseModel):
    stage_id: int

# WebSocket manager
class ConnectionManager:
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        state.active_connections.add(websocket)
        # Send current state immediately on connection
        await websocket.send_text(json.dumps({
            "type": "STAGE_CHANGE",
            "stage": state.get_current_stage(),
            "stage_id": state.current_stage_id
        }))
        logger.info(f"WebSocket client connected. Total connections: {len(state.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        state.active_connections.remove(websocket)
        logger.info(f"WebSocket client disconnected. Total connections: {len(state.active_connections)}")

    async def broadcast(self, message: dict):
        if not state.active_connections:
            return
        message_str = json.dumps(message)
        # Gather all broadcast tasks and run them concurrently
        tasks = [connection.send_text(message_str) for connection in state.active_connections]
        await asyncio.gather(*tasks, return_exceptions=True)

manager = ConnectionManager()

@app.get("/api/scenario")
async def get_scenario():
    return {
        "current_stage_id": state.current_stage_id,
        "stage": state.get_current_stage(),
        "stages": STAGES
    }

@app.post("/api/scenario")
async def update_scenario(payload: StageUpdate):
    if payload.stage_id < 0 or payload.stage_id >= len(STAGES):
        raise HTTPException(status_code=400, detail="Invalid stage ID")
    
    state.current_stage_id = payload.stage_id
    updated_stage = state.get_current_stage()
    
    # Broadcast to all websocket connections
    broadcast_msg = {
        "type": "STAGE_CHANGE",
        "stage": updated_stage,
        "stage_id": state.current_stage_id
    }
    await manager.broadcast(broadcast_msg)
    logger.info(f"Scenario updated to stage {state.current_stage_id}: {updated_stage['name']}")
    return {"status": "success", "current_stage_id": state.current_stage_id}

@app.websocket("/ws/scenario")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and listen for client messages
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                if msg.get("type") == "SET_STAGE":
                    stage_id = int(msg.get("stage_id", 0))
                    if 0 <= stage_id < len(STAGES):
                        state.current_stage_id = stage_id
                        await manager.broadcast({
                            "type": "STAGE_CHANGE",
                            "stage": state.get_current_stage(),
                            "stage_id": state.current_stage_id
                        })
            except Exception as e:
                logger.error(f"Error handling WebSocket message: {e}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Mock Data Endpoints depending on Stage
@app.get("/api/metrics")
async def get_metrics():
    stage_id = state.current_stage_id
    
    # Dynamic metrics changing per stage
    base_cascade_risk = [35, 55, 84, 91, 95, 70, 20]
    base_hospital_capacity = [62, 78, 92, 112, 115, 85, 50]
    base_grid_load = [65, 85, 98, 40, 30, 45, 60]  # power drops off after fail
    base_evac_percentage = [0, 5, 20, 45, 82, 98, 100]
    
    return {
        "cascade_risk": base_cascade_risk[stage_id],
        "hospital_capacity": base_hospital_capacity[stage_id],
        "grid_load": base_grid_load[stage_id],
        "evacuated_percent": base_evac_percentage[stage_id],
        "confidence_level": 0.94 if stage_id < 4 else 0.88,
        "assets_deployed": 12 + (stage_id * 28) if stage_id < 5 else 142 - ((stage_id - 4) * 20),
        "shelters_active": 2 if stage_id < 3 else (5 if stage_id < 6 else 1),
        "precipitation_rate": 0.2 if stage_id == 6 else (1.2 + (stage_id * 1.0) if stage_id < 4 else 4.2 - (stage_id - 3) * 0.8)
    }

@app.get("/api/feed")
async def get_feed():
    stage_id = state.current_stage_id
    
    all_logs = [
        # Stage 0: Cyclone Detected
        [
            {"timestamp": "T-12:00:00", "message": "Satellite uplink active: Cyclone Vytrix tracked at 22.4N, 88.5E", "severity": "info", "source": "SAT_UPLINK"},
            {"timestamp": "T-10:45:00", "message": "Coastal radar scans show wind speeds up to 130mph", "severity": "warning", "source": "RADAR_COASTAL"},
            {"timestamp": "T-08:15:00", "message": "Met department issues Level 4 Storm Warning", "severity": "warning", "source": "MET_OFFICE"}
        ],
        # Stage 1: Flood Propagation
        [
            {"timestamp": "T-04:30:00", "message": "High tide storm surge reaches 2.4m above nominal", "severity": "warning", "source": "TIDE_GAUGE_03"},
            {"timestamp": "T-03:15:00", "message": "Sector 7 Levee water levels exceed safety margin (94%)", "severity": "warning", "source": "LEVEE_SENSOR_07"},
            {"timestamp": "T-02:10:00", "message": "CRITICAL: Levee breach detected at Sector 7 South", "severity": "critical", "source": "LEVEE_SENSOR_07"}
        ],
        # Stage 2: Infrastructure Stress
        [
            {"timestamp": "T-01:45:00", "message": "Floodwaters enter Substation 4 complex", "severity": "warning", "source": "GRID_A"},
            {"timestamp": "T-01:30:00", "message": "CRITICAL: Substation 4 automated shutdown triggered", "severity": "critical", "source": "GRID_A"},
            {"timestamp": "T-01:15:00", "message": "Cascading risk: Transit artery signals offline - Sector 4", "severity": "critical", "source": "COMMS_SYS"}
        ],
        # Stage 3: Hospitals Overloaded
        [
            {"timestamp": "T-00:55:00", "message": "Casualty surge reported at Sector 1 General (98% capacity)", "severity": "warning", "source": "EMS_NET"},
            {"timestamp": "T-00:45:00", "message": "CRITICAL: Mercy Memorial Hospital reports triage overflow (112%)", "severity": "critical", "source": "EMS_NET"},
            {"timestamp": "T-00:40:00", "message": "Reroute request: Diverting EMS units to alternative safe zones", "severity": "warning", "source": "COPILOT_AI"}
        ],
        # Stage 4: Evacuation Optimization
        [
            {"timestamp": "T-00:30:00", "message": "Evacuation Route 9 compromised by rising water levels", "severity": "critical", "source": "TRAFFIC_OS"},
            {"timestamp": "T-00:25:00", "message": "Airlift Unit Charlie dispatched to Sector B rooftop coordinates", "severity": "info", "source": "DISPATCH_AIR"},
            {"timestamp": "T-00:20:00", "message": "AI Copilot: Evacuation Route Alpha rerouted. Clear of hazards", "severity": "info", "source": "COPILOT_AI"}
        ],
        # Stage 5: Citizen Alerts
        [
            {"timestamp": "T-00:15:00", "message": "Cellular broadcast issued to all residents in Zone C-4", "severity": "critical", "source": "CIVIC_LINK"},
            {"timestamp": "T-00:10:00", "message": "SOS pulse received from 14 citizens in flooded block 12", "severity": "critical", "source": "CIVIC_LINK"},
            {"timestamp": "T-00:05:00", "message": "Automated drones deployed to deliver supply kits to block 12", "severity": "info", "source": "DISPATCH_DRN"}
        ],
        # Stage 6: Recovery Planning
        [
            {"timestamp": "T+02:00:00", "message": "Storm front moved inland. Rain rate decreased to 0.2in/hr", "severity": "info", "source": "MET_OFFICE"},
            {"timestamp": "T+04:15:00", "message": "Utility crews dispatched to Substation 4 for assessment", "severity": "info", "source": "GRID_A"},
            {"timestamp": "T+06:00:00", "message": "Recovery protocol active: Commencing structural damage scans", "severity": "info", "source": "COPILOT_AI"}
        ]
    ]
    
    # Return accumulated logs up to current stage to show history
    history = []
    for s_idx in range(stage_id + 1):
        history.extend(all_logs[s_idx])
    return history[::-1][:15]  # Reverse to show newest logs first, limit to 15

@app.post("/api/copilot/chat")
async def copilot_chat(payload: dict):
    prompt = payload.get("prompt", "").lower()
    stage_id = state.current_stage_id
    
    # Custom intelligence responses based on user query and disaster stage
    responses = {
        0: {
            "analysis": "Meteorological tracking confirms Category 4 Cyclone 'Vytrix' is 120km offshore, moving at 15 knots directly toward the Central Waterfront. Landfall is estimated at T-8 hours. Current coastal infrastructure is stable, but evacuation preparations are recommended for low-lying sectors.",
            "actions": [
                "Initiate warning broadcasts for Coastal Waterfront zones.",
                "Verify backup generators at Sector 1 General and Mercy Memorial.",
                "Position utility rescue vehicles at key staging points."
            ]
        },
        1: {
            "analysis": "Levee Breach detected at Sector 7 South. Storm surge is forcing coastal floodwaters inland at 0.8 meters per minute. Flooding is projected to inundate Block 12 and Block 15 within 30 minutes. Current drainage network is at maximum discharge capacity.",
            "actions": [
                "Deploy temporary aqua-barriers at Substation 4 perimeter.",
                "Trigger evacuation warnings for low-lying areas in Sector 7.",
                "Reroute commuter traffic away from Coastal Expressway."
            ]
        },
        2: {
            "analysis": "Substation 4 has suffered automatic ground faults due to water ingress. Grid load has surged to 98% on Grid Sec-1, risking a wider blackout. Transit artery signaling systems in Sector 4 are currently operating on auxiliary battery packs (estimate 90 minutes remaining).",
            "actions": [
                "Execute Power Grid Re-routing (Protocol Delta) to shunt load to Eastern Link.",
                "Prioritize battery backups for communication towers.",
                "Dispatch manual traffic officers to major intersections."
            ]
        },
        3: {
            "analysis": "Triage logistics are highly stressed. Mercy Memorial has exceeded maximum emergency capacity by 12% (112% CAP) due to local evacuation intake. Ambulances are experiencing average offload delays of 45 minutes, creating a critical coverage gap.",
            "actions": [
                "Reroute non-critical EMS units to Sector 1 General and Westside Clinic.",
                "Authorize emergency field tent deployment at Mercy Memorial north parking lot.",
                "Activate medical reserve corps volunteers."
            ]
        },
        4: {
            "analysis": "Evacuation Route 9 is fully compromised by 1.2m of standing water. Safe path optimization algorithms have computed alternative Route Alpha as the optimal path. Dynamic signs are updating to guide residents. Airlift assets are ready for high-rise extractions.",
            "actions": [
                "Authorize Route Alpha navigation instructions update on Civilian Link.",
                "Deploy airlift units to Block 12 rooftop extractions.",
                "Verify shelter capacity at Terminal Alpha."
            ]
        },
        5: {
            "analysis": "Civilian Link SOS telemetry indicates 14 active distress signals clustered in Block 12. Rising waters have trapped residents on secondary floors. Cellular network cell tower 4B is running on backup generator with 4 hours of fuel.",
            "actions": [
                "Broadcast localized SMS evacuation orders to Zone C-4.",
                "Deploy automated emergency supply drones to trapped clusters in Block 12.",
                "Direct local rescue boats to coordinates (22.434N, 88.541E)."
            ]
        },
        6: {
            "analysis": "The storm front has passed. Water levels are receding at 0.15 meters per hour. Primary threat vectors are resolved, and system status is downgraded to NOMINAL. Auxiliary power has been restored to Substation 4, but structural scans are needed before full grid synchronization.",
            "actions": [
                "Deploy UAV mapping fleet to perform structural damage assessment scans.",
                "De-escalate evacuation orders and authorize return-to-home phases.",
                "Compile final emergency ledger report for municipal oversight."
            ]
        }
    }
    
    stage_data = responses.get(stage_id, responses[0])
    
    # Adjust response slightly if specific keywords are matched
    if "evacuate" in prompt or "route" in prompt:
        custom_reply = f"EVACUATION UPDATE: Current optimal evacuation corridor is Route Alpha. {stage_data['analysis']}"
    elif "power" in prompt or "grid" in prompt or "substation" in prompt:
        custom_reply = f"GRID UPDATE: Substation status is being managed. {stage_data['analysis']}"
    else:
        custom_reply = stage_data["analysis"]
        
    return {
        "reply": custom_reply,
        "actions": stage_data["actions"],
        "stage_id": stage_id,
        "stage_name": STAGES[stage_id]["name"]
    }

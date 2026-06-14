"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { sanitizeInput } from "@/lib/utils/sanitize";

export interface Stage {
  id: number;
  name: string;
  status: string;
  severity: "WARNING" | "CRITICAL" | "EMERGENCY" | "ACTIVE" | "RECOVERY";
}

export interface MetricData {
  cascade_risk: number;
  hospital_capacity: number;
  grid_load: number;
  evacuated_percent: number;
  confidence_level: number;
  assets_deployed: number;
  shelters_active: number;
  precipitation_rate: number;
}

export interface LogMessage {
  timestamp: string;
  message: string;
  severity: "info" | "warning" | "critical";
  source: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  reasoning?: string;
  actions?: string[];
  timestamp: string;
}

interface StateContextType {
  currentStageId: number;
  currentStage: Stage;
  stages: Stage[];
  setStage: (stageId: number) => Promise<void>;
  autoplay: boolean;
  setAutoplay: (val: boolean) => void;
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
  wsUrl: string;
  setWsUrl: (url: string) => void;
  mapboxToken: string;
  setMapboxToken: (token: string) => void;
  metrics: MetricData;
  logs: LogMessage[];
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  sendMessageToCopilot: (prompt: string) => Promise<void>;
  standaloneMode: boolean;
  forceSync: () => Promise<void>;
}

const STAGES: Stage[] = [
  { id: 0, name: "Cyclone Detected", status: "Category 4 Storm Approaching", severity: "WARNING" },
  { id: 1, name: "Flood Propagation", status: "Levee Breach & Coastal Inundation", severity: "CRITICAL" },
  { id: 2, name: "Infrastructure Stress", status: "Power Grid Failure & Substation Shutdown", severity: "CRITICAL" },
  { id: 3, name: "Hospitals Overloaded", status: "Triage Overflow & Casualty Surge", severity: "EMERGENCY" },
  { id: 4, name: "Evacuation Optimization", status: "Rerouting & Airlift Dispatch", severity: "ACTIVE" },
  { id: 5, name: "Citizen Alerts", status: "Civilian Broadcast & SOS Signals", severity: "ACTIVE" },
  { id: 6, name: "Recovery Planning", status: "Damage Assessment & Rebuilding", severity: "RECOVERY" }
];

const STANDALONE_LOGS: Record<number, LogMessage[]> = {
  0: [
    { timestamp: "T-12:00:00", message: "Satellite uplink active: Cyclone Vytrix tracked at 22.4N, 88.5E", severity: "info", source: "SAT_UPLINK" },
    { timestamp: "T-10:45:00", message: "Coastal radar scans show wind speeds up to 130mph", severity: "warning", source: "RADAR_COASTAL" },
    { timestamp: "T-08:15:00", message: "Met department issues Level 4 Storm Warning", severity: "warning", source: "MET_OFFICE" }
  ],
  1: [
    { timestamp: "T-04:30:00", message: "High tide storm surge reaches 2.4m above nominal", severity: "warning", source: "TIDE_GAUGE_03" },
    { timestamp: "T-03:15:00", message: "Sector 7 Levee water levels exceed safety margin (94%)", severity: "warning", source: "LEVEE_SENSOR_07" },
    { timestamp: "T-02:10:00", message: "CRITICAL: Levee breach detected at Sector 7 South", severity: "critical", source: "LEVEE_SENSOR_07" }
  ],
  2: [
    { timestamp: "T-01:45:00", message: "Floodwaters enter Substation 4 complex", severity: "warning", source: "GRID_A" },
    { timestamp: "T-01:30:00", message: "CRITICAL: Substation 4 automated shutdown triggered", severity: "critical", source: "GRID_A" },
    { timestamp: "T-01:15:00", message: "Cascading risk: Transit artery signals offline - Sector 4", severity: "critical", source: "COMMS_SYS" }
  ],
  3: [
    { timestamp: "T-00:55:00", message: "Casualty surge reported at Sector 1 General (98% capacity)", severity: "warning", source: "EMS_NET" },
    { timestamp: "T-00:45:00", message: "CRITICAL: Mercy Memorial Hospital reports triage overflow (112%)", severity: "critical", source: "EMS_NET" },
    { timestamp: "T-00:40:00", message: "Reroute request: Diverting EMS units to alternative safe zones", severity: "warning", source: "COPILOT_AI" }
  ],
  4: [
    { timestamp: "T-00:30:00", message: "Evacuation Route 9 compromised by rising water levels", severity: "critical", source: "TRAFFIC_OS" },
    { timestamp: "T-00:25:00", message: "Airlift Unit Charlie dispatched to Sector B rooftop coordinates", severity: "info", source: "DISPATCH_AIR" },
    { timestamp: "T-00:20:00", message: "AI Copilot: Evacuation Route Alpha rerouted. Clear of hazards", severity: "info", source: "COPILOT_AI" }
  ],
  5: [
    { timestamp: "T-00:15:00", message: "Cellular broadcast issued to all residents in Zone C-4", severity: "critical", source: "CIVIC_LINK" },
    { timestamp: "T-00:10:00", message: "SOS pulse received from 14 citizens in flooded block 12", severity: "critical", source: "CIVIC_LINK" },
    { timestamp: "T-00:05:00", message: "Automated drones deployed to deliver supply kits to block 12", severity: "info", source: "DISPATCH_DRN" }
  ],
  6: [
    { timestamp: "T+02:00:00", message: "Storm front moved inland. Rain rate decreased to 0.2in/hr", severity: "info", source: "MET_OFFICE" },
    { timestamp: "T+04:15:00", message: "Utility crews dispatched to Substation 4 for assessment", severity: "info", source: "GRID_A" },
    { timestamp: "T+06:00:00", message: "Recovery protocol active: Commencing structural damage scans", severity: "info", source: "COPILOT_AI" }
  ]
};

const STANDALONE_COPILOT_RESPONSES: Record<number, { reply: string; actions: string[] }> = {
  0: {
    reply: "Meteorological tracking confirms Category 4 Cyclone 'Vytrix' is 120km offshore, moving at 15 knots directly toward the Central Waterfront. Landfall is estimated at T-8 hours. Current coastal infrastructure is stable, but evacuation preparations are recommended for low-lying sectors.",
    actions: [
      "Initiate warning broadcasts for Coastal Waterfront zones.",
      "Verify backup generators at Sector 1 General and Mercy Memorial.",
      "Position utility rescue vehicles at key staging points."
    ]
  },
  1: {
    reply: "Levee Breach detected at Sector 7 South. Storm surge is forcing coastal floodwaters inland at 0.8 meters per minute. Flooding is projected to inundate Block 12 and Block 15 within 30 minutes. Current drainage network is at maximum discharge capacity.",
    actions: [
      "Deploy temporary aqua-barriers at Substation 4 perimeter.",
      "Trigger evacuation warnings for low-lying areas in Sector 7.",
      "Reroute commuter traffic away from Coastal Expressway."
    ]
  },
  2: {
    reply: "Substation 4 has suffered automatic ground faults due to water ingress. Grid load has surged to 98% on Grid Sec-1, risking a wider blackout. Transit artery signaling systems in Sector 4 are currently operating on auxiliary battery packs (estimate 90 minutes remaining).",
    actions: [
      "Execute Power Grid Re-routing (Protocol Delta) to shunt load to Eastern Link.",
      "Prioritize battery backups for communication towers.",
      "Dispatch manual traffic officers to major intersections."
    ]
  },
  3: {
    reply: "Triage logistics are highly stressed. Mercy Memorial has exceeded maximum emergency capacity by 12% (112% CAP) due to local evacuation intake. Ambulances are experiencing average offload delays of 45 minutes, creating a critical coverage gap.",
    actions: [
      "Reroute non-critical EMS units to Sector 1 General and Westside Clinic.",
      "Authorize emergency field tent deployment at Mercy Memorial north parking lot.",
      "Activate medical reserve corps volunteers."
    ]
  },
  4: {
    reply: "Evacuation Route 9 is fully compromised by 1.2m of standing water. Safe path optimization algorithms have computed alternative Route Alpha as the optimal path. Dynamic signs are updating to guide residents. Airlift assets are ready for high-rise extractions.",
    actions: [
      "Authorize Route Alpha navigation instructions update on Civilian Link.",
      "Deploy airlift units to Block 12 rooftop extractions.",
      "Verify shelter capacity at Terminal Alpha."
    ]
  },
  5: {
    reply: "Civilian Link SOS telemetry indicates 14 active distress signals clustered in Block 12. Rising waters have trapped residents on secondary floors. Cellular network cell tower 4B is running on backup generator with 4 hours of fuel.",
    actions: [
      "Broadcast localized SMS evacuation orders to Zone C-4.",
      "Deploy automated emergency supply drones to trapped clusters in Block 12.",
      "Direct local rescue boats to coordinates (22.434N, 88.541E)."
    ]
  },
  6: {
    reply: "The storm front has passed. Water levels are receding at 0.15 meters per hour. Primary threat vectors are resolved, and system status is downgraded to NOMINAL. Auxiliary power has been restored to Substation 4, but structural scans are needed before full grid synchronization.",
    actions: [
      "Deploy UAV mapping fleet to perform structural damage assessment scans.",
      "De-escalate evacuation orders and authorize return-to-home phases.",
      "Compile final emergency ledger report for municipal oversight."
    ]
  }
};

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStageId, setCurrentStageId] = useState<number>(0);
  const [autoplay, setAutoplay] = useState<boolean>(false);
  const [standaloneMode, setStandaloneMode] = useState<boolean>(true);

  const [apiBaseUrl, setApiBaseUrlState] = useState<string>("http://localhost:8000");
  const [wsUrl, setWsUrlState] = useState<string>("ws://localhost:8000/ws/scenario");
  const [mapboxToken, setMapboxTokenState] = useState<string>("");

  const [metrics, setMetrics] = useState<MetricData>({
    cascade_risk: 35,
    hospital_capacity: 62,
    grid_load: 65,
    evacuated_percent: 0,
    confidence_level: 0.94,
    assets_deployed: 12,
    shelters_active: 2,
    precipitation_rate: 1.2
  });

  const [logs, setLogs] = useState<LogMessage[]>(STANDALONE_LOGS[0]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectDelayRef = useRef<number>(1000); // Start reconnect at 1s

  const setApiBaseUrl = (url: string) => {
    setApiBaseUrlState(url);
    if (typeof window !== "undefined") localStorage.setItem("vytrix_api_url", url);
  };

  const setWsUrl = (url: string) => {
    setWsUrlState(url);
    if (typeof window !== "undefined") localStorage.setItem("vytrix_ws_url", url);
  };

  const setMapboxToken = (token: string) => {
    setMapboxTokenState(token);
    if (typeof window !== "undefined") localStorage.setItem("vytrix_mapbox_token", token);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedApi = localStorage.getItem("vytrix_api_url");
      const savedWs = localStorage.getItem("vytrix_ws_url");
      const savedMapbox = localStorage.getItem("vytrix_mapbox_token");
      if (savedApi) setApiBaseUrlState(savedApi);
      if (savedWs) setWsUrlState(savedWs);
      if (savedMapbox) setMapboxTokenState(savedMapbox);

      // Check URL params for autoplay flag
      const params = new URLSearchParams(window.location.search);
      if (params.get("autoplay") === "true") {
        setAutoplay(true);
      }
    }
  }, []);

  const fetchMetricsAndLogs = useCallback(async (stageId: number) => {
    try {
      const [metricsRes, feedRes] = await Promise.all([
        fetch(`${apiBaseUrl}/api/metrics`),
        fetch(`${apiBaseUrl}/api/feed`)
      ]);

      if (metricsRes.ok && feedRes.ok) {
        const metricsData = await metricsRes.json();
        const feedData = await feedRes.json();
        setMetrics(metricsData);
        setLogs(feedData);
        setStandaloneMode(false);
      } else {
        throw new Error("API status check fail");
      }
    } catch (error) {
      setStandaloneMode(true);
      
      const base_cascade_risk = [35, 55, 84, 91, 95, 70, 20];
      const base_hospital_capacity = [62, 78, 92, 112, 115, 85, 50];
      const base_grid_load = [65, 85, 98, 40, 30, 45, 60];
      const base_evac_percentage = [0, 5, 20, 45, 82, 98, 100];

      setMetrics({
        cascade_risk: base_cascade_risk[stageId],
        hospital_capacity: base_hospital_capacity[stageId],
        grid_load: base_grid_load[stageId],
        evacuated_percent: base_evac_percentage[stageId],
        confidence_level: stageId < 4 ? 0.94 : 0.88,
        assets_deployed: stageId < 5 ? 12 + (stageId * 28) : 142 - ((stageId - 4) * 20),
        shelters_active: stageId < 3 ? 2 : (stageId < 6 ? 5 : 1),
        precipitation_rate: stageId === 6 ? 0.2 : (1.2 + (stageId * 1.0))
      });

      let historyLogs: LogMessage[] = [];
      for (let s = 0; s <= stageId; s++) {
        historyLogs = [...historyLogs, ...(STANDALONE_LOGS[s] || [])];
      }
      setLogs([...historyLogs].reverse());
    }
  }, [apiBaseUrl]);

  const setStage = async (stageId: number) => {
    if (stageId < 0 || stageId >= STAGES.length) return;
    
    setCurrentStageId(stageId);
    await fetchMetricsAndLogs(stageId);

    try {
      const res = await fetch(`${apiBaseUrl}/api/scenario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage_id: stageId })
      });
      if (res.ok) {
        setStandaloneMode(false);
      }
    } catch (e) {
      setStandaloneMode(true);
    }
  };

  const forceSync = async () => {
    await fetchMetricsAndLogs(currentStageId);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoplay) {
      timer = setInterval(() => {
        setCurrentStageId((prev) => {
          const next = (prev + 1) % STAGES.length;
          setStage(next);
          return next;
        });
      }, 8000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoplay]);

  // WebSocket connection lifecycle
  useEffect(() => {
    let ws: WebSocket | null = null;

    const connectWS = () => {
      // Clear existing reconnection timeouts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      try {
        ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log("[Vytrix WS] Live channel linked");
          setStandaloneMode(false);
          reconnectDelayRef.current = 1000; // Reset backoff delay on successful connect
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // SECURITY Payload validation check
            if (data && typeof data === "object" && data.type === "STAGE_CHANGE" && "stage_id" in data) {
              const stageId = Number(data.stage_id);
              if (!isNaN(stageId) && stageId >= 0 && stageId < STAGES.length) {
                setCurrentStageId(stageId);
                fetchMetricsAndLogs(stageId);
              }
            }
          } catch (err) {
            console.error("[Vytrix WS] Failed to parse payload schema", err);
          }
        };

        ws.onclose = () => {
          console.warn(`[Vytrix WS] Channel closed. Retrying in ${reconnectDelayRef.current}ms`);
          
          // Exponential backoff capped at 16 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectDelayRef.current = Math.min(16000, reconnectDelayRef.current * 2);
            connectWS();
          }, reconnectDelayRef.current);
        };

        ws.onerror = () => {
          if (ws) ws.close();
        };
      } catch (err) {
        reconnectTimeoutRef.current = setTimeout(connectWS, 5000);
      }
    };

    connectWS();

    // Clean up websocket and timers on unmount to prevent memory leaks
    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null; // Remove listener to prevent triggering auto-reconnect loop
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [wsUrl, fetchMetricsAndLogs]);

  const sendMessageToCopilot = async (prompt: string) => {
    // SECURITY: Input sanitization step
    const sanitizedPrompt = sanitizeInput(prompt);
    if (!sanitizedPrompt) return;

    const timestamp = new Date().toLocaleTimeString();
    
    const userMsg: ChatMessage = { role: "user", content: sanitizedPrompt, timestamp };
    setChatHistory((prev) => [...prev, userMsg]);

    const thinkingMsg: ChatMessage = {
      role: "assistant",
      content: "STREAMING ANALYSIS...",
      timestamp
    };
    setChatHistory((prev) => [...prev, thinkingMsg]);

    try {
      const res = await fetch(`${apiBaseUrl}/api/copilot/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: sanitizedPrompt })
      });

      if (res.ok) {
        const data = await res.json();
        setChatHistory((prev) => [
          ...prev.slice(0, -1),
          {
            role: "assistant",
            content: data.reply,
            actions: data.actions,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
        return;
      }
      throw new Error("Chat endpoint offline");
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const localResponse = STANDALONE_COPILOT_RESPONSES[currentStageId] || STANDALONE_COPILOT_RESPONSES[0];
      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: localResponse.reply,
          actions: localResponse.actions,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }
  };

  const currentStage = STAGES[currentStageId];

  return (
    <StateContext.Provider
      value={{
        currentStageId,
        currentStage,
        stages: STAGES,
        setStage,
        autoplay,
        setAutoplay,
        apiBaseUrl,
        setApiBaseUrl,
        wsUrl,
        setWsUrl,
        mapboxToken,
        setMapboxToken,
        metrics,
        logs,
        chatHistory,
        setChatHistory,
        sendMessageToCopilot,
        standaloneMode,
        forceSync
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useSystemState = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useSystemState must be used within a StateProvider");
  }
  return context;
};

# Vytrix OS // Step-by-Step Video Recording & Demo Script

This document provides a highly structured script for recording your hackathon project submission video or presenting Vytrix live to judges. It coordinates screen actions, verbal talking points, and highlight features for each transition.

---

## 🎬 Video Overview & Setup
- **Total Target Duration:** 3 to 4 minutes.
- **Setup:** Open two browser tabs side-by-side:
  - **Tab 1 (Primary Command Deck):** `http://localhost:3001`
  - **Tab 2 (Civilian Link Mobile Simulator):** `http://localhost:3001/mobile`

---

## ⏱️ Timeline Script

### Act 1: The Boot and Ingress (0:00 - 0:30)
* **On Screen:** Start on the Vytrix OS landing page (`http://localhost:3001`). Let the cascading diagnostic terminal logs complete their boot cycle.
* **Action:** Click **"ENTER OPERATIONAL CONSOLE"** to transition to the main dashboard.
* **Verbal Script:**
  > *"Welcome to Vytrix—an AI-native emergency operations operating system engineered for future smart cities and municipal command centers. Instead of presenting static dashboards, Vytrix is designed to synthesize active climate events into structured tactical intelligence. Let's enter the command deck."*
* **Highlight Features:**
  - Fast cascading boot sequence console.
  - Premium radial dark-blue design guidelines (`#0c1324`) and scan-line micro-animations.

---

### Act 2: Cyclone Tracking (Stage 1) (0:30 - 1:00)
* **On Screen:** The primary Emergency Command Center (`/dashboard`). The map is active, showing circular radar sweeps tracking the storm offshore.
* **Action:** Toggle/hover over the circular radar controls on the map. Point out the **Scenario Orchestrator** widget in the bottom right corner showing `Stage 1: Cyclone Detected` in a amber `WARNING` pill.
* **Verbal Script:**
  > *"We are currently in Stage 1: Cyclone Detected. Our satellite telemetry has locked onto Category 4 Cyclone Vytrix, tracking wind speeds up to 130mph. Our command deck updates in real-time, showing 12 active responder assets deployed and coastal tide gauges monitoring the approaching surge."*
* **Highlight Features:**
  - Live Mapbox radar loops (or vector canvas fallback grids).
  - Real-time **Live Critical Feed** displaying meteorological alerts.

---

### Act 3: Levee Breach & Power Outage (Stages 2 & 3) (1:00 - 1:45)
* **Action:** Click **"Next"** on the Scenario Orchestrator panel to advance to **Stage 2: Flood Propagation**, then wait a moment and click **"Next"** to advance to **Stage 3: Infrastructure Stress**.
* **On Screen:** 
  - The map overlay updates to show red flood boundaries.
  - The **Live Critical Feed** logs warn of a Sector 7 south levee breach.
  - Substation 4 on the map turns red, and the **Grid Dependency Status** widget shows the power grid load peaking at 98%.
* **Verbal Script:**
  > *"As the storm makes landfall, we transition to flood propagation and infrastructure stress. Water levels exceed levee tolerances, breaching Sector 7 South. The flooding inundates Substation 4, triggering an automated shutdown. You can see our Grid load surge to 98% in real-time as the system attempts to reroute power."*
* **Highlight Features:**
  - Dynamic map boundary overlays changing with the scenario.
  - Interactive grid dependency telemetry.

---

### Act 4: Triage & AI Copilot Coordination (Stage 4) (1:45 - 2:30)
* **Action:** Click **"Next"** to advance to **Stage 4: Hospitals Overloaded**. Then, click **"AI Copilot"** in the sidebar navigation to open the copilot deck.
* **On Screen:** The copilot interface (`/copilot`). Type in the prompt box: *"Status update on hospitals and power grid reroutes"* and press Enter.
* **AI Output:** Copilot displays a reasoning chain detailing the 112% triage overload at Mercy Memorial and generates three structured recommendation buttons.
* **Verbal Script:**
  > *"Under extreme stress, dispatchers face cognitive overload. Vytrix mitigates this with our Tactical Copilot AI. Here, we query the coordinator about hospital overload and grid stress. The AI analyzes our active stage, notes that Mercy Memorial has exceeded capacity, and generates immediate, actionable recommendations—like shunting power loads to the Eastern Link and rerouting non-critical ambulances."*
* **Highlight Features:**
  - Copilot chat layout with reasoning step accordion.
  - Dynamic recommended action triggers.

---

### Act 5: Infrastructure & Evacuation Routing (Stage 5) (2:30 - 3:00)
* **Action:** Click on **"Infrastructure"** in the sidebar. Click **"Next"** on the Scenario Orchestrator to advance to **Stage 5: Evacuation Optimization**.
* **On Screen:** The Infrastructure routing panel (`/infrastructure`). The map shows traffic lines. Evacuation Route 9 turns red (flooded), and a blinking green corridor lights up indicating **Route Alpha**.
* **Verbal Script:**
  > *"In Stage 5, evacuation corridors become compromised. As Route 9 floods, the Vytrix routing engine automatically calculates Route Alpha as the optimal evacuation path, immediately shunting digital street signs to guide citizens clear of hazards."*
* **Highlight Features:**
  - Interconnected node topology.
  - Dynamic path recalculation overlay.

---

### Act 6: Civilian SOS Broadcast (Stage 6) (3:00 - 3:30)
* **Action:** Switch to **Tab 2 (Civilian Link Mobile Simulator)**. Click the pulsing red **"TRIGGER EMERGENCY SOS"** button. Then, immediately switch back to **Tab 1 (Primary Command Deck)**.
* **On Screen:** A new blinking red alert icon appears on the map at the civilian coordinates, accompanied by a high-severity alert in the log ledger: `[SOS_ALERT] Block 12: Trapped citizens requesting supply drone drop`.
* **Verbal Script:**
  > *"Vytrix bridges the gap between operators and civilians. On the right, we see the Civilian Link mobile app. When a trapped citizen triggers an SOS, their telemetry and coordinates are instantly piped into the primary command deck. The OS automatically queues drone dispatch protocols to deliver emergency supply kits."*
* **Highlight Features:**
  - Cross-client synchronization using live WebSockets.
  - Instant maps coordinate plotting.

### Act 7: The Recovery & Wrap Up (3:30 - 4:00)
* **Action:** Click **"Next"** to advance to **Stage 7: Recovery Planning**. Navigate back to the **"Dashboard"**.
* **On Screen:** The map storm front clears, grid levels return to nominal ranges, and damage assessment drone logs populate the feed.
* **Verbal Script:**
  > *"Finally, we enter Stage 7: Recovery. The storm has passed, utility crews are dispatched, and system grids normalize. By automating the sync between alerts, citizens, and AI analysis, Vytrix turns operational chaos into structured intelligence. Thank you."*

---

## 🎥 Tips for an Award-Winning Recording
1. **Use Autoplay as a backup:** If you don't want to click "Next" manually, you can open `/dashboard?autoplay=true` and let the timer advance the stages every 8 seconds while you speak.
2. **Side-by-Side Windows:** Arrange the main Command Deck on the left (2/3 of screen) and the Civilian Mobile Link on the right (1/3 of screen) so viewers can see the WebSocket updates happen instantly without switching tabs.
3. **Toggle Map Modes:** Click the **"Thermal"** and **"Topology"** buttons on the map to show visual capability.

# Vytrix

> Turn chaotic environmental emergencies into structured tactical intelligence.

Vytrix is a cinematic, AI-native emergency operations operating system engineered for future smart cities and municipal command centers. 

Vytrix is optimized to tell an immersive story during live presentations, investor pitches, and screen-recorded video showcases. Rather than presenting generic static dashboards, the interface reacts dynamically to a simulated, cascading weather disaster scenario, providing a high-stakes, operationally believable command deck.

---

## Human Contribution vs AI-Assisted Development

Vytrix was built with a clear distinction between human engineering and AI acceleration. The core product vision, system architecture, and operational logic were entirely human-driven, while AI served as a powerful development accelerant.

**Human Engineered:**
- **Product Conception & Brand Direction:** The core narrative of a 7-stage cascading climate disaster and the tactical, command-deck UI design.
- **System Architecture & Layout:** Decoupling system pages under `/app/(system)/` and isolating shared state using a unified React Context provider (`StateProvider`).
- **Resilient Fallback Engines:** Implementing a canvas-based vector mapping system that acts as a high-fidelity offline backup if Mapbox keys or networks are unavailable.
- **Synchronizer Mechanics:** Direct design of the WebSocket communication loop and schema validation logic to sync multiple client frames (desktop command deck and civilian mobile feeds).
- **Core Security Architectures:** Edge-compatible in-memory sliding window rate-limiter, XSS filtering sanitizers, and global class-based Error Boundaries.

**AI Assisted:**
- **Scaffolding Components:** Accelerating baseline layout creation and icons importing (Lucide-React).
- **Refactoring & Modularization:** Generating structural imports updates and moving legacy components during project re-organization.
- **Documentation & Diagrams:** Accelerating the creation of formatted tables, markdown structural grids, and Mermaid diagrams.
- **FastAPI Endpoint Boilerplate:** Speeding up the declaration of Pydantic schemas and mock log lists.

This hybrid approach allowed us to maintain strict architectural control and performance while accelerating front-end iterations and styling.

---

## Development Journey

The engineering journey of Vytrix followed a structured progression from problem identification to deployment:

**Problem** → **Research** → **Architecture** → **Design** → **Backend** → **AI Layer** → **Automation** → **Deployment**

Climate disasters are increasing in frequency and severity. In high-stress scenarios, first responders and municipal operators are overwhelmed by disjointed telemetry data—uncoordinated flood models, siloed power grid readouts, overloaded hospital registries, and unrouted civilian panic. 

We designed Vytrix to solve this cognitive overload. We researched the core variables of storm-to-recovery lifecycles and mapped them into a **7-Stage Cascading Disaster Timeline**. We designed a state synchronizer that connects desktop controllers to mobile civilian feeds, ensuring unified information flow. We created an AI Copilot that acts as a tactical advisor, generating incident-specific response options. Finally, we engineered the UI to feel premium and immersive, utilizing HSL-tailored dark modes and light-stroke indicators to simulate aerospace military command consoles.

---

## Real-World Comparison

Vytrix is designed to complement existing emergency databases and public alert channels by focusing on real-time operational intelligence and cinematic data synthesis.

| Capabilities | Vytrix OS | Palantir Gotham | FEMA IPAWS | PagerDuty |
| :--- | :--- | :--- | :--- | :--- |
| **Realtime Scenario Synchronization** | **Yes (WebSocket Core)** | Yes (Proprietary) | No | Limited |
| **Multi-Client Simulation Feed** | **Yes (Desktop & Mobile Sync)**| Yes | No | No |
| **Offline Map Vector Engine Fallback** | **Yes (HTML Canvas Core)** | No | No | No |
| **AI Copilot with Action Recommendations**| **Yes (Contextual Prompts)**| Yes (AIP Add-on) | No | Limited |
| **Bento Environmental Digital Twin** | **Yes (Visual Grid UI)** | Yes | No | No |
| **Lightweight Edge Middleware Rate Limits**| **Yes (In-Memory Sliding)** | Yes | No | No |
| **Zero-Configuration Fallbacks** | **Yes (Self-Heals Render Faults)**| No | No | No |

---

## Architecture

Vytrix employs a modern, decoupled architecture designed for realtime operational intelligence. The diagram below shows how state propagates from the Scenario Deck down to all views:

```mermaid
graph TD
    subgraph Client Application (Next.js 15)
        UI[page.tsx / Dashboard Home]
        State[StateProvider / React Context]
        MapBox[MapboxMap / Canvas Vector Engine]
        Copilot[Copilot AI Panel]
        Mobile[Mobile / Civilian Link SOS]
        Boundary[React ErrorBoundary]
    end

    subgraph Security Middleware
        MW[middleware.ts / Next Edge]
        RL[rate-limit.ts / Sliding Window]
        Sanitizer[sanitize.ts / XSS Filter]
    end

    subgraph Synchronizer Backend (FastAPI)
        API[FastAPI Router / REST]
        WS[WebSocket Endpoint /ws/scenario]
        DB[In-Memory SystemState]
    end

    %% Network & Request Flows
    UI <--> State
    State <--> WS
    WS <--> DB
    UI -- REST API --> MW
    MW --> RL
    MW --> Sanitizer
    MW --> API
    
    %% Dynamic Fallbacks
    MapBox -.->|Offline Fallback| UI
    Boundary -.->|Catches Crashes| UI
```

- **StateProvider:** Handles current stage coordinates and triggers re-renders across all active widgets (radar sweeps, hospital load dials, grid levels, and log entries).
- **Next.js Edge Middleware:** Protects API channels using in-memory sliding window throttle rules without relying on external databases.
- **FastAPI State Engine:** Manages scenario states and broadcasts update packages to connected WebSocket channels.
- **Canvas Vector Mapping Fallback:** Runs directly in the browser. If Mapbox is blocked or has a bad token, it renders a high-performance interactive grid simulating meteorological vectors.

---

## Security & Resilience Layer

This project was built with security-first engineering principles to guarantee high uptime and stability:

- **Edge Rate Limiting:** Intercepts requests and tracks clients using an inline sliding window log to block resource exhaustion.
- **Input Sanitization:** AI Copilot prompt submissions are processed through sanitizers, stripping script tags and event handlers to mitigate XSS risks.
- **State Reconnection Loop:** The WebSocket listener uses exponential backoff reconnection loops and schema checks to validate payload variables, preventing console crash spam.
- **Graceful Render Fallbacks:** A global class-based React `ErrorBoundary` captures rendering runtime exceptions, replacing potential blank screens with a styled terminal diagnostics recovery panel.
- **Mapbox GL Resiliency:** If a custom Mapbox API key is missing or networks degrade, the map layer degrades gracefully to an offline Canvas vector rendering engine, showing pulsing radar grids and moving weather front coordinates automatically.

---

## 🌪️ The Cinematic Disaster Timeline (7-Stage Sync)

Vytrix contains a persistent **Scenario Controller** widget. Changing the stage advances all connected views (e.g. desktop command centers, charts, and civilian link phone feeds) instantly:

1. **Stage 1: Cyclone Detected** — Category 4 storm front tracked 120km offshore. Radar sweeps active.
2. **Stage 2: Flood Propagation** — Sector 7 South levee breach detected. Inundation overlays trigger on the map.
3. **Stage 3: Infrastructure Stress** — Floodwaters shut down Substation 4. Power grid load surges to 98%.
4. **Stage 4: Hospitals Overloaded** — Triage metrics at Mercy Memorial exceed capacity limits (112%).
5. **Stage 5: Evacuation Optimization** — Evac Route 9 is compromised; navigation recalculates to Route Alpha.
6. **Stage 6: Citizen Alerts** — Civilian Link dispatches emergency SMS pushes. Drones deploy emergency kits.
7. **Stage 7: Recovery Planning** — Storm front clears. Utility crews deploy for damage scans. Grid status normalizes.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Core** | Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Lucide Icons |
| **Backend Core** | FastAPI, Uvicorn, Python 3, Pydantic v2 |
| **State & Feeds** | WebSockets, Event Broadcast Pipeline, React Context |
| **Data Visuals** | Recharts, Mapbox GL JS, HTML5 Canvas Rendering |
| **Resilience & Security** | Next.js Middleware, XSS Sanitizers, React ErrorBoundary, Sliding-Window Limiter |

---

## Recommended Demo Flow

To experience the full capabilities of Vytrix, we recommend the following simulation flow:

1. **Launch Autoplay:** Open `http://localhost:3001/?autoplay=true`. Watch the diagnostics panel boot up and redirect to the dashboard. The simulation will begin automatically.
2. **Track the Cyclone (Stage 0):** Observe the pulsing radar rings on the map tracking the storm front.
3. **Inspect the Flood Breach (Stage 1-2):** Observe the flood overlays on the map and look at the Grid Load dials peaking as Substation 4 drops offline.
4. **Consult Copilot AI (Stage 3-4):** Click on the AI Copilot widget and ask: *"How should we handle hospital loads?"* or *"What is our grid status?"*. Check the instant action recommendation cards.
5. **Simulate Evacuation Routing (Stage 5):** Look at the map calculating the safest dynamic corridor (Route Alpha) as dynamic road hazards block the highway.
6. **Connect Civilian Link (Stage 6):** Open `/mobile` in a split window or secondary screen. Watch SOS signals populate on the command center as citizens request supply drone drops.
7. **Complete Recovery (Stage 7):** Watch the storm clear, utility assessment logs generate, and grid metrics stabilize to normal parameters.

---

## Local Development

Follow these steps to run the full synced simulation environment locally:

### 1. Boot the FastAPI State Synchronizer
Initialize the python virtual environment, install requirements, and run the server process:
```bash
# Set up venv
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install -r src/backend/requirements.txt

# Start the uvicorn live channel on port 8000
uvicorn src.backend.main:app --port 8000 --reload
```

### 2. Launch the Next.js Frontend
In a separate terminal, install node dependencies and launch the Turbopack dev server:
```bash
# Install node packages
npm install

# Run hot-reload dev environment
npm run dev
```
Open `http://localhost:3001/?autoplay=true` to boot straight into autoplay mode, or `http://localhost:3001` for standard entry.

*(Note: If port 3000 is occupied, Next.js automatically mounts to port 3001. You can run `python3 verify.py` inside the scratch folder to verify that both the backend and frontend are online).*

---

Vytrix transforms chaotic environmental emergencies into structured tactical intelligence.

- **GitHub Repository:** [Vytrix Source Code](https://github.com/Karan7815/Vytrix)
- **Live Deployment:** [vytrix-os.net](https://vytrix-os.net)
- **Team Credits:** Developed by the Vytrix Command OS Engineering Team.
- **License:** MIT License

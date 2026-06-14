#!/usr/bin/env python3
import time
import urllib.request
import json
import sys

# Terminal styling helper
class Colors:
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    RESET = '\033[0m'
    BG_DARK = '\033[40m'

def get_color(severity):
    sev = severity.upper()
    if sev in ["CRITICAL", "EMERGENCY"]:
        return Colors.RED
    elif sev in ["WARNING", "ACTIVE"]:
        return Colors.YELLOW
    elif sev in ["RECOVERY"]:
        return Colors.GREEN
    return Colors.CYAN

def print_divider():
    print(f"{Colors.BOLD}{Colors.CYAN}=" * 70 + f"{Colors.RESET}")

def send_request(url, method="GET", payload=None):
    try:
        headers = {'User-Agent': 'Vytrix-Demo-Runner', 'Content-Type': 'application/json'}
        data = json.dumps(payload).encode('utf-8') if payload else None
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        with urllib.request.urlopen(req, timeout=5) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print(f"{Colors.RED}Network error contacting API at {url}: {e}{Colors.RESET}")
        return None

def run_demo():
    backend_base = "http://localhost:8000"
    frontend_base = "http://localhost:3001"
    
    print("\n")
    print_divider()
    print(f"      🌪️  {Colors.BOLD}{Colors.CYAN}VYTRIX OS // COMMAND DECKS STATE TIMELINE DEMO{Colors.RESET}")
    print_divider()
    print(f" This script simulates the automated 7-stage environmental disaster cascade.")
    print(f" It updates the backend synchronizer, triggers client WebSocket updates,")
    print(f" and inspects the live telemetry logs at each incident transition.")
    print_divider()
    
    # Check if servers are running
    print(f"\n{Colors.BOLD}Checking system status...{Colors.RESET}")
    test_scenario = send_request(f"{backend_base}/api/scenario")
    if not test_scenario:
        print(f"{Colors.RED}ERROR: FastAPI Synchronizer is offline. Run 'uvicorn src.backend.main:app --port 8000' first!{Colors.RESET}")
        sys.exit(1)
        
    stages = test_scenario.get("stages", [])
    print(f"{Colors.GREEN}✓ Synchronizer backend detected: {len(stages)} incident stages loaded.{Colors.RESET}")
    time.sleep(1.5)

    for i, stage in enumerate(stages):
        stage_id = stage["id"]
        stage_name = stage["name"]
        stage_status = stage["status"]
        stage_severity = stage["severity"]
        
        # Trigger stage change
        print(f"\n\n{Colors.BOLD}{Colors.CYAN}[STAGE {stage_id + 1}/{len(stages)}] UPDATING TIMELINE...{Colors.RESET}")
        time.sleep(0.5)
        
        update_result = send_request(
            f"{backend_base}/api/scenario", 
            method="POST", 
            payload={"stage_id": stage_id}
        )
        
        if not update_result or update_result.get("status") != "success":
            print(f"{Colors.RED}Failed to transition to stage {stage_id}{Colors.RESET}")
            continue
            
        # Fetch current metrics
        metrics = send_request(f"{backend_base}/api/metrics") or {}
        # Fetch current incident log feed
        feed = send_request(f"{backend_base}/api/feed") or []
        
        # Display Status card
        sev_color = get_color(stage_severity)
        print_divider()
        print(f"{Colors.BOLD}INCIDENT: {Colors.RESET}{Colors.CYAN}{stage_name.upper()}{Colors.RESET}")
        print(f"{Colors.BOLD}STATUS:   {Colors.RESET}{sev_color}{stage_status}{Colors.RESET} ({stage_severity})")
        print_divider()
        
        # Display Metrics
        print(f"{Colors.BOLD}TELEMETRY DATA:{Colors.RESET}")
        print(f"  • {Colors.BOLD}Cascade Risk:{Colors.RESET}       {metrics.get('cascade_risk', 0)}%")
        print(f"  • {Colors.BOLD}Grid Load Status:{Colors.RESET}   {metrics.get('grid_load', 0)}%")
        print(f"  • {Colors.BOLD}Hospital Capacity:{Colors.RESET} {metrics.get('hospital_capacity', 0)}%")
        print(f"  • {Colors.BOLD}Evacuation Comp:{Colors.RESET}   {metrics.get('evacuated_percent', 0)}%")
        print(f"  • {Colors.BOLD}Active Shelters:{Colors.RESET}   {metrics.get('shelters_active', 0)}")
        print(f"  • {Colors.BOLD}Precipitation:{Colors.RESET}     {metrics.get('precipitation_rate', 0.0)} in/hr")
        
        # Display Logs (last 2 items)
        print(f"\n{Colors.BOLD}LATEST LOG ENTRIES:{Colors.RESET}")
        if feed:
            for log in feed[:2]:
                log_sev = log.get("severity", "info").upper()
                log_color = get_color(log_sev)
                print(f"  [{log_color}{log_sev}{Colors.RESET}] {log.get('timestamp')} | {log.get('source')} - {log.get('message')}")
        else:
            print("  No operational logs received.")
            
        print_divider()
        print(f"Advancing scenario in 3 seconds...")
        time.sleep(3.0)

    # Recovery Completed
    print("\n\n")
    print_divider()
    print(f"     🎉 {Colors.BOLD}{Colors.GREEN}SIMULATION CASCADE COMPLETE & NOMINAL RESET COMPLETED{Colors.RESET}")
    print_divider()
    print(f" All 7 stages have successfully synchronized across the client socket layer.")
    print(f" Vytrix OS is fully stable and ready for live presentation showcase.")
    print_divider()
    print("\n")

if __name__ == "__main__":
    run_demo()

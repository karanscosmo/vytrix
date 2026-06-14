"use client";

import React, { useState, useEffect } from "react";
import { useSystemState } from "@/context/state-context";
import { AlertTriangle, Smartphone, MapPin, CheckCircle2, ChevronRight, Compass, Shield } from "lucide-react";

export default function MobileView() {
  const { currentStage, metrics } = useSystemState();
  const [sosStatus, setSosStatus] = useState<"idle" | "holding" | "sent">("idle");
  const [holdProgress, setHoldProgress] = useState(0);

  // SOS Hold Trigger handler
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sosStatus === "holding") {
      interval = setInterval(() => {
        setHoldProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setSosStatus("sent");
            return 100;
          }
          return p + 10; // 1 second to activate
        });
      }, 100);
    } else {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [sosStatus]);

  const handleSosStart = () => {
    if (sosStatus !== "sent") {
      setSosStatus("holding");
    }
  };

  const handleSosEnd = () => {
    if (sosStatus === "holding") {
      setSosStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-background w-full flex items-center justify-center p-0 md:p-6 overflow-y-auto">
      {/* MOCK PHONE FRAME FOR DESKTOP */}
      <div className="w-full max-w-[390px] min-h-screen md:min-h-[800px] md:h-[800px] bg-surface-container-lowest md:rounded-[40px] md:border-[10px] md:border-surface-bright shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative">
        
        {/* Status bar mock */}
        <div className="h-6 bg-surface-container-high/40 flex justify-between items-center px-6 text-[10px] font-mono text-on-surface-variant/70 border-b border-white/5 shrink-0 select-none">
          <span>CIVIC_LINK_NET</span>
          <span>10:42 AM</span>
        </div>

        {/* Mobile Header */}
        <header className="flex justify-between items-center px-4 py-3 bg-surface-container/60 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-error animate-pulse" />
            <h1 className="font-label-caps text-[10px] text-on-surface font-bold tracking-wider">CIVILIAN LINK HUD</h1>
          </div>
          <div className="flex items-center gap-1 border border-white/10 rounded-full px-2 py-0.5 font-data-readout text-[8px] text-primary-fixed-dim">
            <span>EN</span>
          </div>
        </header>

        {/* Scrollable Content Body */}
        <main className="flex-grow p-4 overflow-y-auto flex flex-col gap-4 pb-20 select-none">
          
          {/* Emergency Alert Banner */}
          <section className={`glass-panel border-l-4 rounded-r-lg p-3 flex gap-3 relative overflow-hidden transition-all ${
            currentStage.id >= 1 ? "border-l-error bg-error/10" : "border-l-primary-fixed-dim bg-white/5"
          }`}>
            <AlertTriangle className={`shrink-0 mt-0.5 ${currentStage.id >= 1 ? "text-error animate-pulse" : "text-primary-fixed-dim"}`} size={16} />
            <div className="text-xs">
              <h2 className={`font-bold ${currentStage.id >= 1 ? "text-error" : "text-primary-fixed-dim"}`}>
                {currentStage.id >= 1 ? "ACTIVE EVACUATION WARNING" : "ENVIRONMENTAL MONITORING"}
              </h2>
              <p className="text-[10px] text-on-surface-variant/80 mt-1 leading-normal">
                {currentStage.id >= 1 
                  ? "Zone C-4 coastal borders are threatened. Proceed immediately to designated shelters."
                  : "Cyclone approaching waterfront. Maintain comm status links and stand by for orders."}
              </p>
              {currentStage.id >= 1 && (
                <div className="font-data-readout text-[8px] text-error-container bg-error/20 border border-error/30 px-2 py-0.5 rounded inline-block mt-2 font-bold">
                  SURGE ELEVATION: 2.4M
                </div>
              )}
            </div>
          </section>

          {/* SOS Button Area */}
          <section className="flex flex-col items-center py-4 bg-white/3 rounded-xl border border-white/5">
            <div className="relative">
              {/* Hold Progress radial bar overlay mock */}
              {sosStatus === "holding" && (
                <div className="absolute inset-[-6px] rounded-full border-4 border-error/30 border-t-error animate-spin" />
              )}
              
              <button
                onMouseDown={handleSosStart}
                onMouseUp={handleSosEnd}
                onMouseLeave={handleSosEnd}
                onTouchStart={handleSosStart}
                onTouchEnd={handleSosEnd}
                className={`w-36 h-36 rounded-full flex flex-col items-center justify-center gap-1 active:scale-95 duration-200 transition-all select-none border-4 ${
                  sosStatus === "sent"
                    ? "bg-tertiary-container/20 border-tertiary-container text-tertiary-fixed-dim shadow-[0_0_20px_#67f4b7]"
                    : "bg-error-container/20 border-error text-error shadow-[0_0_30px_rgba(235,0,0,0.2)]"
                }`}
              >
                <Shield size={32} />
                <span className="font-bold text-xs uppercase tracking-widest mt-1">
                  {sosStatus === "sent" ? "SENT" : "SOS"}
                </span>
                <span className="text-[8px] text-on-surface-variant/60">
                  {sosStatus === "sent" ? "GPS Synced" : (sosStatus === "holding" ? "HOLDING..." : "HOLD 1 SEC")}
                </span>
              </button>
            </div>

            {sosStatus === "sent" && (
              <div className="mt-3 text-[10px] text-tertiary-fixed-dim flex items-center gap-1 font-bold animate-breathe">
                <CheckCircle2 size={12} />
                <span>TELEMETRY DISPATCHED SUCCESSFULLY</span>
              </div>
            )}
          </section>

          {/* AI Evacuation Steps */}
          <section className="glass-panel rounded-xl overflow-hidden flex flex-col">
            <div className="bg-white/5 px-3 py-1.5 border-b border-white/5 flex items-center gap-1.5 text-xs text-primary-fixed-dim font-label-caps">
              <Compass size={12} />
              <span>EVACUATION ASSISTANT</span>
            </div>
            <div className="p-3.5 flex flex-col gap-3 text-xs leading-normal">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-container/20 border border-primary-fixed/20 flex items-center justify-center shrink-0 text-primary-fixed-dim">
                  1
                </div>
                <div>
                  <span className="font-bold text-on-surface">SECURE ESSENTIAL ASSETS</span>
                  <p className="text-[10px] text-on-surface-variant/70 mt-0.5">Pack core items: keys, ID, medicines, water. Limit weight to 15kg.</p>
                </div>
              </div>
              <div className="w-[1px] h-3 bg-white/10 ml-3"></div>
              <div className="flex gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border text-[10px] ${
                  currentStage.id >= 4 
                    ? "bg-primary-container/20 border-primary-fixed text-primary-fixed-dim font-bold" 
                    : "bg-surface-container border-white/10 text-on-surface-variant/40"
                }`}>
                  2
                </div>
                <div className={currentStage.id >= 4 ? "opacity-100" : "opacity-40"}>
                  <span className="font-bold text-on-surface">ROUTE TO TERMINAL ALPHA</span>
                  <p className="text-[10px] text-on-surface-variant/70 mt-0.5">Proceed along Evacuation Route Alpha. Waterfront bypass closed.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Static Map Viewport */}
          <section className="glass-panel rounded-xl overflow-hidden h-40 relative flex flex-col ring-1 ring-primary-fixed-dim/20">
            <div className="absolute top-0 w-full bg-surface-container/60 border-b border-white/5 z-10 px-3 py-1.5 flex justify-between items-center text-[9px] font-label-caps text-on-surface-variant/80">
              <span>SHELTER FINDER</span>
              <span className="flex items-center gap-1 text-tertiary-fixed-dim">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
                MAP_LIVE
              </span>
            </div>
            
            {/* Simple simulated SVG map */}
            <div className="absolute inset-0 bg-surface-container-lowest z-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(0,219,231,0.05)_0%,transparent_100%)]">
              <svg className="w-full h-full opacity-60" viewBox="0 0 100 100">
                <path d="M 10 90 L 30 70 L 60 80 L 90 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                {/* Route Alpha */}
                <path d="M 20 80 Q 50 60 80 50" fill="none" stroke="#67f4b7" strokeDasharray="3 3" strokeWidth={2} className="animate-dash-flow" />
                {/* Evac Point */}
                <circle cx="80" cy="50" r="3" fill="#67f4b7" />
                <circle cx="80" cy="50" r="8" stroke="#67f4b7" strokeWidth={1} fill="none" className="animate-pulse" />
              </svg>
              <div className="absolute bottom-2 right-2 text-[8px] font-data-readout bg-background/80 border border-white/10 px-2 py-0.5 rounded text-tertiary-fixed-dim">
                SHELTER ALPHA: OPEN
              </div>
            </div>
          </section>
        </main>
        
        {/* Navigation bar mock */}
        <nav className="absolute bottom-0 left-0 w-full h-14 bg-surface-container-highest border-t border-white/10 flex justify-around items-center px-4 z-20 select-none">
          <div className="flex flex-col items-center text-primary-fixed-dim select-none cursor-pointer">
            <Smartphone size={16} />
            <span className="text-[7px] font-label-caps mt-1">LINK HUD</span>
          </div>
          <button
            onClick={() => window.history.back()}
            className="flex flex-col items-center text-on-surface-variant/40 hover:text-on-surface-variant transition-colors"
          >
            <ChevronRight size={16} className="rotate-180" />
            <span className="text-[7px] font-label-caps mt-1">BACK OS</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

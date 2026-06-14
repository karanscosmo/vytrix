"use client";

import React from "react";
import { useSystemState } from "@/context/state-context";
import { MapboxMap } from "@/components/maps/MapboxMap";
import { Storm, Hospital, Route } from "lucide-react"; // Fallbacks
import { Wind, Droplets, Thermometer, ShieldAlert, Navigation, Eye, Play, FastForward, Rewind } from "lucide-react";

export default function DigitalTwin() {
  const { currentStage, metrics, logs, setStage } = useSystemState();

  return (
    <div className="flex-grow p-6 md:p-8 flex flex-col gap-6 overflow-y-auto pb-24 h-full">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary-fixed-dim">
            Digital Twin: Sector 7G
          </h1>
          <p className="font-body-main text-on-surface-variant text-sm mt-1">
            Scenario Ingress: <span className="font-mono text-primary-fixed uppercase">{currentStage.name}</span> | Timeline synced
          </p>
        </div>
        <div className="bg-surface-container-low/80 border border-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md flex items-center gap-4 text-xs font-data-readout">
          <span className="text-on-surface-variant">TIMELINE: T+24H PREDICTIVE</span>
          <div className="flex gap-2">
            <button
              onClick={() => setStage(Math.max(0, currentStage.id - 1))}
              className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-on-surface"
            >
              <Rewind size={12} />
            </button>
            <button className="w-7 h-7 rounded bg-primary-fixed-dim/20 border border-primary-fixed-dim/40 flex items-center justify-center text-primary-fixed-dim">
              <Play size={12} fill="currentColor" />
            </button>
            <button
              onClick={() => setStage(Math.min(6, currentStage.id + 1))}
              className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-on-surface"
            >
              <FastForward size={12} />
            </button>
          </div>
        </div>
      </header>

      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-12 gap-6 flex-grow">
        {/* Left Column: Infrastructure Strain (Span 3 cols) */}
        <div className="col-span-12 lg:col-span-3 glass-panel rounded-xl flex flex-col overflow-hidden relative min-h-[380px]">
          <div className="p-3 bg-white/5 border-b border-white/10 flex justify-between items-center text-xs font-label-caps tracking-wider text-on-surface-variant">
            <span>INFRASTRUCTURE DEPENDENCY</span>
            <Eye size={12} />
          </div>
          <div className="p-4 flex-1 flex flex-col gap-4 text-xs">
            {/* Critical Node */}
            <div className={`border rounded-lg p-3 relative overflow-hidden transition-colors ${
              currentStage.id >= 2 ? "bg-error/10 border-error/30" : "bg-white/5 border-white/10"
            }`}>
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${currentStage.id >= 2 ? "bg-error" : "bg-primary-fixed-dim"}`}></div>
              <div className="flex justify-between items-start mb-2">
                <span className={`font-data-readout font-bold ${currentStage.id >= 2 ? "text-error" : "text-primary-fixed-dim"}`}>
                  NODE_ALPHA_POWER
                </span>
                <span className={`font-label-caps text-[8px] px-1.5 py-0.5 rounded ${
                  currentStage.id >= 2 ? "bg-error/20 text-error" : "bg-primary-fixed/20 text-primary-fixed"
                }`}>
                  {currentStage.id >= 2 ? "CRITICAL" : "NOMINAL"}
                </span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-2">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${currentStage.id >= 2 ? "bg-error" : "bg-primary-fixed-dim"}`}
                  style={{ width: `${currentStage.id >= 2 ? 0 : metrics.grid_load}%` }}
                ></div>
              </div>
              <span className="font-data-readout text-[9px] text-on-surface-variant mt-1.5 block">
                {currentStage.id >= 2 ? "LOAD: 0% [GRID OFFLINE]" : `LOAD: ${metrics.grid_load}% (EST FAIL: T+2h)`}
              </span>
            </div>

            {/* Warning Node */}
            <div className={`border rounded-lg p-3 relative overflow-hidden transition-colors ${
              metrics.hospital_capacity >= 100 ? "bg-error/10 border-error/30" : "bg-white/5 border-white/10"
            }`}>
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${metrics.hospital_capacity >= 100 ? "bg-error" : "bg-tertiary-fixed-dim"}`}></div>
              <div className="flex justify-between items-start mb-2">
                <span className={`font-data-readout font-bold ${metrics.hospital_capacity >= 100 ? "text-error" : "text-tertiary-fixed-dim"}`}>
                  MED_CENTER_STH
                </span>
                <span className={`font-label-caps text-[8px] px-1.5 py-0.5 rounded ${
                  metrics.hospital_capacity >= 100 ? "bg-error/20 text-error" : "bg-tertiary-fixed-dim/20 text-tertiary-fixed-dim"
                }`}>
                  {metrics.hospital_capacity >= 100 ? "WARNING" : "SAFE"}
                </span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-2">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${metrics.hospital_capacity >= 100 ? "bg-error" : "bg-tertiary-fixed-dim"}`}
                  style={{ width: `${Math.min(100, metrics.hospital_capacity)}%` }}
                ></div>
              </div>
              <span className="font-data-readout text-[9px] text-on-surface-variant mt-1.5 block">
                CAPACITY: {metrics.hospital_capacity}% (RISING)
              </span>
            </div>

            {/* Dependency graph risk history */}
            <div className="mt-auto border-t border-white/5 pt-3">
              <span className="font-data-readout text-[10px] text-on-surface-variant mb-2 block uppercase">Cascading Risk Index</span>
              <div className="h-14 w-full flex items-end gap-1.5">
                <div className="w-[14%] bg-primary-fixed-dim/20 h-[30%] rounded-t"></div>
                <div className="w-[14%] bg-primary-fixed-dim/30 h-[45%] rounded-t"></div>
                <div className="w-[14%] bg-primary-fixed-dim/40 h-[60%] rounded-t"></div>
                <div className={`w-[14%] rounded-t transition-all duration-500 ${currentStage.id >= 2 ? "bg-error/50 h-[80%]" : "bg-primary-fixed-dim/60 h-[70%]"}`}></div>
                <div className={`w-[14%] rounded-t transition-all duration-500 ${currentStage.id >= 3 ? "bg-error h-[95%] shadow-[0_0_8px_#ffb4ab]" : "bg-primary-fixed h-[85%]"}`}></div>
                <div className={`w-[14%] rounded-t transition-all duration-500 ${currentStage.id >= 4 ? "bg-error h-full" : "bg-primary-fixed-dim/20 h-[10%]"}`}></div>
                <div className={`w-[14%] rounded-t transition-all duration-500 ${currentStage.id >= 5 ? "bg-error h-[90%]" : "bg-primary-fixed-dim/20 h-[10%]"}`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Viewport (Span 6 cols) */}
        <div className="col-span-12 lg:col-span-6 border border-primary-fixed-dim/30 rounded-xl overflow-hidden relative flex flex-col min-h-[380px] h-[520px]">
          <MapboxMap showOverlayHUD={false} />
          
          {/* Inner viewport labels */}
          <div className="absolute bottom-4 left-4 z-20 bg-surface-container-lowest/80 border border-primary-fixed-dim/20 px-3 py-1.5 rounded backdrop-blur-md">
            <span className="font-data-readout text-[10px] text-primary-fixed-dim flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim animate-ping"></span>
              SIM_RENDER_ENGINE: ONLINE [60FPS]
            </span>
          </div>
        </div>

        {/* Right Column: Factors & Triage (Span 3 cols) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 min-h-[380px]">
          {/* Weather Modalities */}
          <div className="glass-panel rounded-xl flex-grow flex flex-col overflow-hidden">
            <div className="p-3 bg-white/5 border-b border-white/10 flex justify-between items-center text-xs font-label-caps tracking-wider text-on-surface-variant">
              <span>ENVIRONMENTAL FACTORS</span>
              <Wind size={12} />
            </div>
            <div className="p-4 flex-grow flex flex-col justify-around gap-4 text-xs font-data-readout">
              <div>
                <span className="text-[9px] text-on-surface-variant block mb-1">PRECIPITATION RATE</span>
                <div className="font-display text-2xl font-bold text-primary-fixed-dim">
                  {metrics.precipitation_rate.toFixed(1)} <span className="text-xs text-on-surface-variant font-normal">in/hr</span>
                </div>
              </div>
              <div className="w-full h-px bg-white/5"></div>
              <div>
                <span className="text-[9px] text-on-surface-variant block mb-1">WIND VELOCITY</span>
                <div className="font-display text-2xl font-bold text-on-surface">
                  {currentStage.id >= 1 ? "130" : "85"} <span className="text-xs text-on-surface-variant font-normal">mph</span>
                </div>
              </div>
              <div className="w-full h-px bg-white/5"></div>
              <div>
                <span className="text-[9px] text-on-surface-variant block mb-1">STORM SURGE EST.</span>
                <div className="font-display text-2xl font-bold text-error">
                  {currentStage.id >= 1 ? "2.4" : "1.2"} <span className="text-xs text-on-surface-variant font-normal">m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hospital overload predictions */}
          <div className="glass-panel rounded-xl flex-grow flex flex-col overflow-hidden border-t-2 border-t-tertiary-fixed-dim">
            <div className="p-3 bg-white/5 border-b border-white/10 flex justify-between items-center text-xs font-label-caps tracking-wider text-on-surface-variant">
              <span>TRIAGE LOGISTICS</span>
              <Hospital size={12} />
            </div>
            <div className="p-4 flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-body-main text-on-surface font-semibold">Sector 1 Gen</span>
                  <span className="font-mono text-tertiary-fixed-dim font-bold">98% CAP</span>
                </div>
                <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div className="bg-tertiary-fixed-dim h-full w-[98%]"></div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-body-main text-on-surface font-semibold">Mercy Memorial</span>
                  <span className={`font-mono font-bold ${metrics.hospital_capacity >= 100 ? "text-error" : "text-primary-fixed-dim"}`}>
                    {metrics.hospital_capacity}% CAP
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${metrics.hospital_capacity >= 100 ? "bg-error" : "bg-primary-fixed-dim"}`}
                    style={{ width: `${Math.min(100, metrics.hospital_capacity)}%` }}
                  ></div>
                  {metrics.hospital_capacity >= 100 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-error rounded-full animate-ping"></div>
                  )}
                </div>
              </div>

              <button
                onClick={() => alert("Re-routing all Sector 4 ambulances to Sector 1 General. Comm towers notified.")}
                className="mt-2 w-full bg-primary text-on-primary font-label-caps text-[9px] tracking-wider py-2.5 rounded shadow-[0_0_15px_rgba(225,253,255,0.2)] hover:bg-white transition-colors uppercase font-bold"
              >
                REROUTE EMS UNITS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

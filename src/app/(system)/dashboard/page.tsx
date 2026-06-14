"use client";

import React from "react";
import { useSystemState } from "@/context/state-context";
import { MapboxMap } from "@/components/maps/MapboxMap";
import { Activity, ShieldAlert, Cpu, Users, Zap, Droplets, Radio, Bell } from "lucide-react";

export default function Dashboard() {
  const { currentStage, metrics, logs } = useSystemState();

  // Color code severity levels
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-error border-error/20 bg-error/5";
      case "warning":
        return "text-secondary-fixed-dim border-secondary/20 bg-secondary/5";
      default:
        return "text-tertiary-fixed-dim border-tertiary/20 bg-tertiary/5";
    }
  };

  return (
    <div className="flex-grow p-6 md:p-8 flex flex-col gap-6 overflow-y-auto pb-24">
      {/* HEADER HUD BAR */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary-fixed-dim">
            EMERGENCY COMMAND CENTER
          </h1>
          <p className="font-body-main text-on-surface-variant text-sm mt-1">
            System Node: <span className="font-mono text-primary-fixed">CORE_METROPOLIS_LINK</span> | Monitoring active
          </p>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-low border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
          <span className="font-label-caps text-[10px] text-on-surface-variant">Global Cascade Risk:</span>
          <span className={`font-display text-xl font-bold ${metrics.cascade_risk >= 75 ? "text-error animate-pulse" : "text-primary-fixed-dim"}`}>
            {metrics.cascade_risk}%
          </span>
        </div>
      </header>

      {/* THREE COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: CORE HUD STATUS & LOGS */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Core HUD card */}
          <div className="glass-panel rounded-xl overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-fixed-dim/40 to-transparent"></div>
            <div className="bg-white/5 py-2.5 px-4 border-b border-white/5 flex items-center justify-between">
              <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider">SYSTEM STATUS</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-container opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary-container"></span>
              </span>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <h2 className="font-headline-md text-lg text-primary-fixed font-semibold tracking-tight">Vytrix Core HUD</h2>
              <div className="flex flex-col gap-1.5">
                <span className="font-label-caps text-[9px] text-on-surface-variant/70">CURRENT THREAT LEVEL</span>
                <span className={`font-data-readout text-xs px-2.5 py-1 rounded border inline-flex items-center gap-2 w-max ${
                  metrics.cascade_risk >= 75 ? "bg-error/15 border-error/30 text-error" : "bg-primary-fixed-dim/10 border-primary-fixed-dim/20 text-primary-fixed-dim"
                }`}>
                  <Activity size={12} className="animate-pulse" />
                  {currentStage.severity}: {currentStage.name}
                </span>
              </div>
              <div className="w-full h-px bg-white/10 my-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-1/3 bg-primary-fixed-dim blur-sm animate-[translateX_2s_infinite]"></div>
              </div>
              <div className="flex justify-between items-end mt-1">
                <div className="flex flex-col gap-1">
                  <span className="font-label-caps text-[9px] text-on-surface-variant/70">ASSETS ACTIVE</span>
                  <span className="font-display text-2xl font-bold text-on-surface">
                    {metrics.assets_deployed} <span className="text-xs text-on-surface-variant/50 font-normal">DEPLOYS</span>
                  </span>
                </div>
                <Cpu size={24} className="text-outline-variant opacity-40" />
              </div>
            </div>
          </div>

          {/* Scrolling Feed card */}
          <div className="glass-panel rounded-xl overflow-hidden shadow-2xl flex flex-col h-[280px]">
            <div className="bg-white/5 py-2.5 px-4 border-b border-white/5 flex items-center gap-2">
              <Bell size={12} className="text-primary-fixed-dim" />
              <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider">LIVE CRITICAL FEED</span>
            </div>
            <div className="p-4 flex-grow overflow-y-auto flex flex-col gap-3.5 relative">
              {logs.map((log, idx) => (
                <div key={idx} className={`flex gap-2.5 items-start border-l-2 pl-3 py-1 ${
                  log.severity === "critical" ? "border-error" : "border-primary-fixed-dim"
                }`}>
                  <div className="flex flex-col w-full text-xs">
                    <div className="flex justify-between w-full items-center mb-0.5">
                      <span className={`font-data-readout text-[8px] uppercase ${
                        log.severity === "critical" ? "text-error font-bold" : "text-primary-fixed-dim"
                      }`}>
                        {log.source}
                      </span>
                      <span className="font-mono text-[8px] text-on-surface-variant/40">{log.timestamp}</span>
                    </div>
                    <span className="font-body-main text-on-surface text-[11px] leading-snug">{log.message}</span>
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center py-12 text-xs text-on-surface-variant/40">No incidents reported.</div>
              )}
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: MAP HUD VIEWPORT */}
        <div className="lg:col-span-6 flex flex-col gap-4 h-[516px]">
          <MapboxMap />
        </div>

        {/* RIGHT COLUMN: INFRASTRUCTURE & PREDICTIONS */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Risk Card */}
          <div className="glass-panel rounded-xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-end border-b border-white/5 pb-3">
              <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider">PREDICTIVE STRESS</span>
              <span className={`font-display text-2xl font-bold ${metrics.cascade_risk >= 75 ? "text-error" : "text-primary-fixed-dim"}`}>
                {metrics.cascade_risk}%
              </span>
            </div>
            
            {/* Risk bar */}
            <div>
              <span className="font-label-caps text-[9px] text-on-surface-variant mb-1.5 block">CASCADE DAMAGE METRIC</span>
              <div className="w-full h-2 flex gap-1 bg-surface-container-high/40 rounded overflow-hidden">
                <div className={`h-full rounded-l transition-all duration-500 ${metrics.cascade_risk > 20 ? "bg-error/30" : "bg-transparent"}`} style={{ width: "20%" }}></div>
                <div className={`h-full transition-all duration-500 ${metrics.cascade_risk > 40 ? "bg-error/50" : "bg-transparent"}`} style={{ width: "20%" }}></div>
                <div className={`h-full transition-all duration-500 ${metrics.cascade_risk > 60 ? "bg-error/70" : "bg-transparent"}`} style={{ width: "20%" }}></div>
                <div className={`h-full transition-all duration-500 ${metrics.cascade_risk > 80 ? "bg-error shadow-[0_0_10px_rgba(255,180,171,0.5)]" : "bg-transparent"}`} style={{ width: "20%" }}></div>
                <div className="h-full bg-surface-container-highest/30 rounded-r" style={{ width: "20%" }}></div>
              </div>
              <span className="font-data-readout text-[8px] text-on-surface-variant/40 mt-1 block text-right">MODEL_CONFIDENCE: 94%</span>
            </div>
          </div>

          {/* Dependency Graph card */}
          <div className="glass-panel rounded-xl p-5 shadow-2xl flex flex-col gap-4">
            <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider border-b border-white/5 pb-2">
              GRID DEPENDENCY STATUS
            </span>
            <div className="relative h-32 w-full flex items-center justify-between px-2">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0"></div>
              
              {/* Node 1 */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded border flex items-center justify-center relative transition-all duration-500 ${
                  metrics.grid_load > 90 ? "bg-error-container/20 border-error animate-pulse" : "bg-surface-container border-primary-fixed-dim/30"
                }`}>
                  <Zap size={14} className={metrics.grid_load > 90 ? "text-error" : "text-primary-fixed-dim"} />
                  {metrics.grid_load > 90 && <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-error rounded-full animate-ping"></div>}
                </div>
                <span className="font-data-readout text-[8px] text-on-surface">GRID_SEC1</span>
              </div>

              {/* Node 2 */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded border flex items-center justify-center relative transition-all duration-500 ${
                  currentStage.id >= 1 ? "bg-error-container/20 border-error" : "bg-surface-container border-primary-fixed-dim/30"
                }`}>
                  <Droplets size={14} className={currentStage.id >= 1 ? "text-error" : "text-primary-fixed-dim"} />
                </div>
                <span className="font-data-readout text-[8px] text-on-surface">PUMP_STAT4</span>
              </div>

              {/* Node 3 */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded bg-surface-container border border-tertiary-container/30 flex items-center justify-center">
                  <Radio size={14} className="text-tertiary-container" />
                </div>
                <span className="font-data-readout text-[8px] text-on-surface">SAT_LINK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

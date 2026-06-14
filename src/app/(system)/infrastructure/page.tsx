"use client";

import React from "react";
import { useSystemState } from "@/context/state-context";
import { Cpu, RefreshCw, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

export default function Infrastructure() {
  const { currentStage, metrics, logs, forceSync } = useSystemState();

  // Determine asset specific status based on scenario stage
  const getAssetStatus = (assetName: string) => {
    if (assetName === "Energy Hub A") {
      return currentStage.id >= 2 
        ? { val: "OFFLINE", color: "text-error border-error/20 bg-error/5", percent: 0 }
        : { val: "OPTIMAL", color: "text-tertiary-fixed-dim border-tertiary/20 bg-tertiary/5", percent: 98 };
    }
    if (assetName === "Main Transit Artery") {
      return currentStage.id >= 4
        ? { val: "COMPROMISED", color: "text-error border-error/20 bg-error/5", percent: 45 }
        : { val: "NORMAL", color: "text-tertiary-fixed-dim border-tertiary/20 bg-tertiary/5", percent: 92 };
    }
    // Satellite
    return currentStage.id >= 2
      ? { val: "DEGRADED", color: "text-error border-error/20 bg-error/5", percent: 45 }
      : { val: "NOMINAL", color: "text-tertiary-fixed-dim border-tertiary/20 bg-tertiary/5", percent: 95 };
  };

  return (
    <div className="flex-grow p-6 md:p-8 flex flex-col gap-6 overflow-y-auto pb-24 h-full">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary-fixed-dim">
            INFRASTRUCTURE INTELLIGENCE
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed-dim opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-fixed-dim"></span>
            </span>
            <span className="font-label-caps text-[9px] text-on-surface-variant">
              LIVE MONITORING ACTIVE // SYSTEM STATUS: {currentStage.id >= 2 ? "CRITICAL" : "NOMINAL"}
            </span>
          </div>
        </div>
        <button
          onClick={forceSync}
          className="bg-primary-fixed-dim text-background px-4 py-2.5 font-label-caps text-[10px] font-bold rounded flex items-center gap-2 hover:bg-primary-fixed transition-colors shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]"
        >
          <RefreshCw size={12} className="animate-spin" style={{ animationDuration: "6s" }} />
          FORCE SYNC
        </button>
      </header>

      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: dependency network graph representation (Span 8) */}
        <div className="md:col-span-8 glass-panel rounded-xl relative overflow-hidden flex flex-col min-h-[400px]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-fixed-dim/40 to-transparent"></div>
          <div className="bg-white/5 py-2.5 px-4 border-b border-white/10 flex justify-between items-center text-xs font-label-caps tracking-wider text-on-surface-variant">
            <span>NODE DEPENDENCY NETWORK</span>
            <Cpu size={12} />
          </div>
          <div className="flex-grow relative p-4 flex items-center justify-center min-h-[340px]">
            {/* SVG Network visualization */}
            <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path
                className={`transition-colors duration-500 fill-none ${
                  currentStage.id >= 2 ? "stroke-error/40 stroke-2 animate-pulse" : "stroke-primary-fixed-dim/20 stroke-1"
                }`}
                d="M 20 50 Q 40 20 60 50 T 80 50"
              />
              <path
                className="stroke-primary-fixed-dim/20 stroke-1 fill-none"
                d="M 30 70 Q 50 80 70 60"
              />
              <path className="stroke-primary-fixed-dim/20 stroke-1 fill-none" d="M 20 50 L 30 70" />
              <path className="stroke-primary-fixed-dim/20 stroke-1 fill-none" d="M 60 50 L 70 60" />
            </svg>

            {/* Nodes positioning */}
            <div className="absolute top-[50%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className={`w-4.5 h-4.5 rounded-full border-2 border-background shadow-lg transition-all duration-500 ${
                currentStage.id >= 2 
                  ? "bg-error shadow-[0_0_15px_#ffb4ab]" 
                  : "bg-primary-fixed-dim shadow-[0_0_15px_#00dbe7]"
              }`}></div>
              <span className="font-label-caps text-[9px] text-on-surface mt-2">ENERGY HUB A</span>
            </div>

            <div className="absolute top-[20%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-3.5 h-3.5 bg-tertiary-fixed-dim rounded-full shadow-[0_0_10px_#6ffbbe] border-2 border-background"></div>
              <span className="font-label-caps text-[9px] text-on-surface mt-2">GRID SEC-1</span>
            </div>

            <div className="absolute top-[50%] left-[60%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full border-2 border-background shadow-lg transition-all duration-500 ${
                currentStage.id >= 2 
                  ? "bg-error shadow-[0_0_15px_#ffb4ab]" 
                  : "bg-primary-fixed-dim shadow-[0_0_20px_#00dbe7]"
              }`}></div>
              <span className="font-label-caps text-[9px] text-on-surface mt-2">MAIN ARTERY</span>
            </div>

            <div className="absolute top-[75%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className={`w-3.5 h-3.5 rounded-full border-2 border-background shadow-lg transition-all duration-500 ${
                currentStage.id >= 1 
                  ? "bg-error shadow-[0_0_10px_#ffb4ab]" 
                  : "bg-tertiary-fixed-dim shadow-[0_0_10px_#6ffbbe]"
              }`}></div>
              <span className="font-label-caps text-[9px] text-on-surface mt-2">SUBSTATION 4</span>
            </div>

            <div className="absolute top-[65%] left-[75%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full border-2 border-background shadow-lg transition-all duration-500 ${
                currentStage.id >= 2
                  ? "bg-error shadow-[0_0_15px_#ffb4ab]"
                  : "bg-tertiary-fixed-dim shadow-[0_0_15px_#6ffbbe]"
              }`}></div>
              <span className="font-label-caps text-[9px] text-on-surface mt-2">SAT COMMS</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: READOUT CARDS (Span 4) */}
        <div className="md:col-span-4 flex flex-col gap-6 w-full">
          {["Energy Hub A", "Main Transit Artery", "Satellite Comms"].map((assetName) => {
            const status = getAssetStatus(assetName);
            return (
              <div key={assetName} className={`glass-panel rounded-xl p-5 border-l-2 ${
                status.val === "OPTIMAL" || status.val === "NORMAL" || status.val === "NOMINAL" 
                  ? "border-l-tertiary-fixed-dim" 
                  : (status.val === "DEGRADED" ? "border-l-secondary-fixed-dim" : "border-l-error")
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-label-caps text-[8px] text-on-surface-variant/70 uppercase">ASSET SYSTEM</span>
                    <h3 className="font-headline-md text-base text-on-surface font-semibold mt-0.5">{assetName}</h3>
                  </div>
                  <span className={`font-data-readout text-[9px] px-2 py-0.5 rounded border ${status.color}`}>
                    {status.val}
                  </span>
                </div>
                <div className="w-full bg-surface-container-high h-1 mb-2 rounded overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      status.val === "OFFLINE" ? "bg-error" : "bg-primary-fixed-dim"
                    }`}
                    style={{ width: `${status.percent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[9px] text-on-surface-variant/60 font-mono">
                  <span>Capacity: {status.percent}%</span>
                  <span className="flex items-center gap-1">
                    {status.val === "OFFLINE" ? <AlertTriangle size={10} className="text-error" /> : <CheckCircle size={10} className="text-tertiary-fixed-dim" />}
                    {status.val === "OFFLINE" ? "Needs Attention" : "Synced"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM: SYSTEM EVENT LEDGER */}
        <div className="md:col-span-12 glass-panel rounded-xl flex flex-col overflow-hidden shadow-2xl">
          <div className="bg-white/5 py-2.5 px-4 border-b border-white/10 flex justify-between items-center text-xs font-label-caps tracking-wider text-on-surface-variant">
            <span>OPERATIONAL EVENT LEDGER</span>
          </div>
          <div className="p-4 overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-on-surface-variant/70 font-label-caps text-[9px]">
                  <th className="py-2.5 px-3">TIMESTAMP</th>
                  <th className="py-2.5 px-3">ASSET NODE</th>
                  <th className="py-2.5 px-3">LEDGER EVENT DETAILS</th>
                  <th className="py-2.5 px-3">SEVERITY</th>
                </tr>
              </thead>
              <tbody className="font-data-readout text-on-surface text-[10px] leading-relaxed">
                {logs.map((log, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-on-surface-variant/60">{log.timestamp}</td>
                    <td className="py-3 px-3 font-bold">{log.source}</td>
                    <td className="py-3 px-3 text-on-surface-variant">{log.message}</td>
                    <td className="py-3 px-3">
                      <span className={`font-label-caps text-[8px] px-1.5 py-0.5 rounded ${
                        log.severity === "critical" 
                          ? "bg-error/15 text-error border border-error/20" 
                          : "bg-primary-fixed-dim/15 text-primary-fixed border border-primary-fixed-dim/20"
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-on-surface-variant/40">
                      Ledger is empty. Initializing systems.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

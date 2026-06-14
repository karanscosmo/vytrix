"use client";

import React, { useState } from "react";
import { useSystemState } from "@/context/state-context";
import { BellRing, Radio, Search, Filter, Send, AlertOctagon, CheckCircle2 } from "lucide-react";

export default function AlertsPage() {
  const { currentStage, logs } = useSystemState();
  const [filterType, setFilterType] = useState<"all" | "critical" | "warning">("all");
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcastZone, setBroadcastZone] = useState("Zone C-4");
  const [sendSuccess, setSendSuccess] = useState(false);

  // Filter logs by type
  const filteredLogs = logs.filter((log) => {
    if (filterType === "all") return true;
    return log.severity === filterType;
  });

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    setSendSuccess(true);
    setBroadcastMsg("");
    setTimeout(() => setSendSuccess(false), 3000);
  };

  return (
    <div className="flex-grow p-6 md:p-8 flex flex-col gap-6 overflow-y-auto pb-24 h-full">
      {/* HEADER SECTION */}
      <header className="border-b border-white/5 pb-4">
        <h1 className="font-display text-3xl font-bold tracking-tight text-primary-fixed-dim">
          WARNING & BROADCAST CONSOLE
        </h1>
        <p className="font-body-main text-on-surface-variant text-sm mt-1">
          Active emergency broadcast vectors, civilian SMS links, and localized sirens
        </p>
      </header>

      {/* TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: ACTIVE WARNING LOG (Span 7) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="glass-panel rounded-xl overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-white/5 p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2.5 text-xs">
                <BellRing size={16} className="text-primary-fixed-dim" />
                <span className="font-label-caps tracking-wider text-on-surface-variant">WARNING INDEX</span>
              </div>
              
              {/* Severity Filter buttons */}
              <div className="flex gap-1.5 bg-background border border-white/10 p-1 rounded text-[9px] font-label-caps">
                {(["all", "critical", "warning"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      filterType === type ? "bg-primary-fixed-dim text-background font-bold" : "text-on-surface-variant hover:bg-white/5"
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="p-4 flex flex-col gap-3 max-h-[460px] overflow-y-auto">
              {filteredLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`border rounded-lg p-3.5 flex gap-3.5 items-start relative overflow-hidden transition-all ${
                    log.severity === "critical" 
                      ? "bg-error/10 border-error/20" 
                      : "bg-surface-container/50 border-white/5"
                  }`}
                >
                  <div className={`p-2 rounded ${log.severity === "critical" ? "bg-error/20 text-error" : "bg-primary-container/20 text-primary-fixed-dim"}`}>
                    <AlertOctagon size={16} />
                  </div>
                  <div className="flex-grow flex flex-col gap-1 text-xs">
                    <div className="flex justify-between items-center w-full">
                      <span className="font-data-readout font-bold uppercase text-on-surface">
                        {log.source} {"//"} {log.severity.toUpperCase()}
                      </span>
                      <span className="font-mono text-[9px] text-on-surface-variant/40">{log.timestamp}</span>
                    </div>
                    <p className="text-on-surface-variant leading-relaxed">{log.message}</p>
                  </div>
                </div>
              ))}
              {filteredLogs.length === 0 && (
                <div className="text-center py-16 text-xs text-on-surface-variant/40">
                  No active warnings match filter parameters.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CIVILIAN BROADCAST INPUT (Span 5) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <form onSubmit={handleBroadcast} className="glass-panel rounded-xl p-5 shadow-2xl relative overflow-hidden flex flex-col gap-4">
            <div className="absolute inset-0 bg-gradient-to-b from-primary-fixed-dim/5 to-transparent pointer-events-none"></div>
            
            <h3 className="font-label-caps text-[10px] text-on-surface-variant tracking-wider flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Radio size={14} className="text-primary-fixed-dim" /> CIVILIAN LINK BROADCAST
            </h3>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-caps text-[8px] text-on-surface-variant/70">TARGET BROADCAST SECTOR</label>
                <select
                  value={broadcastZone}
                  onChange={(e) => setBroadcastZone(e.target.value)}
                  className="bg-surface-container-high/60 border border-white/10 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-primary-fixed-dim font-data-readout text-[10px]"
                >
                  <option value="All Zones">ALL COMMAND SECTORS</option>
                  <option value="Zone C-4">ZONE C-4 [LOW LANDING]</option>
                  <option value="Sector B">SECTOR B [WATERFRONT]</option>
                  <option value="District 9">DISTRICT 9 [WESTSIDE]</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-caps text-[8px] text-on-surface-variant/70">ALERT DISPATCH TEXT</label>
                <textarea
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  rows={4}
                  className="bg-surface-container-high/60 border border-white/10 rounded p-3 text-on-surface focus:outline-none focus:border-primary-fixed-dim font-body-main text-xs placeholder-on-surface-variant/30 leading-relaxed"
                  placeholder="Input alert details to route directly to Civilian Link client devices..."
                />
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-1">
                  <span className="text-[9px] font-label-caps px-2 py-0.5 rounded bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/30 shadow-[0_0_8px_rgba(116,245,255,0.4)]">EN</span>
                  <span className="text-[9px] font-label-caps px-2 py-0.5 rounded bg-primary-fixed/5 text-primary-fixed-dim border border-primary-fixed-dim/20">ES</span>
                  <span className="text-[9px] font-label-caps px-2 py-0.5 rounded bg-primary-fixed/5 text-primary-fixed-dim border border-primary-fixed-dim/20">ZH</span>
                </div>
                
                <button
                  type="submit"
                  disabled={!broadcastMsg.trim()}
                  className="bg-primary-fixed-dim text-background px-4 py-2 font-label-caps text-[10px] font-bold rounded flex items-center gap-1.5 hover:bg-primary-fixed transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-transform"
                >
                  <Send size={10} />
                  DISPATCH
                </button>
              </div>
            </div>

            {sendSuccess && (
              <div className="bg-tertiary-container/10 border border-tertiary-container/30 text-tertiary-fixed-dim rounded p-3 flex items-center gap-2 text-xs">
                <CheckCircle2 size={14} className="shrink-0" />
                <span>ALERT BROADCAST DISPATCHED SUCCESSFULLY TO CIVILIAN LINK DEVICES</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

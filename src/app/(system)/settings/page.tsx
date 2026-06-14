"use client";

import React, { useState, useEffect } from "react";
import { useSystemState } from "@/context/state-context";
import { Settings as SettingsIcon, Save, RefreshCw, AlertTriangle, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const {
    apiBaseUrl,
    setApiBaseUrl,
    wsUrl,
    setWsUrl,
    mapboxToken,
    setMapboxToken,
    standaloneMode,
    forceSync
  } = useSystemState();

  // Local inputs
  const [localApi, setLocalApi] = useState(apiBaseUrl);
  const [localWs, setLocalWs] = useState(wsUrl);
  const [localToken, setLocalToken] = useState(mapboxToken);
  const [saveStatus, setSaveStatus] = useState<string>("");

  useEffect(() => {
    setLocalApi(apiBaseUrl);
    setLocalWs(wsUrl);
    setLocalToken(mapboxToken);
  }, [apiBaseUrl, wsUrl, mapboxToken]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiBaseUrl(localApi);
    setWsUrl(localWs);
    setMapboxToken(localToken);
    setSaveStatus("CONFIGURATION SAVED & COMMITTED");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  return (
    <div className="flex-grow p-6 md:p-8 flex flex-col gap-6 overflow-y-auto pb-24 h-full">
      {/* HEADER SECTION */}
      <header className="border-b border-white/5 pb-4">
        <h1 className="font-display text-3xl font-bold tracking-tight text-primary-fixed-dim">
          SETTINGS HUD
        </h1>
        <p className="font-body-main text-on-surface-variant text-sm mt-1">
          Operational backend variables, security keys, and environment parameters
        </p>
      </header>

      {/* TWO COLUMN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: CORE FORMS (Span 7) */}
        <form onSubmit={handleSave} className="lg:col-span-8 glass-panel rounded-xl p-6 shadow-2xl flex flex-col gap-5 relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-fixed-dim/40 to-transparent"></div>
          
          <h2 className="font-headline-md text-base text-on-surface font-semibold flex items-center gap-2 border-b border-white/5 pb-3">
            <SettingsIcon size={16} className="text-primary-fixed-dim" /> Core Connection Variables
          </h2>

          <div className="flex flex-col gap-4 text-xs">
            {/* API BASE URL */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-caps text-[9px] text-on-surface-variant/70 tracking-wider">
                FASTAPI BASE URL
              </label>
              <input
                type="text"
                value={localApi}
                onChange={(e) => setLocalApi(e.target.value)}
                className="bg-surface-container-high/60 border border-white/10 rounded px-3.5 py-2.5 text-on-surface focus:outline-none focus:border-primary-fixed-dim font-mono text-[11px]"
                placeholder="http://localhost:8000"
              />
              <span className="text-[9px] text-on-surface-variant/40">REST endpoint for mock feeds and logs.</span>
            </div>

            {/* WS LINK */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-caps text-[9px] text-on-surface-variant/70 tracking-wider">
                WEBSOCKET STATUS UPLINK
              </label>
              <input
                type="text"
                value={localWs}
                onChange={(e) => setLocalWs(e.target.value)}
                className="bg-surface-container-high/60 border border-white/10 rounded px-3.5 py-2.5 text-on-surface focus:outline-none focus:border-primary-fixed-dim font-mono text-[11px]"
                placeholder="ws://localhost:8000/ws/scenario"
              />
              <span className="text-[9px] text-on-surface-variant/40">WebSocket endpoint for live multi-device scenario synchronization.</span>
            </div>

            {/* MAPBOX TOKEN */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-caps text-[9px] text-on-surface-variant/70 tracking-wider">
                MAPBOX ACCESS KEY
              </label>
              <input
                type="password"
                value={localToken}
                onChange={(e) => setLocalToken(e.target.value)}
                className="bg-surface-container-high/60 border border-white/10 rounded px-3.5 py-2.5 text-on-surface focus:outline-none focus:border-primary-fixed-dim font-mono text-[11px]"
                placeholder="pk.eyJ1..."
              />
              <span className="text-[9px] text-on-surface-variant/40">
                Key needed for real Mapbox maps style loads. If empty, Vytrix renders a cinematic offline vector map overlay.
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 border-t border-white/5 pt-4">
            <span className="font-mono text-[9px] text-tertiary-fixed-dim font-bold">
              {saveStatus}
            </span>
            <button
              type="submit"
              className="bg-primary-fixed-dim text-background px-5 py-2.5 font-label-caps text-[10px] font-bold rounded flex items-center gap-2 hover:bg-primary-fixed transition-all shadow-[inset_0_0_10px_rgba(255,255,255,0.2)] active:scale-95 transition-transform"
            >
              <Save size={12} />
              COMMIT CHANGES
            </button>
          </div>
        </form>

        {/* RIGHT COLUMN: STABILITY & OVERRIDES (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6 w-full text-xs">
          {/* Environment Status Card */}
          <div className="glass-panel rounded-xl p-5 shadow-2xl flex flex-col gap-4">
            <h3 className="font-label-caps text-[10px] text-on-surface-variant tracking-wider border-b border-white/5 pb-2">
              DEMO STABILITY HUD
            </h3>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant/70">Sync Engine Status:</span>
                <span className={`font-bold flex items-center gap-1 ${standaloneMode ? "text-primary-fixed-dim" : "text-tertiary-fixed-dim"}`}>
                  <span className={`w-1 h-1 rounded-full ${standaloneMode ? "bg-primary-fixed-dim" : "bg-tertiary-fixed-dim animate-ping"}`}></span>
                  {standaloneMode ? "STANDALONE" : "CONNECTED"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant/70">Map Render Driver:</span>
                <span className="font-bold text-on-surface">
                  {mapboxToken ? "MAPBOX_GL" : "VECTOR_HUD_CANVAS"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant/70">Security Key Policy:</span>
                <span className="font-bold text-tertiary-fixed-dim flex items-center gap-1">
                  <ShieldCheck size={12} />
                  PROTECTED
                </span>
              </div>
            </div>

            <button
              onClick={forceSync}
              className="w-full py-2.5 bg-surface-container border border-white/10 hover:bg-surface-bright text-on-surface font-label-caps text-[9px] tracking-wider rounded transition-colors uppercase font-bold"
            >
              RE-SYNC DATA PIPELINES
            </button>
          </div>

          {/* Security details overlay warning */}
          <div className="bg-surface-container-high/40 border border-white/5 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex gap-2 text-primary-fixed-dim font-bold font-label-caps text-[10px]">
              <AlertTriangle size={14} className="text-primary-fixed-dim" />
              <span>JUDGE INSTRUCTIONS</span>
            </div>
            <p className="text-[10px] text-on-surface-variant/60 leading-normal">
              To showcase live multi-screen alerts (e.g. changing state on desktop and watching the citizen link phone update in real time), run the FastAPI python backend. Otherwise, this OS operates in standalone simulation mode with flawless local data pipelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

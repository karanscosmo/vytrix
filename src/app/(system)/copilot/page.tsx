"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSystemState } from "@/context/state-context";
import { Brain, Send, ShieldAlert, Cpu, Activity, User, Sparkles, TrendingDown, Clock, Shield } from "lucide-react";

export default function Copilot() {
  const { currentStage, chatHistory, sendMessageToCopilot, metrics, setStage } = useSystemState();
  const [inputVal, setInputVal] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Submit message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isSending) return;
    
    setIsSending(true);
    const text = inputVal;
    setInputVal("");
    await sendMessageToCopilot(text);
    setIsSending(false);
  };

  // Pre-configured suggest prompt
  const handleActionClick = (actionText: string) => {
    setInputVal(actionText);
  };

  return (
    <div className="flex-grow p-6 md:p-8 flex flex-col gap-6 overflow-y-auto pb-24 h-full">
      <header className="border-b border-white/5 pb-4">
        <h1 className="font-display text-3xl font-bold tracking-tight text-primary-fixed-dim">
          AI EMERGENCY COPILOT
        </h1>
        <p className="font-body-main text-on-surface-variant text-sm mt-1">
          Always-on neural orchestration & predictive command execution
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 min-h-[500px]">
        {/* LEFT COLUMN: CHAT WINDOW */}
        <div className="lg:col-span-8 flex flex-col glass-panel rounded-xl overflow-hidden shadow-2xl h-[560px] relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-fixed-dim/40 to-transparent"></div>
          
          {/* Header */}
          <div className="bg-white/5 p-4 border-b border-white/5 flex items-center justify-between z-10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Brain className="text-primary-fixed-dim animate-breathe" size={18} />
              <h2 className="font-headline-md text-base text-on-surface font-semibold">Emergency Response Assistant</h2>
            </div>
            <span className="font-label-caps text-[8px] text-error border border-error/30 px-2 py-1 rounded bg-error/10">
              PRIORITY: ALPHA_ONE
            </span>
          </div>

          {/* Messages feed */}
          <div className="p-6 flex-grow overflow-y-auto flex flex-col gap-4 z-10">
            {/* Initial Greeting */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary-fixed-dim/30 shrink-0">
                <Brain size={14} className="text-primary-fixed-dim" />
              </div>
              <div className="flex flex-col gap-2 max-w-[85%]">
                <div className="glass-panel p-4 rounded-xl rounded-tl-none border-primary-fixed/20 text-xs">
                  <div className="font-label-caps text-[8px] text-primary-fixed-dim/70 mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim animate-pulse"></span>
                    VYTRIX_NEURAL_UPLINK // INITIALIZED
                  </div>
                  <p className="text-on-surface-variant leading-relaxed">
                    System ready. I am monitoring the active scenario: <span className="text-primary-fixed font-bold">{currentStage.name}</span>. Ask me to run safety audits, simulate water levels, reroute assets, or generate multilingual citizen broadcasts.
                  </p>
                </div>
              </div>
            </div>

            {/* Chat History */}
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role !== "user" && (
                  <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary-fixed-dim/30 shrink-0">
                    <Brain size={14} className="text-primary-fixed-dim" />
                  </div>
                )}
                <div className="flex flex-col gap-2 max-w-[85%]">
                  <div className={`p-4 rounded-xl text-xs border ${
                    msg.role === "user" 
                      ? "bg-surface-variant/50 border-white/5 rounded-tr-none" 
                      : "glass-panel border-primary-fixed/20 rounded-tl-none"
                  }`}>
                    {msg.role !== "user" && (
                      <div className="font-label-caps text-[8px] text-primary-fixed-dim/70 mb-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim animate-pulse"></span>
                        LOGIC_DECISION // STREAMING
                      </div>
                    )}
                    <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    
                    {/* Recommended Actions */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <div className="text-tertiary-fixed-dim mb-2 flex items-center gap-1">
                          <Sparkles size={12} className="animate-pulse" />
                          <span>RECOMMENDED ACTIONS:</span>
                        </div>
                        <div className="pl-3 border-l border-white/10 flex flex-col gap-2">
                          {msg.actions.map((act, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => handleActionClick(act)}
                              className="text-left text-on-surface hover:text-primary-fixed-dim transition-colors hover:underline text-[10px]"
                            >
                              &gt; {act}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-white/10 shrink-0">
                    <User size={14} className="text-on-surface-variant" />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Form input */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-surface-container-low/80 backdrop-blur-md z-10">
            <div className="relative flex items-center">
              <input
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isSending}
                type="text"
                placeholder="Input operational command (e.g. 'Initiate Zone 4 Evacuation')..."
                className="w-full bg-transparent border-0 border-b border-white/20 text-on-surface font-body-main text-xs px-4 py-3 pr-12 focus:ring-0 focus:border-primary-fixed placeholder-on-surface-variant/40 transition-colors"
              />
              <button
                type="submit"
                disabled={isSending || !inputVal.trim()}
                className="absolute right-2 text-primary-fixed-dim hover:text-primary p-2 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: ACTION HUD */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Command center controls */}
          <div className="glass-panel rounded-xl p-5 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-error/5 to-transparent pointer-events-none"></div>
            <h3 className="font-label-caps text-[10px] text-on-surface-variant mb-4 flex items-center gap-2">
              <ShieldAlert size={14} className="text-error" /> COMMAND CENTER
            </h3>
            <div className="flex flex-col gap-3 relative z-10 text-xs">
              <button
                onClick={() => setStage(4)} // Jump directly to Evacuation stage
                className="w-full bg-error-container text-on-error font-headline-md text-xs py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(147,0,10,0.35)] hover:bg-error transition-colors animate-breathe border border-error/50 font-bold"
              >
                <Shield size={14} /> ORCHESTRATE RESPONSE
              </button>
              <button
                onClick={() => setStage(0)}
                className="w-full bg-surface-variant border border-white/10 hover:border-white/20 text-on-surface font-label-caps py-2.5 rounded-lg transition-colors"
              >
                RESET SCENARIO
              </button>
            </div>
          </div>

          {/* Timeline details */}
          <div className="glass-panel rounded-xl p-5 shadow-2xl flex flex-col gap-4">
            <h3 className="font-label-caps text-[10px] text-on-surface-variant flex items-center gap-2">
              <Clock size={14} /> ORCHESTRATION PROGRESS
            </h3>
            <div className="flex flex-col gap-4">
              <div className="relative pl-5 border-l border-white/10 text-xs">
                <div className="absolute -left-1 top-0.5 w-2 h-2 rounded-full bg-primary-fixed shadow-[0_0_5px_rgba(116,245,255,0.8)]"></div>
                <div className="font-label-caps text-[9px] text-primary-fixed-dim mb-1">
                  CURRENT SCENARIO STATE
                </div>
                <p className="font-bold text-on-surface">{currentStage.name}</p>
                <p className="text-[10px] text-on-surface-variant/70 mt-0.5">{currentStage.status}</p>
                
                {/* Evacuation progress bar */}
                <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-primary-fixed rounded-full transition-all duration-500 relative"
                    style={{ width: `${metrics.evacuated_percent}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <div className="text-[8px] text-on-surface-variant/50 mt-1 text-right">
                  EVACUATION: {metrics.evacuated_percent}%
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry metrics */}
          <div className="glass-panel rounded-xl p-5 shadow-2xl flex flex-col gap-4">
            <h3 className="font-label-caps text-[10px] text-on-surface-variant flex items-center gap-2">
              <Activity size={14} /> SYSTEM TELEMETRY
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-data-readout">
              <div>
                <span className="text-[8px] text-on-surface-variant/50 uppercase block mb-0.5">Grid Stability</span>
                <span className="text-on-surface text-base font-bold">{(100 - metrics.grid_load * 0.4).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-[8px] text-on-surface-variant/50 uppercase block mb-0.5">EMS Capacity</span>
                <span className={`text-base font-bold ${metrics.hospital_capacity > 100 ? "text-error" : "text-on-surface"}`}>
                  {metrics.hospital_capacity}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

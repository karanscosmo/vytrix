"use client";

import React, { useState } from "react";
import { useSystemState } from "@/context/state-context";
import { Play, Pause, ChevronLeft, ChevronRight, Sliders, ChevronDown, ChevronUp, Link as LinkIcon, AlertTriangle } from "lucide-react";

export const ScenarioController: React.FC = () => {
  const { currentStageId, setStage, autoplay, setAutoplay, stages, standaloneMode } = useSystemState();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className="fixed bottom-24 md:bottom-6 right-6 z-[100] font-data-readout select-none">
      {/* MINIMIZED BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-surface-container-high/90 border border-primary-fixed-dim/40 rounded-full p-3 text-primary-fixed-dim shadow-[0_0_15px_rgba(0,219,231,0.25)] hover:bg-surface-bright/90 hover:scale-105 duration-200 active:scale-95 transition-transform flex items-center gap-2 backdrop-blur-md"
        >
          <Sliders size={16} className="animate-spin" style={{ animationDuration: "10s" }} />
          <span className="font-label-caps text-[9px] tracking-wider uppercase">Scenario Panel</span>
        </button>
      )}

      {/* EXPANDED CONTROL HUD */}
      {isOpen && (
        <div className="w-[320px] bg-surface-container-low/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2 text-primary-fixed-dim">
              <Sliders size={14} />
              <span className="font-label-caps text-[10px] tracking-wider font-bold">SCENARIO ORCHESTRATOR</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-on-surface-variant/60 hover:text-on-surface p-1 rounded transition-colors"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col gap-3">
            {/* Timeline progression indicators */}
            <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1">
              {stages.map((stage) => {
                const isActive = stage.id === currentStageId;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setStage(stage.id)}
                    className={`w-full text-left px-3 py-1.5 rounded text-[10px] transition-all flex items-center justify-between group border ${
                      isActive
                        ? "bg-primary-fixed-dim/15 text-primary-fixed border-primary-fixed-dim/35 shadow-[inset_0_0_8px_rgba(0,219,231,0.15)]"
                        : "bg-surface-container/30 text-on-surface-variant/70 hover:text-on-surface border-transparent hover:bg-white/5"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isActive
                          ? (stage.severity === "EMERGENCY" || stage.severity === "CRITICAL" ? "bg-error animate-pulse" : "bg-primary-fixed animate-pulse")
                          : "bg-white/20"
                      }`}></span>
                      <span className={isActive ? "font-bold" : ""}>{stage.id + 1}. {stage.name}</span>
                    </span>
                    <span className={`text-[8px] px-1 py-0.2 rounded font-mono ${
                      stage.severity === "EMERGENCY" || stage.severity === "CRITICAL"
                        ? "bg-error/10 text-error"
                        : (stage.severity === "RECOVERY" ? "bg-tertiary-container/10 text-tertiary-fixed-dim" : "bg-white/10 text-on-surface-variant")
                    }`}>
                      {stage.severity}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sync connection status details */}
            <div className="flex justify-between items-center text-[8px] bg-white/5 px-2.5 py-1.5 rounded border border-white/5">
              <span className="text-on-surface-variant/60 flex items-center gap-1">
                <LinkIcon size={10} />
                Connection:
              </span>
              <span className={`font-bold flex items-center gap-1 ${standaloneMode ? "text-primary-fixed-dim" : "text-tertiary-fixed-dim"}`}>
                <span className={`w-1 h-1 rounded-full ${standaloneMode ? "bg-primary-fixed-dim" : "bg-tertiary-fixed-dim animate-ping"}`}></span>
                {standaloneMode ? "STANDALONE_LOCAL" : "WS_LIVE_HUB"}
              </span>
            </div>

            {/* Play/Pause & Step Controls */}
            <div className="flex justify-between gap-2 mt-1">
              <button
                onClick={() => setStage(Math.max(0, currentStageId - 1))}
                disabled={currentStageId === 0}
                className="flex-1 py-2 bg-surface-container hover:bg-surface-bright disabled:opacity-30 disabled:pointer-events-none rounded border border-white/5 text-on-surface text-[10px] flex items-center justify-center gap-1 active:scale-95 transition-transform"
              >
                <ChevronLeft size={12} />
                Prev
              </button>
              
              <button
                onClick={() => setAutoplay(!autoplay)}
                className={`flex-1 py-2 rounded text-[10px] flex items-center justify-center gap-1 active:scale-95 transition-transform border ${
                  autoplay 
                    ? "bg-primary-fixed text-background border-primary-fixed font-bold shadow-[0_0_10px_rgba(0,219,231,0.35)]" 
                    : "bg-surface-container hover:bg-surface-bright border-white/5 text-on-surface"
                }`}
              >
                {autoplay ? <Pause size={10} /> : <Play size={10} />}
                {autoplay ? "Pause Auto" : "Autoplay"}
              </button>

              <button
                onClick={() => setStage(Math.min(stages.length - 1, currentStageId + 1))}
                disabled={currentStageId === stages.length - 1}
                className="flex-1 py-2 bg-surface-container hover:bg-surface-bright disabled:opacity-30 disabled:pointer-events-none rounded border border-white/5 text-on-surface text-[10px] flex items-center justify-center gap-1 active:scale-95 transition-transform"
              >
                Next
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

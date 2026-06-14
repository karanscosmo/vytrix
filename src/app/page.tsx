"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Terminal, 
  Shield, 
  Play, 
  ArrowRight, 
  Activity, 
  Cpu, 
  Database, 
  Radio,
  LayoutDashboard,
  MessageSquare,
  Box,
  Network,
  Smartphone,
  AlertTriangle,
  BarChart3,
  Sliders,
  ExternalLink
} from "lucide-react";

export default function Home() {
  const [bootStep, setBootStep] = useState<number>(0);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);

  const bootLogs = [
    "[ SYSTEM ] INITIALIZING VYTRIX DIRECT COMMAND SHELL...",
    "[ KERNEL ] LOADING TOPOLOGY RENDER ENGINE... OK",
    "[ SATELLITE ] ESTABLISHING LINK TO CO-ORANGE_SAT_4... OK",
    "[ DATA ] POPULATING LOCAL DISASTER LOGS DATA STORE... OK",
    "[ AI_CORE ] SPINNING UP NEURAL LOGIC GATES... OK",
    "[ WEBSOCKET ] CHECKING SYNCHRONIZER HUB STATUS... OK",
    "[ SECURITY ] RATE LIMITERS & XSS SHIELDS INSTALLED... OK",
    "[ SYSTEM ] ALL PREREQUISITES NOMINAL. SYSTEM READY FOR INTERACTIVE INGRESS."
  ];

  useEffect(() => {
    if (bootStep < bootLogs.length) {
      const timer = setTimeout(() => {
        setDiagnosticLogs((prev) => [...prev, bootLogs[bootStep]]);
        setBootStep((step) => step + 1);
      }, 250); // Fast cascading boot sequence
      return () => clearTimeout(timer);
    }
  }, [bootStep]);

  const options = [
    {
      title: "Command Dashboard",
      path: "/dashboard",
      desc: "Primary operational center. Houses live radar, grid loads, logs ledger, and active responders.",
      icon: LayoutDashboard,
      color: "text-primary-fixed-dim",
      borderColor: "hover:border-primary-fixed-dim/40",
      glowColor: "hover:shadow-primary-fixed-dim/5"
    },
    {
      title: "Tactical Copilot AI",
      path: "/copilot",
      desc: "Interact with the natural language emergency coordinator for incident planning and reasoning lists.",
      icon: MessageSquare,
      color: "text-[#67f4b7]",
      borderColor: "hover:border-[#67f4b7]/40",
      glowColor: "hover:shadow-[#67f4b7]/5"
    },
    {
      title: "Bento Digital Twin",
      path: "/digital-twin",
      desc: "3D environmental mockup. Tracks local atmospheric stress, weather vectors, and ambient indices.",
      icon: Box,
      color: "text-secondary",
      borderColor: "hover:border-secondary/40",
      glowColor: "hover:shadow-secondary/5"
    },
    {
      title: "Infrastructure Grid",
      path: "/infrastructure",
      desc: "Tracks network interconnectivity across power systems, water gauges, and transport networks.",
      icon: Network,
      color: "text-tertiary-fixed-dim",
      borderColor: "hover:border-tertiary-fixed-dim/40",
      glowColor: "hover:shadow-tertiary-fixed-dim/5"
    },
    {
      title: "Civilian Mobile Link",
      path: "/mobile",
      desc: "Simulates a civilian phone frame displaying live alerts, emergency directions, and SOS push buttons.",
      icon: Smartphone,
      color: "text-[#e9c46a]",
      borderColor: "hover:border-[#e9c46a]/40",
      glowColor: "hover:shadow-[#e9c46a]/5"
    },
    {
      title: "Alerts Broadcast HUD",
      path: "/alerts",
      desc: "High-priority console showing system warnings sorted by time, origin, and severity codes.",
      icon: AlertTriangle,
      color: "text-error",
      borderColor: "hover:border-error/40",
      glowColor: "hover:shadow-error/5"
    },
    {
      title: "Telemetry Analytics",
      path: "/analytics",
      desc: "Correlates resource consumption, evacuations, and hospital loads on interactive charts.",
      icon: BarChart3,
      color: "text-primary-fixed-dim",
      borderColor: "hover:border-primary-fixed-dim/40",
      glowColor: "hover:shadow-primary-fixed-dim/5"
    },
    {
      title: "Operator Settings",
      path: "/settings",
      desc: "Provides settings for backend endpoints, Mapbox custom keys, and vector graphics overrides.",
      icon: Sliders,
      color: "text-on-surface-variant",
      borderColor: "hover:border-white/20",
      glowColor: "hover:shadow-white/5"
    }
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 text-on-background select-none font-mono relative bg-[#0c1324] overflow-y-auto">
      {/* Background visual overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#070d1f_100%)] opacity-80 pointer-events-none"></div>
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.9)] opacity-80 pointer-events-none"></div>
      
      {/* Dynamic scan line */}
      <div className="fixed left-0 w-full h-[1px] bg-primary-fixed-dim/20 shadow-[0_0_8px_#00dbe7] z-50 pointer-events-none animate-scan-line"></div>

      {/* Main Content Area */}
      <div className="max-w-5xl w-full flex flex-col gap-6 relative z-20 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-surface-container border border-primary-fixed-dim/30 flex items-center justify-center relative shadow-[0_0_20px_rgba(0,219,231,0.2)] animate-breathe">
            <Shield className="text-primary-fixed-dim" size={28} />
            <div className="absolute inset-0 bg-primary-fixed-dim/10 rounded-2xl animate-pulse"></div>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tighter text-primary-fixed-dim drop-shadow-[0_0_8px_rgba(0,219,231,0.4)] mt-3">
            VYTRIX OS
          </h1>
          <p className="text-[10px] text-on-surface-variant/80 tracking-widest uppercase font-bold">
            Climate-Tech Disaster Intelligence & Emergency Command Operating System
          </p>
        </div>

        {/* Diagnostic Terminal Viewport */}
        <div className="glass-panel rounded-xl overflow-hidden shadow-2xl flex flex-col h-48 border border-white/10 relative">
          <div className="bg-white/5 px-4 py-1.5 border-b border-white/10 flex justify-between items-center text-[9px] text-on-surface-variant/70 font-bold tracking-wider">
            <span className="flex items-center gap-1.5">
              <Terminal size={11} />
              VYTRIX_BOOT_DIAGNOSTICS.SH
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-ping"></span>
              SYSTEM_READY
            </span>
          </div>

          <div className="p-4 flex-grow overflow-y-auto flex flex-col gap-1.5 text-[9px] text-on-surface-variant font-mono">
            {diagnosticLogs.map((log, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-primary-fixed-dim/60 select-none">&gt;</span>
                <p className="leading-relaxed">{log}</p>
              </div>
            ))}
            {bootStep === bootLogs.length && (
              <div className="animate-pulse text-[#67f4b7] font-bold mt-1 text-[10px]">
                &gt; CORE STATUS: SECURE // AWAITING OPERATOR INGRESS DIRECTIVE...
              </div>
            )}
          </div>
        </div>

        {/* Prominent Autoplay Call-To-Action */}
        <div className="w-full">
          <Link
            href="/dashboard?autoplay=true"
            className="group flex items-center justify-between p-5 rounded-xl border border-primary-fixed-dim/30 bg-primary-fixed-dim/5 hover:bg-primary-fixed-dim/10 hover:border-primary-fixed-dim/60 transition-all duration-300 relative overflow-hidden shadow-[0_0_30px_rgba(0,219,231,0.05)] hover:shadow-[0_0_30px_rgba(0,219,231,0.15)]"
          >
            {/* Ambient lighting line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-fixed-dim/40 to-transparent"></div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed-dim/20 flex items-center justify-center text-primary-fixed-dim group-hover:scale-105 transition-transform duration-300">
                <Play size={18} fill="currentColor" className="ml-0.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-bold text-primary-fixed-dim flex items-center gap-2">
                  RUN PRESENTATION SIMULATION AUTOPLAY
                  <span className="text-[8px] bg-primary-fixed-dim/20 px-1.5 py-0.5 rounded text-primary-fixed-dim font-bold tracking-widest uppercase">
                    Demo Mode
                  </span>
                </h3>
                <p className="text-[10px] text-on-surface-variant/80 leading-relaxed max-w-2xl">
                  Boot straight into the 7-stage disaster cascade. Dynamically drives levee breaks, power shutdowns, ambulance rerouting, alerts broadcast, and recovery stages across connected widgets.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-primary-fixed-dim font-bold text-xs select-none">
              <span>LAUNCH</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 duration-300" />
            </div>
          </Link>
        </div>

        {/* Detailed Options Grid */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-[10px] text-on-surface-variant/50 font-bold tracking-wider border-b border-white/5 pb-2">
            <span>AVAILABLE COMMAND DECK OPTIONS</span>
            <span>MANUAL SELECTION DECK</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {options.map((opt, idx) => {
              const IconComp = opt.icon;
              return (
                <Link
                  key={idx}
                  href={opt.path}
                  className={`group flex flex-col justify-between p-4.5 rounded-xl border border-white/10 bg-surface-container-low/40 hover:bg-surface-container/60 ${opt.borderColor} transition-all duration-300 shadow-md hover:-translate-y-0.5 flex-grow ${opt.glowColor}`}
                >
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${opt.color}`}>
                        <IconComp size={16} />
                      </div>
                      <ExternalLink size={11} className="text-on-surface-variant/30 group-hover:text-on-surface-variant/70 duration-300" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-xs font-bold text-on-background group-hover:text-primary-fixed-dim transition-colors">
                        {opt.title}
                      </h4>
                      <p className="text-[9px] text-on-surface-variant leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-4 text-[8px] text-on-surface-variant/50 group-hover:text-primary-fixed-dim font-bold tracking-wider self-end">
                    <span>LAUNCH WIDGET</span>
                    <ArrowRight size={10} className="group-hover:translate-x-0.5 duration-300" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer info grid */}
        <div className="flex justify-between items-center text-[8px] text-on-surface-variant/40 border-t border-white/5 pt-4">
          <span className="flex items-center gap-1"><Cpu size={10} /> CORE: VYTRIX_INTELLIGENCE_OS</span>
          <span className="flex items-center gap-1"><Database size={10} /> DATA_MODE: LIVE_SYNC</span>
          <span className="flex items-center gap-1"><Radio size={10} /> NET: WS://LOCALHOST:8000/WS</span>
        </div>

      </div>
    </div>
  );
}

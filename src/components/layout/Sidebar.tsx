"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSystemState } from "@/context/state-context";
import {
  LayoutDashboard,
  Brain,
  Layers,
  Building2,
  Settings,
  BellRing,
  LineChart,
  Smartphone,
  Info
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { metrics, standaloneMode } = useSystemState();

  // Hide sidebar in mobile civilian view
  if (pathname === "/mobile") return null;

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/copilot", label: "AI Copilot", icon: Brain },
    { href: "/digital-twin", label: "Digital Twin", icon: Layers },
    { href: "/infrastructure", label: "Infrastructure", icon: Building2 },
    { href: "/analytics", label: "Analytics", icon: LineChart },
    { href: "/alerts", label: "Warning Console", icon: BellRing },
    { href: "/settings", label: "Settings HUD", icon: Settings },
    { href: "/mobile", label: "Civilian Link", icon: Smartphone }
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] w-64 z-40 bg-surface-container-low/40 backdrop-blur-3xl border-r border-white/5 shadow-xl">
      {/* AI Diagnostic Header */}
      <div className="p-6 border-b border-white/5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-white/10 flex items-center justify-center relative overflow-hidden">
            <Brain className="text-primary-fixed-dim animate-breathe" size={20} />
            <div className="absolute inset-0 bg-primary-fixed-dim/10 animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-[10px] text-on-surface tracking-wider">AI DIAGNOSTICS</span>
            <span className="font-data-readout text-[9px] text-primary-fixed-dim opacity-80 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-primary-fixed-dim animate-ping inline-block"></span>
              SYS_INTEGRITY: {(metrics.confidence_level * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Neural Network SVG Visualizer */}
        <div className="bg-surface-container/30 rounded-lg p-2 border border-white/5 mt-1">
          <div className="font-label-caps text-[8px] text-primary-fixed-dim/60 mb-1">NEURAL_NET_ACTIVITY</div>
          <svg className="w-full h-8 opacity-80" viewBox="0 0 100 40">
            <path
              className="animate-dash-flow"
              d="M10 20 Q 30 5, 50 20 T 90 20"
              fill="none"
              stroke="#00dbe7"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
            <path
              className="animate-dash-flow"
              d="M10 20 Q 30 35, 50 20 T 90 20"
              fill="none"
              stroke="#67f4b7"
              strokeDasharray="4 4"
              strokeWidth="1"
              style={{ animationDirection: "reverse", opacity: 0.5 }}
            />
            <circle cx="10" cy="20" fill="#74f5ff" r="1.5" />
            <circle cx="30" cy="12" fill="#00dbe7" r="1.5" />
            <circle cx="50" cy="20" fill="#67f4b7" r="2" className="animate-pulse" />
            <circle cx="70" cy="28" fill="#00dbe7" r="1.5" />
            <circle cx="90" cy="20" fill="#74f5ff" r="1.5" />
          </svg>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 py-3 px-6 w-full text-left transition-all duration-200 group relative ${
                isActive
                  ? "bg-primary-container/20 text-primary-fixed border-l-2 border-primary-fixed-dim"
                  : "text-on-surface-variant/70 hover:text-on-surface hover:bg-white/5"
              }`}
            >
              <Icon
                size={16}
                className={`transition-transform duration-300 group-hover:translate-x-1 ${
                  isActive ? "text-primary-fixed-dim" : "text-on-surface-variant"
                }`}
              />
              <span className="font-label-caps text-[10px] tracking-widest">{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-white/5 flex flex-col gap-2">
        <div className="flex items-center gap-2 px-2 py-1 text-on-surface-variant/70 text-[9px] font-label-caps">
          <Info size={12} />
          <span>OS Ver: 1.0.4-BETA</span>
        </div>
        <button
          onClick={() => {
            alert(`Initiating diagnostic report... System running in ${standaloneMode ? "Standalone mode" : "Live-sync backend mode"}. All nodes reporting nominal connection states.`);
          }}
          className="w-full py-2 px-3 bg-primary text-on-primary font-label-caps text-[10px] tracking-wider rounded hover:bg-primary-fixed transition-colors flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(0,219,231,0.2)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-on-primary animate-pulse"></span>
          DIAGNOSTIC_RUN
        </button>
      </div>
    </aside>
  );
};

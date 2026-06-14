"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSystemState } from "@/context/state-context";
import { Sensors } from "lucide-react"; // Custom or Lucide icons
import { Bell, Radio, Shield, Settings, Activity } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { currentStage, standaloneMode } = useSystemState();

  // Hide header in mobile civilian view to match mock mobile design
  if (pathname === "/mobile") return null;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-surface-container/60 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="font-display text-2xl font-bold tracking-tighter text-primary-fixed-dim drop-shadow-[0_0_8px_rgba(0,219,231,0.5)]">
          VYTRIX
        </Link>
        <span className="hidden md:inline-block w-px h-6 bg-white/10"></span>
        
        {/* Dynamic Warning Notification HUD */}
        <div className="hidden lg:flex items-center gap-3 bg-white/5 border border-white/5 rounded-full px-4 py-1 animate-breathe">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              currentStage.severity === "EMERGENCY" || currentStage.severity === "CRITICAL" ? "bg-error" : "bg-primary-fixed-dim"
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              currentStage.severity === "EMERGENCY" || currentStage.severity === "CRITICAL" ? "bg-error" : "bg-primary-fixed-dim"
            }`}></span>
          </span>
          <span className="font-label-caps text-[9px] text-on-surface-variant">
            ACTIVE HUD: <span className="text-on-surface font-bold uppercase">{currentStage.name}</span>
          </span>
          <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded font-mono text-on-surface-variant">
            {standaloneMode ? "STANDALONE_DEMO" : "LIVE_SYNCED"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-4 text-primary-fixed-dim">
          <Link href="/alerts" className="hover:bg-white/5 transition-colors p-2 rounded-full relative group">
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-pulse"></span>
            <Bell size={18} className="group-hover:scale-105 duration-200" />
          </Link>
          <Link href="/settings" className="hover:bg-white/5 transition-colors p-2 rounded-full group">
            <Settings size={18} className="group-hover:scale-105 duration-200" />
          </Link>
        </div>
        <div className="w-8 h-8 rounded-full border border-primary-fixed/30 overflow-hidden bg-surface-container-high ml-2 relative group cursor-pointer hover:border-primary-fixed transition-colors">
          <img
            alt="Chief Operational Officer Avatar"
            className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 transition-opacity"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuASLcF2Gx2-zMz2I3Qrmfbv3CaSpFncY3BqEV1VVFIu8_LwVhaSiyDVX0WHihduenrC4dCyLq_caquynDYrFy7uZ3nicR403ITWCkAatrXpv-x4PvD-Rxf-cziHy-cvWnaxjnGI51k2678ikSo7uyz5j0KAYeCgpjpFO9DW1H1KQ-RpLlBkiNzlJ2pa6LZq8QycnBql9QXxFHXaqGGnLNBfpVpALUDeAFY6AuMZpvZJaXvJaMT-6v00RPwdVvWZZOlQ-8mTozqBw-8"
          />
        </div>
      </div>
    </nav>
  );
};

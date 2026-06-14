"use client";

import React from "react";
import { useSystemState } from "@/context/state-context";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { BarChart3, LineChart as LineChartIcon, PieChart, ShieldAlert, Zap, Users } from "lucide-react";

export default function Analytics() {
  const { currentStageId, metrics, stages } = useSystemState();

  // Custom Chart Data reflecting historical stage progression
  const chartData = [
    { name: "Stage 1", risk: 35, capacity: 62, load: 65, evac: 0 },
    { name: "Stage 2", risk: 55, capacity: 78, load: 85, evac: 5 },
    { name: "Stage 3", risk: 84, capacity: 92, load: 98, evac: 20 },
    { name: "Stage 4", risk: 91, capacity: 112, load: 40, evac: 45 },
    { name: "Stage 5", risk: 95, capacity: 115, load: 30, evac: 82 },
    { name: "Stage 6", risk: 70, capacity: 85, load: 45, evac: 98 },
    { name: "Stage 7", risk: 20, capacity: 50, load: 60, evac: 100 }
  ].slice(0, currentStageId + 1);

  // If no data points, generate at least 3 historical points for chart stability
  const stableChartData = chartData.length > 0 ? chartData : [
    { name: "Stage 1", risk: 35, capacity: 62, load: 65, evac: 0 },
    { name: "Stage 2", risk: 55, capacity: 78, load: 85, evac: 5 }
  ];

  return (
    <div className="flex-grow p-6 md:p-8 flex flex-col gap-6 overflow-y-auto pb-24 h-full">
      {/* HEADER SECTION */}
      <header className="border-b border-white/5 pb-4">
        <h1 className="font-display text-3xl font-bold tracking-tight text-primary-fixed-dim">
          ANALYTICS & PREDICTIONS
        </h1>
        <p className="font-body-main text-on-surface-variant text-sm mt-1">
          Historical cascade risk profiles and live predictive metrics correlation
        </p>
      </header>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-xl p-5 flex items-center justify-between shadow-lg">
          <div className="flex flex-col gap-1 text-xs">
            <span className="font-label-caps text-on-surface-variant/70 uppercase">PREDICTIVE CASCADE INDEX</span>
            <span className="font-display text-3xl font-bold text-error">{metrics.cascade_risk}%</span>
            <span className="text-[9px] text-on-surface-variant/40">RISK CONFIDENCE: {(metrics.confidence_level * 100).toFixed(0)}%</span>
          </div>
          <div className="p-3 bg-error-container/10 text-error rounded-lg">
            <ShieldAlert size={20} />
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 flex items-center justify-between shadow-lg">
          <div className="flex flex-col gap-1 text-xs">
            <span className="font-label-caps text-on-surface-variant/70 uppercase">TRIAGE OCCUPACY RATE</span>
            <span className={`font-display text-3xl font-bold ${metrics.hospital_capacity > 100 ? "text-error" : "text-primary-fixed-dim"}`}>
              {metrics.hospital_capacity}%
            </span>
            <span className="text-[9px] text-on-surface-variant/40">ACTIVE SHUTTLES: {metrics.shelters_active * 4}</span>
          </div>
          <div className="p-3 bg-primary-container/10 text-primary-fixed-dim rounded-lg">
            <Users size={20} />
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 flex items-center justify-between shadow-lg">
          <div className="flex flex-col gap-1 text-xs">
            <span className="font-label-caps text-on-surface-variant/70 uppercase">AVERAGE GRID LOAD</span>
            <span className="font-display text-3xl font-bold text-tertiary-fixed-dim">{metrics.grid_load}%</span>
            <span className="text-[9px] text-on-surface-variant/40">NOMINAL CAP: 250MW</span>
          </div>
          <div className="p-3 bg-tertiary-container/10 text-tertiary-fixed-dim rounded-lg">
            <Zap size={20} />
          </div>
        </div>
      </div>

      {/* GRAPH GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cascade Risk Trend Area Chart */}
        <div className="glass-panel rounded-xl p-5 shadow-2xl flex flex-col gap-4">
          <h3 className="font-label-caps text-[10px] text-on-surface-variant tracking-wider flex items-center gap-2">
            <LineChartIcon size={14} className="text-primary-fixed-dim" /> CASCADE RISK TIMELINE
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stableChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffb4ab" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ffb4ab" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#849495" fontSize={10} tickLine={false} />
                <YAxis stroke="#849495" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#191f31", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px" }}
                  labelStyle={{ color: "#dce1fb", fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="risk" stroke="#ffb4ab" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" name="Risk %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hospital Capacity vs Evacuation Progress Bar Chart */}
        <div className="glass-panel rounded-xl p-5 shadow-2xl flex flex-col gap-4">
          <h3 className="font-label-caps text-[10px] text-on-surface-variant tracking-wider flex items-center gap-2">
            <BarChart3 size={14} className="text-primary-fixed-dim" /> HOSPITAL CAPACITY VS CIVILIAN EVACUATION
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stableChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#849495" fontSize={10} tickLine={false} />
                <YAxis stroke="#849495" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#191f31", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px" }}
                  labelStyle={{ color: "#dce1fb", fontWeight: "bold" }}
                />
                <Bar dataKey="capacity" fill="#00dbe7" name="Hospital Capacity" radius={[3, 3, 0, 0]} />
                <Bar dataKey="evac" fill="#67f4b7" name="Evacuated Citizens" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

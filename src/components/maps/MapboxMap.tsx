"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSystemState } from "@/context/state-context";
import { Maximize2, Minimize2, Layers, Compass, ZoomIn, ZoomOut } from "lucide-react";

// For typing purposes
declare const window: any;

interface MapboxMapProps {
  className?: string;
  showOverlayHUD?: boolean;
}

export const MapboxMap: React.FC<MapboxMapProps> = ({ className = "", showOverlayHUD = true }) => {
  const { currentStageId, mapboxToken, metrics } = useSystemState();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapInitialized, setMapInitialized] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedLayer, setSelectedLayer] = useState<"topology" | "satellite" | "thermal">("topology");
  const [hoveredNode, setHoveredNode] = useState<{ name: string; x: number; y: number; status: string; info: string } | null>(null);

  // Nodes to draw on the fallback vector map
  const getMapNodes = (stage: number) => [
    {
      name: "SUBSTATION_04",
      x: 350,
      y: 280,
      status: stage >= 2 ? "FAIL" : "NOMINAL",
      info: stage >= 2 ? "Load: 0% [GROUND FAULT]" : `Load: ${metrics.grid_load}%`
    },
    {
      name: "MERCY_MEMORIAL_HOSPITAL",
      x: 580,
      y: 200,
      status: stage >= 3 ? "OVERLOAD" : "NOMINAL",
      info: `Capacity: ${metrics.hospital_capacity}%`
    },
    {
      name: "SHELTER_TERMINAL_ALPHA",
      x: 720,
      y: 400,
      status: "ACTIVE",
      info: `Intake: ${stage >= 4 ? "High" : "Low"} [Capacity: 450/1000]`
    },
    {
      name: "COASTAL_LEVEE_SEC7",
      x: 250,
      y: 420,
      status: stage >= 1 ? "BREACHED" : "NOMINAL",
      info: stage >= 1 ? "Status: Inundation Active" : "Status: Nominal (94% margin)"
    }
  ];

  // Draw the fallback vector canvas map
  useEffect(() => {
    if (mapInitialized) return; // If Mapbox GL is active, don't draw on canvas

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let scanOffset = 0;
    let radarAngle = 0;

    const nodes = getMapNodes(currentStageId);

    // Setup canvas size
    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight || 500;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Render loop
    const render = () => {
      if (!ctx || !canvas) return;

      const w = canvas.width;
      const h = canvas.height;

      // Clear with Navy background
      ctx.fillStyle = "#0c1324";
      ctx.fillRect(0, 0, w, h);

      // Draw Grid Lines
      ctx.strokeStyle = "rgba(0, 219, 231, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw coastline abstraction (Topology style)
      ctx.strokeStyle = "rgba(0, 219, 231, 0.15)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Wave shape from bottom-left to top-middle-ish
      ctx.moveTo(-50, h + 50);
      ctx.bezierCurveTo(w * 0.2, h * 0.8, w * 0.1, h * 0.4, w * 0.4, h * 0.3);
      ctx.bezierCurveTo(w * 0.6, h * 0.2, w * 0.5, h * 0.05, w * 0.9, -50);
      ctx.stroke();

      // Inundation overlay if Stage >= 1 (Flood)
      if (currentStageId >= 1) {
        ctx.fillStyle = "rgba(0, 219, 231, 0.08)";
        ctx.beginPath();
        ctx.moveTo(-50, h + 50);
        ctx.bezierCurveTo(w * 0.2, h * 0.8, w * 0.1, h * 0.4, w * 0.4, h * 0.3);
        ctx.bezierCurveTo(w * 0.6, h * 0.2, w * 0.5, h * 0.05, w * 0.9, -50);
        ctx.lineTo(-50, -50);
        ctx.closePath();
        ctx.fill();
        
        // Inundation ripples
        ctx.strokeStyle = "rgba(0, 219, 231, 0.1)";
        ctx.beginPath();
        ctx.arc(w * 0.15, h * 0.65, 40 + (scanOffset % 40), 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Evacuation Corridor Alpha (Emerald)
      ctx.strokeStyle = "rgba(103, 244, 183, 0.4)";
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 8]);
      ctx.lineDashOffset = -scanOffset * 0.8;
      ctx.beginPath();
      ctx.moveTo(w * 0.3, h * 0.7);
      ctx.quadraticCurveTo(w * 0.5, h * 0.5, w * 0.85, h * 0.45);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // Draw Storm Radar Circle if Stage is active
      if (currentStageId < 6) {
        // Draw expanding storm bands (red/cyan)
        const stormX = w * 0.2 + Math.cos(scanOffset * 0.005) * 20;
        const stormY = h * 0.3 + Math.sin(scanOffset * 0.005) * 15;
        const maxRadius = 160 + currentStageId * 30;

        ctx.strokeStyle = currentStageId >= 3 ? "rgba(255, 180, 171, 0.2)" : "rgba(0, 219, 231, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(stormX, stormY, maxRadius * 0.6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = currentStageId >= 3 ? "rgba(255, 180, 171, 0.1)" : "rgba(0, 219, 231, 0.1)";
        ctx.beginPath();
        ctx.arc(stormX, stormY, maxRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Pulsing core
        ctx.fillStyle = currentStageId >= 3 ? "rgba(255, 180, 171, 0.05)" : "rgba(0, 219, 231, 0.04)";
        ctx.beginPath();
        ctx.arc(stormX, stormY, maxRadius * (0.8 + Math.sin(scanOffset * 0.05) * 0.05), 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Radar Sweep Circle
      const radarX = w * 0.5;
      const radarY = h * 0.5;
      const radarRadius = Math.min(w, h) * 0.4;
      ctx.strokeStyle = "rgba(0, 219, 231, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(radarX, radarY, radarRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(radarX, radarY, radarRadius * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      // Radar sweep line
      radarAngle += 0.01;
      ctx.strokeStyle = "rgba(0, 219, 231, 0.2)";
      ctx.beginPath();
      ctx.moveTo(radarX, radarY);
      ctx.lineTo(
        radarX + Math.cos(radarAngle) * radarRadius,
        radarY + Math.sin(radarAngle) * radarRadius
      );
      ctx.stroke();

      // Draw Nodes
      nodes.forEach((node) => {
        // Map abstract coordinates (0-1000) to actual canvas size
        const nodeX = (node.x / 1000) * w;
        const nodeY = (node.y / 500) * h;

        let nodeColor = "#00dbe7"; // nominal: cyan
        let pulseColor = "rgba(0, 219, 231, 0.4)";
        let statusText = "NOMINAL";

        if (node.status === "FAIL" || node.status === "BREACHED") {
          nodeColor = "#ffb4ab"; // fail: red
          pulseColor = "rgba(255, 180, 171, 0.4)";
          statusText = node.status;
        } else if (node.status === "OVERLOAD") {
          nodeColor = "#ffb4ab";
          pulseColor = "rgba(255, 180, 171, 0.6)";
          statusText = "CRIT LOAD";
        } else if (node.status === "ACTIVE") {
          nodeColor = "#67f4b7"; // safe shelter: emerald
          pulseColor = "rgba(103, 244, 183, 0.4)";
          statusText = "ACTIVE";
        }

        // Draw outer glow pulse
        const pulseRadius = 8 + Math.abs(Math.sin(scanOffset * 0.05)) * 8;
        ctx.fillStyle = pulseColor;
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, pulseRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw solid core
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw Text Label
        ctx.fillStyle = "#dce1fb";
        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.fillText(node.name, nodeX + 12, nodeY - 4);

        ctx.fillStyle = nodeColor;
        ctx.font = "7px 'JetBrains Mono', monospace";
        ctx.fillText(statusText, nodeX + 12, nodeY + 6);
      });

      // Update counters
      scanOffset += 1;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [mapInitialized, currentStageId, metrics]);

  // Handle Canvas Hover Tooltips
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const w = canvas.width;
    const h = canvas.height;

    const nodes = getMapNodes(currentStageId);
    let match = null;

    for (const node of nodes) {
      const nodeX = (node.x / 1000) * w;
      const nodeY = (node.y / 500) * h;
      const dist = Math.hypot(x - nodeX, y - nodeY);

      if (dist < 15) {
        match = {
          name: node.name.replace(/_/g, " "),
          x: nodeX,
          y: nodeY,
          status: node.status,
          info: node.info
        };
        break;
      }
    }
    setHoveredNode(match);
  };

  const handleMouseLeave = () => {
    setHoveredNode(null);
  };

  return (
    <div
      ref={mapContainerRef}
      className={`relative rounded-xl border border-primary-fixed-dim/30 overflow-hidden bg-surface-container-lowest flex items-center justify-center ${className} ${
        isFullscreen ? "fixed inset-4 z-[90] bg-background" : "w-full h-full"
      }`}
    >
      {/* MAP BACKGROUND CANVAS */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="absolute inset-0 z-0 w-full h-full cursor-crosshair"
      />

      {/* INNER GLOW RIM */}
      <div className="absolute inset-0 ring-1 ring-inset ring-primary-fixed/20 rounded-xl pointer-events-none z-10"></div>

      {/* FLOAT INTEL LAYERS */}
      {showOverlayHUD && (
        <>
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none select-none font-label-caps text-[10px] text-primary-fixed-dim bg-surface-container-lowest/80 border border-primary-fixed-dim/20 px-3 py-2 rounded backdrop-blur-md">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim animate-ping"></span>
              RADAR SYNCED: STAGE_0{currentStageId}
            </span>
            <span className="opacity-60 text-[8px]">SYS_COORDS: 22.434N // 88.541E</span>
          </div>

          {/* LAYER SWITCHER CONTROLS */}
          <div className="absolute bottom-4 right-4 z-20 flex gap-1 bg-surface-container-low/70 border border-white/10 p-1 rounded backdrop-blur-md">
            <button
              onClick={() => setSelectedLayer("topology")}
              className={`px-2 py-1 font-label-caps text-[9px] rounded transition-colors ${
                selectedLayer === "topology" ? "bg-primary-fixed-dim text-background font-bold" : "text-on-surface-variant hover:bg-white/5"
              }`}
            >
              Topology
            </button>
            <button
              onClick={() => setSelectedLayer("satellite")}
              className={`px-2 py-1 font-label-caps text-[9px] rounded transition-colors ${
                selectedLayer === "satellite" ? "bg-primary-fixed-dim text-background font-bold" : "text-on-surface-variant hover:bg-white/5"
              }`}
            >
              Thermal
            </button>
          </div>

          {/* ZOOM & FULLSCREEN CONTROLS */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-8 h-8 rounded bg-surface-container-low/85 border border-white/10 hover:border-primary-fixed-dim/40 flex items-center justify-center transition-colors text-on-surface hover:text-primary-fixed-dim backdrop-blur-md"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <div className="flex flex-col rounded bg-surface-container-low/85 border border-white/10 backdrop-blur-md">
              <button className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-t text-on-surface hover:text-primary-fixed-dim transition-colors border-b border-white/5">
                <ZoomIn size={16} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-b text-on-surface hover:text-primary-fixed-dim transition-colors">
                <ZoomOut size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* DYNAMIC NODE TOOLTIP */}
      {hoveredNode && (
        <div
          className="absolute z-30 pointer-events-none bg-surface-container-lowest/90 border border-primary-fixed-dim/30 rounded p-2.5 shadow-2xl backdrop-blur-sm flex flex-col gap-1 font-data-readout text-[10px]"
          style={{
            left: hoveredNode.x + 15,
            top: hoveredNode.y - 45
          }}
        >
          <span className="font-bold text-on-surface">{hoveredNode.name}</span>
          <span
            className={`font-label-caps text-[8px] ${
              hoveredNode.status === "NOMINAL" || hoveredNode.status === "ACTIVE"
                ? "text-tertiary-fixed-dim"
                : "text-error"
            }`}
          >
            STATUS: {hoveredNode.status}
          </span>
          <span className="text-on-surface-variant text-[9px]">{hoveredNode.info}</span>
        </div>
      )}
    </div>
  );
};

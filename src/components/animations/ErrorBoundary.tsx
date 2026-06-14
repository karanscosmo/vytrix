"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Terminal } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Vytrix Render Engine Exception caught:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[200] bg-[#0c1324] flex items-center justify-center p-6 text-on-background select-none font-mono">
          {/* Ambient overlays */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#070d1f_100%)] opacity-85"></div>
          <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.95)] opacity-90"></div>
          <div className="absolute left-0 w-full h-[1px] bg-error/30 shadow-[0_0_8px_#ffb4ab] z-50 pointer-events-none animate-scan-line"></div>
          
          <div className="max-w-lg w-full bg-[#151b2d]/90 border border-error/30 rounded-xl p-6 shadow-[0_16px_40px_rgba(255,180,171,0.15)] flex flex-col gap-4 relative z-10 backdrop-blur-md">
            <div className="flex items-center gap-3 border-b border-error/20 pb-3">
              <AlertTriangle className="text-error animate-pulse" size={24} />
              <div>
                <h1 className="text-sm font-bold text-error tracking-wider">RENDER_ENGINE_EXCEPTION</h1>
                <span className="text-[9px] text-on-surface-variant/50">SYS_CODE: 0x88F0 // CORE_CRASH</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest/80 border border-white/5 rounded-lg p-4 flex flex-col gap-2.5 text-[10px] text-on-surface-variant">
              <div className="flex items-center gap-1.5 text-error font-bold mb-1">
                <Terminal size={12} />
                <span>EXC_LOG: {this.state.error?.name || "UnknownError"}</span>
              </div>
              <p className="font-mono text-on-surface/90 leading-relaxed max-h-24 overflow-y-auto pr-1">
                {this.state.error?.message || "An unexpected rendering fault disrupted the operational layout context."}
              </p>
              {this.state.errorInfo && (
                <div className="text-[8px] opacity-40 font-mono overflow-hidden text-ellipsis whitespace-nowrap mt-1 border-t border-white/5 pt-2">
                  Trace: {this.state.errorInfo.componentStack.split("\n")[1]}
                </div>
              )}
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-error text-on-error font-bold rounded-lg hover:bg-[#ffdad6] hover:text-[#690005] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,180,171,0.25)] active:scale-95 transition-transform"
            >
              <RefreshCw size={14} className="animate-spin" style={{ animationDuration: "4s" }} />
              REBOOT CORE OPERATING SYSTEM
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;

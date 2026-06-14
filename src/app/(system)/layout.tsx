"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ScenarioController } from "@/components/layout/ScenarioController";

export default function SystemLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isMobilePage = pathname === "/mobile";

  if (isMobilePage) {
    return (
      <div className="w-full h-full min-h-screen bg-background relative overflow-y-auto">
        {children}
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen overflow-hidden flex flex-col relative bg-background">
      {/* NAVBAR */}
      <Navbar />

      <div className="flex-grow flex w-full h-[calc(100vh-64px)] mt-16 overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN DISPLAY PORT */}
        <main className="w-full h-full md:w-[calc(100%-16rem)] md:ml-64 overflow-y-auto flex flex-col relative z-20">
          {children}
        </main>
      </div>

      {/* SCENARIO CONTROL TRAY */}
      <ScenarioController />
    </div>
  );
}

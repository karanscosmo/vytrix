import type { Metadata } from "next";
import { Inter, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { StateProvider } from "@/context/state-context";
import { ErrorBoundary } from "@/components/animations/ErrorBoundary";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"]
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-display",
  subsets: ["latin"]
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "VYTRIX - Cinematic AI Disaster Intelligence OS",
  description: "Futuristic real-time climate-tech intelligence and smart-city emergency command operating system.",
  keywords: ["disaster intelligence", "emergency response", "AI command center", "smart city", "geospatial OS"],
  authors: [{ name: "Vytrix Systems" }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* CSS links or extra meta if needed */}
      </head>
      <body
        className={`${inter.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-background text-on-background font-body-main text-body-main overflow-hidden h-screen w-screen selection:bg-primary-fixed-dim selection:text-background`}
      >
        <StateProvider>
          {/* SHADOW OVERLAY FOR DEPTH */}
          <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#070d1f_100%)] opacity-80"></div>
          
          {/* VIGNETTE OVERLAY */}
          <div className="fixed inset-0 pointer-events-none z-[100] shadow-[inset_0_0_200px_rgba(0,0,0,0.9)] opacity-80"></div>
          
          {/* PARTICLES */}
          <div className="fixed inset-0 z-10 overflow-hidden pointer-events-none">
            <div className="absolute w-1 h-1 bg-primary-fixed rounded-full animate-drift" style={{ left: "10%", animationDuration: "8s", animationDelay: "1s" }}></div>
            <div className="absolute w-1.5 h-1.5 bg-tertiary rounded-full animate-drift blur-[1px]" style={{ left: "30%", animationDuration: "12s", animationDelay: "3s" }}></div>
            <div className="absolute w-1 h-1 bg-error rounded-full animate-drift" style={{ left: "60%", animationDuration: "10s", animationDelay: "0s" }}></div>
            <div className="absolute w-2 h-2 bg-primary-container rounded-full animate-drift blur-[2px]" style={{ left: "80%", animationDuration: "15s", animationDelay: "5s" }}></div>
            <div className="absolute w-1 h-1 bg-secondary rounded-full animate-drift" style={{ left: "90%", animationDuration: "9s", animationDelay: "2s" }}></div>
          </div>

          {/* WEATHER SYSTEMS */}
          <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
            <div className="absolute top-[10%] left-[20%] w-[800px] h-[800px] bg-primary-container/5 rounded-full blur-[120px] animate-weather-move mix-blend-screen"></div>
            <div className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-error-container/5 rounded-full blur-[100px] animate-weather-move mix-blend-screen" style={{ animationDelay: "-5s" }}></div>
          </div>

          {/* SCAN LINE EFFECT */}
          <div className="fixed left-0 w-full h-[1px] bg-primary-fixed-dim/20 shadow-[0_0_8px_#00dbe7] z-50 pointer-events-none animate-scan-line"></div>

          {/* CONTENT */}
          <ErrorBoundary>
            <div className="relative z-20 w-full h-full">
              {children}
            </div>
          </ErrorBoundary>
        </StateProvider>
      </body>
    </html>
  );
}

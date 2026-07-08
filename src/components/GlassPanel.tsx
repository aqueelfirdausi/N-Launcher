import React from "react";
import { ScrubberRail } from "./ScrubberRail";
import { ThemePreset, GlassIntensity } from "../lib/settings";

interface GlassPanelProps {
  children: React.ReactNode;
  themePreset: ThemePreset;
  panelOpacity: number;
  glassIntensity: GlassIntensity;
  rail?: React.ReactNode;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  themePreset,
  panelOpacity,
  glassIntensity,
  rail
}) => {
  const blurValue =
    glassIntensity === "subtle" ? "12px" :
    glassIntensity === "strong" ? "40px" :
    "28px";

  return (
    <div
      className="glass-vessel w-[340px] h-[840px] max-h-[calc(100vh-64px)] flex-shrink-0 flex overflow-hidden select-none relative transition-all duration-300"
      style={{
        width: "340px",
        minWidth: "340px",
        "--panel-opacity": panelOpacity,
        "--glass-blur": blurValue,
      } as React.CSSProperties}
      data-theme={themePreset}
    >
      {/* Invisible drag handle for native Tauri window repositioning */}
      <div data-tauri-drag-region className="absolute top-0 left-0 right-0 h-3 z-50" />

      {/* Main vertical content (Search, App List, Footer) */}
      <div className="flex-1 flex flex-col justify-between h-full p-5 pr-2 overflow-hidden">
        {children}
      </div>

      {/* A-Z Navigation Rail */}
      <div className="w-[32px] h-full border-l border-white/5 bg-white/[0.01] py-4 flex items-center justify-center">
        {rail || <ScrubberRail />}
      </div>
    </div>
  );
};

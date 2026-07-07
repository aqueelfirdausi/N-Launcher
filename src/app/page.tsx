"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { MOCK_APPS } from "../lib/mockData";
import { AppItemType } from "../lib/types";
import { GlassPanel } from "../components/GlassPanel";
import { SearchInput } from "../components/SearchInput";
import { AppStream } from "../components/AppStream";
import { UtilityFooter } from "../components/UtilityFooter";
import { SettingsModal } from "../components/SettingsModal";
import { DEFAULT_SETTINGS, NSettings } from "../lib/settings";

export default function LauncherPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [searchInputRef, setSearchInputRef] = useState<HTMLInputElement | null>(null);
  const [isNative, setIsNative] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<NSettings>(DEFAULT_SETTINGS);

  // Filter apps list based on query
  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_APPS;
    
    return MOCK_APPS.filter((app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.description && app.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  // Adjust active index when filtered list changes size
  useEffect(() => {
    setActiveIndex(0);
  }, [filteredApps]);

  // Detect Tauri native environment
  useEffect(() => {
    setIsNative((window as any).__TAURI_INTERNALS__ !== undefined);
  }, []);

  // Load settings from backend on initialization
  useEffect(() => {
    import("../lib/settings").then(({ getSettings }) => {
      getSettings()
        .then((loadedSettings) => {
          setSettings(loadedSettings);
        })
        .catch((err) => {
          setToastMessage(`Failed to load settings: ${err}`);
          setTimeout(() => setToastMessage(null), 4000);
        });
    });
  }, [isNative]);

  // Auto-focus search input when it becomes available
  useEffect(() => {
    searchInputRef?.focus();
  }, [searchInputRef]);

  // Helper to hide native window
  const hideWindow = () => {
    if (isNative) {
      import("@tauri-apps/api/window").then(({ getCurrentWindow }) => {
        getCurrentWindow().hide();
      });
    } else {
      setToastMessage("Hiding window (Simulated)...");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Handle simulated action launches
  const triggerAppLaunch = (app: AppItemType) => {
    if (isNative) {
      import("@tauri-apps/api/core").then(({ invoke }) => {
        invoke<string>("launch_app", { targetId: app.id })
          .then((res) => {
            setToastMessage(res);
            setTimeout(() => setToastMessage(null), 3000);
          })
          .catch((err) => {
            setToastMessage(`Error: ${err}`);
            setTimeout(() => setToastMessage(null), 3000);
          });
      }).catch((err) => {
        setToastMessage(`Failed to load Tauri core: ${err}`);
        setTimeout(() => setToastMessage(null), 3000);
      });
    } else {
      setToastMessage(`Launching ${app.name} (Simulated action)...`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Keyboard navigation event handler
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Focus search automatically if user starts typing letters
      if (
        document.activeElement !== searchInputRef && 
        e.key.length === 1 && 
        !e.ctrlKey && 
        !e.altKey && 
        !e.metaKey
      ) {
        searchInputRef?.focus();
        return;
      }

      if (filteredApps.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filteredApps.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filteredApps.length) % filteredApps.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredApps[activeIndex]) {
          triggerAppLaunch(filteredApps[activeIndex]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
        } else if (searchQuery) {
          // Tier 1: Clear search text
          setSearchQuery("");
        } else if (document.activeElement === searchInputRef) {
          // Tier 2: Blur the search input
          searchInputRef?.blur();
        } else if (isNative) {
          // Tier 3: Hide the Tauri window
          hideWindow();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [filteredApps, activeIndex, searchInputRef, isSettingsOpen, isNative]);

  return (
    <main className={`w-screen h-screen relative overflow-hidden select-none flex items-center justify-center font-sans ${isNative ? "bg-transparent" : "bg-[#0a0614]"}`}>
      {/* 
        Windows 11 Mock Desktop Environment:
        An interactive simulated workspace displaying a deep violet / black ambient aurora backdrop 
        to show how the transparent launcher panel floats and blurs the desktop underneath.
      */}
      {!isNative && (
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: `
              radial-gradient(circle at 15% 25%, rgba(139, 92, 246, 0.15) 0%, transparent 45%),
              radial-gradient(circle at 85% 75%, rgba(6, 182, 212, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 60%),
              #0b0718
            `
          }}
        >
          {/* Subtle grid lines simulating a high-end designer mockup desktop background */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>
      )}

      {/* Floating launcher panel positioned absolute left-8 top-8 in browser, left-0 top-0 in Tauri native */}
      <div className={`absolute z-10 ${isNative ? "left-0 top-0" : "left-8 top-8 animate-fade-in duration-700"}`}>
        <GlassPanel>
          {/* Top Search Zone */}
          <SearchInput 
            value={searchQuery} 
            onChange={setSearchQuery} 
            inputRef={setSearchInputRef}
          />

          {/* Middle App Listing */}
          <AppStream 
            apps={filteredApps} 
            activeIndex={activeIndex} 
            setActiveIndex={setActiveIndex}
            onAppClick={triggerAppLaunch}
          />

          {/* Bottom Utility Footer */}
          <UtilityFooter
            onPowerClick={hideWindow}
            onSettingsClick={() => setIsSettingsOpen(true)}
          />

          {isSettingsOpen && (
            <SettingsModal
              settings={settings}
              onSettingsChange={setSettings}
              onClose={() => setIsSettingsOpen(false)}
            />
          )}
        </GlassPanel>
      </div>

      {/* Simulated Windows 11 Taskbar (Blank translucent strip at the bottom) */}
      {!isNative && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/45 backdrop-blur-md border-t border-white/[0.04] z-20" />
      )}

      {/* Launcher Toast Notifications */}
      {toastMessage && (
        <div className={`absolute left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 backdrop-blur-md text-emerald-200 text-[12px] px-6 py-3 rounded-full shadow-[0_10px_30px_-5px_rgba(16,185,129,0.3)] animate-bounce z-30 ${isNative ? "bottom-4" : "bottom-16"}`}>
          {toastMessage}
        </div>
      )}
    </main>
  );
}

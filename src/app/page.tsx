"use client";

import React, { useState, useEffect, useMemo } from "react";
import { GlassPanel } from "../components/GlassPanel";
import { ScrubberRail } from "../components/ScrubberRail";
import { SearchInput } from "../components/SearchInput";
import { AppStream } from "../components/AppStream";
import { UtilityFooter } from "../components/UtilityFooter";
import { SettingsModal } from "../components/SettingsModal";
import { DEFAULT_SETTINGS, NSettings } from "../lib/settings";
import {
  BUILT_IN_APPS,
  buildDefaultAppLibraryState,
  getSelectableItems,
  SelectableItem,
  LauncherApp,
  mergePriorityState,
  mergeDiscoveredApps
} from "../lib/app-library";

export default function LauncherPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [searchInputRef, setSearchInputRef] = useState<HTMLInputElement | null>(null);
  const [isNative, setIsNative] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<NSettings>(DEFAULT_SETTINGS);

  const [appLibraryState, setAppLibraryState] = useState(() => buildDefaultAppLibraryState());
  const [discoveredApps, setDiscoveredApps] = useState<LauncherApp[]>([]);
  const [expandedWorkspaceIds, setExpandedWorkspaceIds] = useState<string[]>([]);
  const [isLaunching, setIsLaunching] = useState<string | null>(null);

  // Compute the full app list by merging built-in and discovered apps, applying priority status flags
  const apps = useMemo(() => {
    const merged = mergeDiscoveredApps(BUILT_IN_APPS, discoveredApps);
    return mergePriorityState(merged, appLibraryState);
  }, [discoveredApps, appLibraryState]);

  // Compute selectable items based on library state, query and workspace expansion
  const visibleSelectableItems = useMemo(() => {
    return getSelectableItems(apps, appLibraryState, expandedWorkspaceIds, searchQuery);
  }, [apps, appLibraryState, expandedWorkspaceIds, searchQuery]);

  // Compute existing letters in the current app list for the A-Z ScrubberRail
  const existingLetters = useMemo(() => {
    const letters = new Set<string>();
    apps.forEach((app) => {
      if (!app.isHidden) {
        letters.add(app.letter);
      }
    });
    return Array.from(letters);
  }, [apps]);

  // Adjust active index when filtered list changes size
  useEffect(() => {
    setActiveIndex(0);
  }, [visibleSelectableItems]);

  // Detect Tauri native environment
  useEffect(() => {
    setIsNative(
      typeof window !== "undefined" &&
        (window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ !== undefined
    );
  }, []);

  // Load settings from backend on initialization
  useEffect(() => {
    import("../lib/settings").then(({ getSettings }) => {
      getSettings()
        .then((loadedSettings) => {
          setSettings(loadedSettings);
          if (loadedSettings.priorityApps) {
            setAppLibraryState((prev) => ({
              ...prev,
              priorityAppIds: loadedSettings.priorityApps,
            }));
          }
        })
        .catch((err) => {
          setToastMessage(`Failed to load settings: ${err}`);
          setTimeout(() => setToastMessage(null), 4000);
        });
    });
  }, [isNative]);

  // Sync priority apps when settings changes (e.g. from a reset)
  useEffect(() => {
    if (settings && settings.priorityApps) {
      setAppLibraryState((prev) => {
        if (JSON.stringify(prev.priorityAppIds) !== JSON.stringify(settings.priorityApps)) {
          return {
            ...prev,
            priorityAppIds: settings.priorityApps,
          };
        }
        return prev;
      });
    }
  }, [settings]);

  // Load discovered Start Menu apps on initialization
  useEffect(() => {
    if (isNative) {
      import("@tauri-apps/api/core").then(({ invoke }) => {
        invoke<LauncherApp[]>("discover_start_menu_apps")
          .then((loaded) => {
            setDiscoveredApps(loaded);
          })
          .catch((err) => {
            console.error("Failed to discover Start Menu apps:", err);
          });
      }).catch((err) => {
        console.error("Failed to load Tauri core for discovery:", err);
      });
    }
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
  const triggerAppLaunch = (app: LauncherApp) => {
    if (isLaunching) return;

    setIsLaunching(app.id);
    setToastMessage(`Launching ${app.name}...`);

    if (isNative) {
      import("@tauri-apps/api/core").then(({ invoke }) => {
        const cmd = app.source === "startMenu" ? "launch_discovered_app" : "launch_app";
        const args = app.source === "startMenu" ? { appId: app.id } : { targetId: app.id };

        invoke<string>(cmd, args)
          .then(() => {
            setToastMessage(`Opening ${app.name}...`);
            setTimeout(() => {
              setToastMessage(null);
              setIsLaunching(null);
            }, 3000);
          })
          .catch((err) => {
            setIsLaunching(null);
            let safeMsg = "This app could not be opened safely.";
            if (typeof err === "string") {
              if (err.includes("not found") || err.includes("no longer exists")) {
                safeMsg = "The Start Menu shortcut may have moved or is no longer available.";
              } else if (err.includes("Access denied") || err.includes("Launch rejected")) {
                safeMsg = "N Launcher blocked this launch for safety.";
              }
            }
            setToastMessage(safeMsg);
            setTimeout(() => setToastMessage(null), 4000);
          });
      }).catch(() => {
        setIsLaunching(null);
        setToastMessage("Failed to initialize launch system.");
        setTimeout(() => setToastMessage(null), 3000);
      });
    } else {
      setTimeout(() => {
        setToastMessage(`Launched ${app.name} (Simulated)`);
        setIsLaunching(null);
        setTimeout(() => setToastMessage(null), 3000);
      }, 1000);
    }
  };

  // Handle selection of a list item
  const handleItemSelection = (item: SelectableItem) => {
    if (isLaunching) return;

    if (item.type === "app") {
      triggerAppLaunch(item.app);
    } else if (item.type === "workspace") {
      const workspaceId = item.workspace.id;
      setExpandedWorkspaceIds((prev) =>
        prev.includes(workspaceId)
          ? prev.filter((id) => id !== workspaceId)
          : [...prev, workspaceId]
      );
      setToastMessage(`Workspace "${item.workspace.name}" toggled. Workspace launch is coming soon.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Handle toggling pin status to/from Priority section
  const handlePinToggle = (appId: string) => {
    setAppLibraryState((prev) => {
      const isCurrentlyPriority = prev.priorityAppIds.includes(appId);
      let updatedPriorityIds: string[];
      if (isCurrentlyPriority) {
        updatedPriorityIds = prev.priorityAppIds.filter((id) => id !== appId);
        setToastMessage("Removed from Priority");
      } else {
        updatedPriorityIds = [...prev.priorityAppIds, appId];
        setToastMessage("Pinned to Priority");
      }
      setTimeout(() => setToastMessage(null), 3000);

      // Save to settings!
      setSettings((prevSettings) => {
        const updatedSettings = {
          ...prevSettings,
          priorityApps: updatedPriorityIds,
        };
        import("../lib/settings").then(({ saveSettings }) => {
          saveSettings(updatedSettings).catch((err) => {
            console.error("Failed to save settings with priority apps:", err);
          });
        });
        return updatedSettings;
      });

      return {
        ...prev,
        priorityAppIds: updatedPriorityIds,
      };
    });
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

      if (visibleSelectableItems.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % visibleSelectableItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + visibleSelectableItems.length) % visibleSelectableItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (visibleSelectableItems[activeIndex]) {
          handleItemSelection(visibleSelectableItems[activeIndex]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleSelectableItems, activeIndex, searchInputRef, isSettingsOpen, isNative, searchQuery]);

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
        <GlassPanel
          themePreset={settings.themePreset}
          panelOpacity={settings.panelOpacity}
          glassIntensity={settings.glassIntensity}
          rail={<ScrubberRail existingLetters={existingLetters} />}
        >
          {/* Top Search Zone */}
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            inputRef={setSearchInputRef}
          />

          {/* Middle App Listing */}
          <AppStream
            items={visibleSelectableItems}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onItemClick={handleItemSelection}
            uiDensity={settings.uiDensity}
            expandedWorkspaceIds={expandedWorkspaceIds}
            searchQuery={searchQuery}
            allApps={apps}
            onPinToggle={handlePinToggle}
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
              allApps={apps}
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

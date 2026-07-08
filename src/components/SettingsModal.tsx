import React, { useState, useEffect } from "react";
import { X, Sliders, Palette, Eye, LayoutGrid, Keyboard, CheckCircle2, AlertTriangle, RotateCcw } from "lucide-react";
import { NSettings, ThemePreset, GlassIntensity, UiDensity, saveSettings, resetSettings } from "../lib/settings";
import { LauncherApp } from "../lib/app-library";

interface SettingsModalProps {
  settings: NSettings;
  onSettingsChange: (settings: NSettings) => void;
  onClose: () => void;
  allApps: LauncherApp[];
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSettingsChange,
  onClose,
  allApps,
}) => {
  const [modalSettings, setModalSettings] = useState<NSettings>(settings);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const availableApps = allApps.filter((a) => !a.isHidden);

  const getAppFriendlyName = (appId: string): string => {
    const app = allApps.find((a) => a.id === appId);
    if (app) return app.name;

    const fallbacks: Record<string, string> = {
      vscode: "VS Code",
      terminal: "Terminal",
      chrome: "Chrome",
      files: "Files",
      notepad: "Notepad",
    };
    if (fallbacks[appId]) return fallbacks[appId];

    if (appId.startsWith("lnk_")) {
      const raw = appId.slice(4);
      return raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }

    return appId;
  };

  const handleCreateWorkspace = (name: string) => {
    const trimmed = name.trim().slice(0, 32);
    if (!trimmed) return;

    const safeId = trimmed
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let finalId = safeId || "workspace";
    let counter = 1;
    while (modalSettings.workspaces?.some((w) => w.id === finalId)) {
      finalId = `${safeId}-${counter++}`;
    }

    const newWorkspace = {
      id: finalId,
      name: trimmed,
      appIds: [],
    };

    setModalSettings((prev) => ({
      ...prev,
      workspaces: [...(prev.workspaces || []), newWorkspace],
    }));
  };

  const handleRenameWorkspacePrompt = (wsId: string, currentName: string) => {
    const newName = window.prompt("Rename workspace:", currentName);
    if (newName !== null) {
      const trimmed = newName.trim();
      if (trimmed.length > 0) {
        setModalSettings((prev) => ({
          ...prev,
          workspaces: (prev.workspaces || []).map((w) =>
            w.id === wsId ? { ...w, name: trimmed.slice(0, 32) } : w
          ),
        }));
      }
    }
  };

  const handleDeleteWorkspace = (wsId: string) => {
    setModalSettings((prev) => ({
      ...prev,
      workspaces: (prev.workspaces || []).filter((w) => w.id !== wsId),
    }));
  };

  const handleAddAppToWorkspace = (wsId: string, appId: string) => {
    setModalSettings((prev) => ({
      ...prev,
      workspaces: (prev.workspaces || []).map((w) => {
        if (w.id === wsId) {
          if (!w.appIds.includes(appId)) {
            return { ...w, appIds: [...w.appIds, appId] };
          }
        }
        return w;
      }),
    }));
  };

  const handleRemoveAppFromWorkspace = (wsId: string, appId: string) => {
    setModalSettings((prev) => ({
      ...prev,
      workspaces: (prev.workspaces || []).map((w) => {
        if (w.id === wsId) {
          return { ...w, appIds: w.appIds.filter((id) => id !== appId) };
        }
        return w;
      }),
    }));
  };

  // Keep modal settings in sync with parent settings (especially when parent loads or resets)
  useEffect(() => {
    setModalSettings(settings);
  }, [settings]);

  // Success messages fade out after 3 seconds
  useEffect(() => {
    if (statusMessage && !statusMessage.isError) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleThemeChange = (themePreset: ThemePreset) => {
    setModalSettings((prev) => ({ ...prev, themePreset }));
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const panelOpacity = parseFloat(e.target.value);
    setModalSettings((prev) => ({ ...prev, panelOpacity }));
  };

  const handleIntensityChange = (glassIntensity: GlassIntensity) => {
    setModalSettings((prev) => ({ ...prev, glassIntensity }));
  };

  const handleDensityChange = (uiDensity: UiDensity) => {
    setModalSettings((prev) => ({ ...prev, uiDensity }));
  };

  const handleHotkeyToggle = () => {
    setModalSettings((prev) => ({ ...prev, hotkeyHintVisible: !prev.hotkeyHintVisible }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const saved = await saveSettings(modalSettings);
      onSettingsChange(saved);
      setStatusMessage({ text: "Settings saved successfully", isError: false });
    } catch (err) {
      setStatusMessage({ text: `Failed to save settings: ${err}`, isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setStatusMessage(null);
    try {
      const reset = await resetSettings();
      onSettingsChange(reset);
      setModalSettings(reset);
      setStatusMessage({ text: "Settings reset to defaults", isError: false });
    } catch (err) {
      setStatusMessage({ text: `Failed to reset: ${err}`, isError: true });
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#0d091e]/95 rounded-[24px] border border-white/10 flex flex-col p-5 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/5 mb-4">
        <div>
          <h2 className="text-[15px] font-semibold text-white flex items-center gap-1.5">
            <Sliders size={15} className="text-violet-400" />
            Settings
          </h2>
          <p className="text-[11px] text-white/40 mt-0.5">visual preferences only</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
          title="Close Settings"
        >
          <X size={15} />
        </button>
      </div>

      {/* Settings Options (Scrollable area) */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1.5 scrollbar-hide text-left">
        {/* Theme Preset Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-white/60 flex items-center gap-1.5">
            <Palette size={12} className="text-violet-400" />
            Theme Preset
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(["defaultViolet", "minimalDark", "softGlass"] as ThemePreset[]).map((preset) => {
              const isActive = modalSettings.themePreset === preset;
              const labels: Record<ThemePreset, string> = {
                defaultViolet: "Violet",
                minimalDark: "Dark",
                softGlass: "Soft",
              };
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleThemeChange(preset)}
                  className={`text-[11px] py-2 px-1 rounded-lg border transition-all cursor-pointer ${
                    isActive
                      ? "bg-violet-500/10 border-violet-500/40 text-violet-300 font-medium"
                      : "bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {labels[preset]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel Opacity Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-white/60 flex items-center gap-1.5">
              <Eye size={12} className="text-violet-400" />
              Panel Opacity
            </label>
            <span className="text-[11px] text-violet-400 font-mono font-medium">
              {Math.round(modalSettings.panelOpacity * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0.5"
              max="1.0"
              step="0.01"
              value={modalSettings.panelOpacity}
              onChange={handleOpacityChange}
              className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
          </div>
        </div>

        {/* Glass Intensity Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-white/60 flex items-center gap-1.5">
            <Sliders size={12} className="text-violet-400" />
            Glass Intensity (Blur)
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(["subtle", "standard", "strong"] as GlassIntensity[]).map((intensity) => {
              const isActive = modalSettings.glassIntensity === intensity;
              return (
                <button
                  key={intensity}
                  type="button"
                  onClick={() => handleIntensityChange(intensity)}
                  className={`text-[11px] py-2 px-1 rounded-lg border transition-all cursor-pointer capitalize ${
                    isActive
                      ? "bg-violet-500/10 border-violet-500/40 text-violet-300 font-medium"
                      : "bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {intensity}
                </button>
              );
            })}
          </div>
        </div>

        {/* UI Density Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-white/60 flex items-center gap-1.5">
            <LayoutGrid size={12} className="text-violet-400" />
            UI Density
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {(["comfortable", "compact"] as UiDensity[]).map((density) => {
              const isActive = modalSettings.uiDensity === density;
              return (
                <button
                  key={density}
                  type="button"
                  onClick={() => handleDensityChange(density)}
                  className={`text-[11px] py-2 px-2 rounded-lg border transition-all cursor-pointer capitalize ${
                    isActive
                      ? "bg-violet-500/10 border-violet-500/40 text-violet-300 font-medium"
                      : "bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {density}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hotkey Visibility Toggle */}
        <div className="flex items-center justify-between py-1 border-t border-white/5 mt-2">
          <label className="text-[11px] font-medium text-white/60 flex items-center gap-1.5 cursor-pointer" onClick={handleHotkeyToggle}>
            <Eye size={12} className="text-violet-400" />
            Show Hotkey Hint
          </label>
          <button
            type="button"
            onClick={handleHotkeyToggle}
            className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
              modalSettings.hotkeyHintVisible ? "bg-violet-500" : "bg-white/10"
            }`}
          >
            <div
              className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                modalSettings.hotkeyHintVisible ? "left-4.5" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* Read-only Hotkey Display */}
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 space-y-1">
          <span className="text-[9px] uppercase tracking-wider text-white/40 flex items-center gap-1">
            <Keyboard size={10} />
            Global Summon Hotkey
          </span>
          <div className="flex gap-1.5 mt-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-white/80 bg-white/10 rounded border border-white/10 shadow-sm">Ctrl</kbd>
            <span className="text-white/40 text-[10px] self-center">+</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-white/80 bg-white/10 rounded border border-white/10 shadow-sm">Alt</kbd>
            <span className="text-white/40 text-[10px] self-center">+</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-white/80 bg-white/10 rounded border border-white/10 shadow-sm">Space</kbd>
          </div>
        </div>

        {/* Manage Workspaces Section */}
        <div className="space-y-3 pt-3 border-t border-white/5">
          <label className="text-[11px] font-medium text-white/60 flex items-center gap-1.5">
            <LayoutGrid size={12} className="text-violet-400" />
            Manage Workspaces
          </label>

          {/* List of current workspaces */}
          <div className="space-y-2.5">
            {modalSettings.workspaces?.map((ws) => (
              <div
                key={ws.id}
                className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-2 text-left"
              >
                {/* Workspace Title and Rename/Delete Controls */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] font-semibold text-white truncate">
                    {ws.name}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleRenameWorkspacePrompt(ws.id, ws.name)}
                      className="p-1 rounded text-violet-300 hover:text-white hover:bg-white/10 text-[10px] cursor-pointer"
                      title="Rename Workspace"
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteWorkspace(ws.id)}
                      className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 text-[10px] cursor-pointer"
                      title="Delete Workspace"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Apps list in this workspace */}
                <div className="space-y-1">
                  <div className="text-[9px] uppercase tracking-wider text-white/40">
                    Apps in Workspace ({ws.appIds.length})
                  </div>
                  {ws.appIds.length === 0 ? (
                    <div className="text-[10px] text-white/30 italic">No apps added yet.</div>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {ws.appIds.map((appId) => {
                        const appName = getAppFriendlyName(appId);
                        return (
                          <div
                            key={appId}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/80"
                          >
                            <span className="truncate max-w-[80px]">{appName}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAppFromWorkspace(ws.id, appId)}
                              className="text-white/45 hover:text-red-400 cursor-pointer font-bold leading-none pl-0.5"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Add App to Workspace control */}
                <div className="flex gap-1.5 mt-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddAppToWorkspace(ws.id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-white/70 py-1 px-2 focus:outline-none focus:border-violet-500/50 cursor-pointer"
                  >
                    <option value="" className="bg-[#0f0b21]">Add App to Workspace...</option>
                    {availableApps
                      .filter((app) => !ws.appIds.includes(app.id))
                      .map((app) => (
                        <option key={app.id} value={app.id} className="bg-[#0f0b21]">
                          {app.name} {app.source === "startMenu" ? "(Preview)" : ""}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            ))}

            {/* Create New Workspace Control */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="New workspace name..."
                id="new-workspace-input"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg text-[11px] text-white py-1.5 px-3 focus:outline-none focus:border-violet-500/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const input = e.currentTarget;
                    if (input.value.trim()) {
                      handleCreateWorkspace(input.value.trim());
                      input.value = "";
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById("new-workspace-input") as HTMLInputElement;
                  if (input && input.value.trim()) {
                    handleCreateWorkspace(input.value.trim());
                    input.value = "";
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-medium cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimers & Action Footer */}
      <div className="mt-4 pt-3.5 border-t border-white/5 space-y-3">
        {/* Status Message Panel */}
        {statusMessage && (
          <div className={`p-2.5 rounded-lg border flex items-start gap-2 text-left animate-fade-in ${
            statusMessage.isError
              ? "bg-red-500/10 border-red-500/20 text-red-200"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
          }`}>
            {statusMessage.isError ? (
              <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
            )}
            <p className="text-[10px] leading-normal">{statusMessage.text}</p>
          </div>
        )}

        {/* Buttons Row */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] font-medium py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
            title="Reset Settings to Defaults"
          >
            <RotateCcw size={12} />
            Reset Defaults
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="text-[11px] font-medium py-2 rounded-lg bg-violet-600 hover:bg-violet-500 active:scale-98 text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(109,40,217,0.3)] disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full text-[11px] font-medium py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 transition-all cursor-pointer border border-white/5"
        >
          Close
        </button>
      </div>
    </div>
  );
};

import React from "react";
import { X, Sliders, Palette, Eye, LayoutGrid, Keyboard } from "lucide-react";
import { NSettings, ThemePreset, GlassIntensity, UiDensity } from "../lib/settings";

interface SettingsModalProps {
  settings: NSettings;
  onSettingsChange: (settings: NSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSettingsChange,
  onClose,
}) => {
  const handleThemeChange = (themePreset: ThemePreset) => {
    onSettingsChange({ ...settings, themePreset });
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const panelOpacity = parseFloat(e.target.value);
    onSettingsChange({ ...settings, panelOpacity });
  };

  const handleIntensityChange = (glassIntensity: GlassIntensity) => {
    onSettingsChange({ ...settings, glassIntensity });
  };

  const handleDensityChange = (uiDensity: UiDensity) => {
    onSettingsChange({ ...settings, uiDensity });
  };

  const handleHotkeyToggle = () => {
    onSettingsChange({ ...settings, hotkeyHintVisible: !settings.hotkeyHintVisible });
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
              const isActive = settings.themePreset === preset;
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
              {Math.round(settings.panelOpacity * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0.5"
              max="1.0"
              step="0.01"
              value={settings.panelOpacity}
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
              const isActive = settings.glassIntensity === intensity;
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
              const isActive = settings.uiDensity === density;
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
              settings.hotkeyHintVisible ? "bg-violet-500" : "bg-white/10"
            }`}
          >
            <div
              className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                settings.hotkeyHintVisible ? "left-4.5" : "left-0.5"
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
      </div>

      {/* Disclaimers & Footer Action */}
      <div className="mt-4 pt-3.5 border-t border-white/5 space-y-3">
        <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-[10px] text-amber-200/80 leading-normal text-left">
            ⚠️ Settings are UI-only in this phase and are not saved yet.
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full text-[12px] font-medium py-2 rounded-lg bg-violet-600 hover:bg-violet-500 active:scale-98 text-white transition-all cursor-pointer shadow-[0_4px_12px_rgba(109,40,217,0.3)]"
        >
          Done
        </button>
      </div>
    </div>
  );
};

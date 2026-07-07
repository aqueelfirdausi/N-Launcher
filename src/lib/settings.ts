export type ThemePreset = "defaultViolet" | "minimalDark" | "softGlass";
export type GlassIntensity = "subtle" | "standard" | "strong";
export type UiDensity = "comfortable" | "compact";

export interface NSettings {
  schemaVersion: number;
  themePreset: ThemePreset;
  panelOpacity: number;
  glassIntensity: GlassIntensity;
  uiDensity: UiDensity;
  hotkeyHintVisible: boolean;
}

export const DEFAULT_SETTINGS: NSettings = {
  schemaVersion: 1,
  themePreset: "defaultViolet",
  panelOpacity: 0.82,
  glassIntensity: "standard",
  uiDensity: "comfortable",
  hotkeyHintVisible: true,
};

export const THEME_PRESET_OPTIONS: { value: ThemePreset; label: string }[] = [
  { value: "defaultViolet", label: "Default Violet" },
  { value: "minimalDark", label: "Minimal Dark" },
  { value: "softGlass", label: "Soft Glass" },
];

export const GLASS_INTENSITY_OPTIONS: { value: GlassIntensity; label: string }[] = [
  { value: "subtle", label: "Subtle (Blur 12px)" },
  { value: "standard", label: "Standard (Blur 28px)" },
  { value: "strong", label: "Strong (Blur 48px)" },
];

export const UI_DENSITY_OPTIONS: { value: UiDensity; label: string }[] = [
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
];

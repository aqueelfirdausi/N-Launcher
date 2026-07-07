use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum ThemePreset {
    DefaultViolet,
    MinimalDark,
    SoftGlass,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum GlassIntensity {
    Subtle,
    Standard,
    Strong,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum UiDensity {
    Comfortable,
    Compact,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct NSettings {
    pub schema_version: u32,
    pub theme_preset: ThemePreset,
    pub panel_opacity: f64,
    pub glass_intensity: GlassIntensity,
    pub ui_density: UiDensity,
    pub hotkey_hint_visible: bool,
}

impl Default for NSettings {
    fn default() -> Self {
        Self {
            schema_version: 1,
            theme_preset: ThemePreset::DefaultViolet,
            panel_opacity: 0.82,
            glass_intensity: GlassIntensity::Standard,
            ui_density: UiDensity::Comfortable,
            hotkey_hint_visible: true,
        }
    }
}

impl NSettings {
    pub fn validate_and_sanitize(&mut self) {
        // Enforce schemaVersion is 1
        self.schema_version = 1;

        // Clamp panelOpacity
        if !self.panel_opacity.is_finite() {
            self.panel_opacity = 0.82;
        } else if self.panel_opacity < 0.5 {
            self.panel_opacity = 0.5;
        } else if self.panel_opacity > 1.0 {
            self.panel_opacity = 1.0;
        }
    }
}

fn get_settings_path(app: &AppHandle) -> Result<PathBuf, String> {
    app.path()
        .app_config_dir()
        .map(|p| p.join("settings.json"))
        .map_err(|e| format!("Failed to resolve app config path: {}", e))
}

fn backup_corrupted_file(path: &PathBuf) {
    if path.exists() {
        let mut backup_path = path.clone();
        backup_path.set_extension("json.bak");
        let _ = fs::rename(path, backup_path);
    }
}

pub fn load_settings_internal(app: &AppHandle) -> NSettings {
    let path = match get_settings_path(app) {
        Ok(p) => p,
        Err(e) => {
            log::error!("Error resolving settings path: {}", e);
            return NSettings::default();
        }
    };

    if !path.exists() {
        // Missing file: write defaults and return
        let default_settings = NSettings::default();
        let _ = save_settings_internal(app, &default_settings);
        return default_settings;
    }

    match fs::read_to_string(&path) {
        Ok(content) => match serde_json::from_str::<NSettings>(&content) {
            Ok(mut settings) => {
                settings.validate_and_sanitize();
                settings
            }
            Err(e) => {
                log::warn!(
                    "Settings JSON is invalid or corrupted: {}. Backing up and resetting.",
                    e
                );
                backup_corrupted_file(&path);
                let default_settings = NSettings::default();
                let _ = save_settings_internal(app, &default_settings);
                default_settings
            }
        },
        Err(e) => {
            log::error!("Failed to read settings file: {}. Returning defaults.", e);
            NSettings::default()
        }
    }
}

pub fn save_settings_internal(app: &AppHandle, settings: &NSettings) -> Result<(), String> {
    let path = get_settings_path(app)?;

    // Ensure parent directory exists
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create settings directory: {}", e))?;
    }

    let mut sanitized = settings.clone();
    sanitized.validate_and_sanitize();

    let json_content = serde_json::to_string_pretty(&sanitized)
        .map_err(|e| format!("Failed to serialize settings: {}", e))?;

    fs::write(&path, json_content).map_err(|e| format!("Failed to write settings file: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn get_settings(app: AppHandle) -> NSettings {
    load_settings_internal(&app)
}

#[tauri::command]
pub fn save_settings(app: AppHandle, mut settings: NSettings) -> Result<NSettings, String> {
    settings.validate_and_sanitize();
    save_settings_internal(&app, &settings)?;
    Ok(settings)
}

#[tauri::command]
pub fn reset_settings(app: AppHandle) -> Result<NSettings, String> {
    let defaults = NSettings::default();
    save_settings_internal(&app, &defaults)?;
    Ok(defaults)
}

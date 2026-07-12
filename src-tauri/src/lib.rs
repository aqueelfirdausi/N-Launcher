use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::Manager;
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

mod settings;

fn show_and_focus_main_window(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.unminimize();
        let _ = window.show();
        let _ = window.set_focus();
    }
}

struct AppTarget {
    id: &'static str,
    program: &'static str,
    success_message: &'static str,
}

const REAL_TARGETS: &[AppTarget] = &[
    AppTarget {
        id: "files",
        program: "explorer.exe",
        success_message: "Opened File Explorer",
    },
    AppTarget {
        id: "terminal",
        program: "wt.exe",
        success_message: "Opened Windows Terminal",
    },
    AppTarget {
        id: "notepad",
        program: "notepad.exe",
        success_message: "Opened Notepad",
    },
];

const MOCK_TARGETS: &[&'static str] = &[];

fn resolve_vscode_path() -> Option<std::path::PathBuf> {
    // A. User install path: %LOCALAPPDATA%\Programs\Microsoft VS Code\Code.exe
    if let Ok(local_app_data) = std::env::var("LOCALAPPDATA") {
        let path = std::path::Path::new(&local_app_data)
            .join("Programs")
            .join("Microsoft VS Code")
            .join("Code.exe");
        if path.exists() {
            return Some(path);
        }
    }

    // B. System install path: C:\Program Files\Microsoft VS Code\Code.exe
    let system_path = std::path::Path::new(r"C:\Program Files\Microsoft VS Code\Code.exe");
    if system_path.exists() {
        return Some(system_path.to_path_buf());
    }

    None
}

fn launch_vscode() -> Result<String, String> {
    if let Some(path) = resolve_vscode_path() {
        std::process::Command::new(path)
            .spawn()
            .map_err(|e| format!("Failed to launch VS Code: {}", e))?;
        return Ok("Opened VS Code".to_string());
    }

    // C. Fallback to PATH: code.cmd
    std::process::Command::new("code.cmd")
        .spawn()
        .map_err(|_| "VS Code executable not found".to_string())?;

    Ok("Opened VS Code".to_string())
}

fn resolve_chrome_path() -> Option<std::path::PathBuf> {
    // A. System 64-bit install path
    let path_64 = std::path::Path::new(r"C:\Program Files\Google\Chrome\Application\chrome.exe");
    if path_64.exists() {
        return Some(path_64.to_path_buf());
    }

    // B. System 32-bit install path
    let path_32 =
        std::path::Path::new(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe");
    if path_32.exists() {
        return Some(path_32.to_path_buf());
    }

    // C. User LocalAppData install path
    if let Ok(local_app_data) = std::env::var("LOCALAPPDATA") {
        let path = std::path::Path::new(&local_app_data)
            .join("Google")
            .join("Chrome")
            .join("Application")
            .join("chrome.exe");
        if path.exists() {
            return Some(path);
        }
    }

    None
}

fn launch_chrome() -> Result<String, String> {
    if let Some(path) = resolve_chrome_path() {
        std::process::Command::new(path)
            .spawn()
            .map_err(|e| format!("Failed to launch Chrome: {}", e))?;
        return Ok("Opened Chrome".to_string());
    }

    // D. Fallback to PATH: chrome.exe
    std::process::Command::new("chrome.exe")
        .spawn()
        .map_err(|_| "Chrome executable not found".to_string())?;

    Ok("Opened Chrome".to_string())
}

#[derive(serde::Serialize)]
struct DiscoveredApp {
    id: String,
    name: String,
    #[serde(rename = "normalizedName")]
    normalized_name: String,
    letter: String,
    source: String,
    kind: String,
    #[serde(rename = "isPriority")]
    is_priority: bool,
    #[serde(rename = "isHidden")]
    is_hidden: bool,
}

fn scan_programs_dir(dir: &std::path::Path, apps: &mut Vec<DiscoveredApp>) {
    if let Ok(entries) = std::fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                scan_programs_dir(&path, apps);
            } else if path.is_file() {
                if let Some(ext) = path.extension() {
                    if ext.to_ascii_lowercase() == "lnk" {
                        if let Some(file_stem) = path.file_stem() {
                            if let Some(name_str) = file_stem.to_str() {
                                let normalized = name_str.trim().to_lowercase();
                                if normalized.contains("uninstall")
                                    || normalized.contains("help")
                                    || normalized.contains("read me")
                                    || normalized.contains("readme")
                                {
                                    continue;
                                }

                                let first_char = name_str
                                    .trim()
                                    .chars()
                                    .next()
                                    .unwrap_or('#')
                                    .to_uppercase()
                                    .to_string();
                                let letter =
                                    if first_char.as_str() >= "A" && first_char.as_str() <= "Z" {
                                        first_char
                                    } else {
                                        "#".to_string()
                                    };

                                let app_id = format!(
                                    "lnk_{}",
                                    normalized
                                        .replace(" ", "_")
                                        .replace("-", "_")
                                        .replace(".", "_")
                                );

                                apps.push(DiscoveredApp {
                                    id: app_id,
                                    name: name_str.to_string(),
                                    normalized_name: normalized,
                                    letter,
                                    source: "startMenu".to_string(),
                                    kind: "app".to_string(),
                                    is_priority: false,
                                    is_hidden: false,
                                });
                            }
                        }
                    }
                }
            }
        }
    }
}

#[tauri::command]
fn discover_start_menu_apps() -> Result<Vec<DiscoveredApp>, String> {
    let mut apps = Vec::new();

    // 1. System Start Menu
    let system_start_menu =
        std::path::Path::new(r"C:\ProgramData\Microsoft\Windows\Start Menu\Programs");
    if system_start_menu.exists() {
        scan_programs_dir(system_start_menu, &mut apps);
    }

    // 2. User Start Menu
    if let Ok(appdata) = std::env::var("APPDATA") {
        let user_start_menu = std::path::Path::new(&appdata)
            .join("Microsoft")
            .join("Windows")
            .join("Start Menu")
            .join("Programs");
        if user_start_menu.exists() {
            scan_programs_dir(&user_start_menu, &mut apps);
        }
    }

    // Deduplicate by normalized name
    apps.sort_by(|a, b| a.normalized_name.cmp(&b.normalized_name));
    apps.dedup_by(|a, b| a.normalized_name == b.normalized_name);

    Ok(apps)
}

fn find_shortcut_by_id(dir: &std::path::Path, target_id: &str) -> Option<std::path::PathBuf> {
    if let Ok(entries) = std::fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                if let Some(found) = find_shortcut_by_id(&path, target_id) {
                    return Some(found);
                }
            } else if path.is_file() {
                if let Some(ext) = path.extension() {
                    if ext.to_ascii_lowercase() == "lnk" {
                        if let Some(file_stem) = path.file_stem() {
                            if let Some(name_str) = file_stem.to_str() {
                                let normalized = name_str.trim().to_lowercase();
                                if normalized.contains("uninstall")
                                    || normalized.contains("help")
                                    || normalized.contains("read me")
                                    || normalized.contains("readme")
                                {
                                    continue;
                                }
                                let id = format!(
                                    "lnk_{}",
                                    normalized
                                        .replace(" ", "_")
                                        .replace("-", "_")
                                        .replace(".", "_")
                                );
                                if id == target_id {
                                    return Some(path);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    None
}

fn resolve_shortcut_path(app_id: &str) -> Option<std::path::PathBuf> {
    // 1. System Start Menu
    let system_start_menu =
        std::path::Path::new(r"C:\ProgramData\Microsoft\Windows\Start Menu\Programs");
    if system_start_menu.exists() {
        if let Some(path) = find_shortcut_by_id(system_start_menu, app_id) {
            return Some(path);
        }
    }

    // 2. User Start Menu
    if let Ok(appdata) = std::env::var("APPDATA") {
        let user_start_menu = std::path::Path::new(&appdata)
            .join("Microsoft")
            .join("Windows")
            .join("Start Menu")
            .join("Programs");
        if user_start_menu.exists() {
            if let Some(path) = find_shortcut_by_id(&user_start_menu, app_id) {
                return Some(path);
            }
        }
    }

    None
}

fn is_inside_approved_directories(path: &std::path::Path) -> bool {
    let canonical_path = match path.canonicalize() {
        Ok(p) => p,
        Err(_) => return false,
    };

    let system_start_menu =
        std::path::Path::new(r"C:\ProgramData\Microsoft\Windows\Start Menu\Programs");
    let system_canonical = system_start_menu.canonicalize().ok();

    let user_canonical = if let Ok(appdata) = std::env::var("APPDATA") {
        std::path::Path::new(&appdata)
            .join("Microsoft")
            .join("Windows")
            .join("Start Menu")
            .join("Programs")
            .canonicalize()
            .ok()
    } else {
        None
    };

    if let Some(sys_dir) = system_canonical {
        if canonical_path.starts_with(sys_dir) {
            return true;
        }
    }

    if let Some(usr_dir) = user_canonical {
        if canonical_path.starts_with(usr_dir) {
            return true;
        }
    }

    false
}

#[tauri::command]
fn launch_discovered_app(app_id: String) -> Result<String, String> {
    let lnk_path = match resolve_shortcut_path(&app_id) {
        Some(path) => path,
        None => return Err("Start Menu shortcut not found.".to_string()),
    };

    if !lnk_path.exists() {
        return Err("Shortcut file no longer exists.".to_string());
    }

    if !is_inside_approved_directories(&lnk_path) {
        return Err("Access denied: path is outside approved directories.".to_string());
    }

    let path_str = lnk_path
        .to_str()
        .ok_or_else(|| "Invalid shortcut path encoding.".to_string())?;

    std::process::Command::new("cmd")
        .args(&["/c", "start", "", path_str])
        .spawn()
        .map_err(|_| "Operating system failed to execute application.".to_string())?;

    Ok(format!("Successfully launched: {}", app_id))
}

#[tauri::command]
fn launch_app(target_id: String) -> Result<String, String> {
    // Handle VS Code separately due to dynamic resolution
    if target_id == "vscode" {
        return launch_vscode();
    }

    // Handle Chrome separately due to dynamic resolution
    if target_id == "chrome" {
        return launch_chrome();
    }

    // Check real registry first
    if let Some(target) = REAL_TARGETS.iter().find(|t| t.id == target_id) {
        std::process::Command::new(target.program)
            .spawn()
            .map_err(|e| format!("Failed to launch {}: {}", target.program, e))?;
        return Ok(target.success_message.to_string());
    }

    // Check mock targets second
    if MOCK_TARGETS.contains(&target_id.as_str()) {
        println!("Mock launch accepted: {}", target_id);
        return Ok(format!("Mock launch accepted: {}", target_id));
    }

    // Unknown targets
    Err("Unknown target id".to_string())
}

struct AppState {
    global_hotkey_available: std::sync::atomic::AtomicBool,
}

#[tauri::command]
fn is_global_hotkey_available(state: tauri::State<'_, AppState>) -> bool {
    state
        .global_hotkey_available
        .load(std::sync::atomic::Ordering::Relaxed)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            launch_app,
            discover_start_menu_apps,
            launch_discovered_app,
            settings::get_settings,
            settings::save_settings,
            settings::reset_settings,
            is_global_hotkey_available
        ])
        .on_menu_event(|app, event| match event.id.0.as_str() {
            "show" => {
                show_and_focus_main_window(app);
            }
            "quit" => {
                app.exit(0);
            }
            _ => {}
        })
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            if let Some(window) = app.get_webview_window("main") {
                window.show().unwrap();
            }

            // Create a minimal system tray right-click menu
            let show_item = MenuItem::with_id(app, "show", "Show Launcher", true, None::<&str>)?;
            let separator = PredefinedMenuItem::separator(app)?;
            let quit_item = MenuItem::with_id(app, "quit", "Quit N Launcher", true, None::<&str>)?;
            let tray_menu = Menu::new(app)?;
            tray_menu.append(&show_item)?;
            tray_menu.append(&separator)?;
            tray_menu.append(&quit_item)?;

            // Build a minimal system tray icon.
            // Left-click (button up) shows and focuses the main launcher window,
            // recovering from the Escape-hide state.
            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .tooltip("N Launcher")
                .menu(&tray_menu)
                .show_menu_on_left_click(false)
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        show_and_focus_main_window(tray.app_handle());
                    }
                })
                .build(app)?;

            // Register the global shortcut plugin
            app.handle().plugin(
                tauri_plugin_global_shortcut::Builder::new()
                    .with_handler(|app, _shortcut, event| {
                        if event.state() == ShortcutState::Pressed {
                            show_and_focus_main_window(app);
                        }
                    })
                    .build(),
            )?;

            // Register the Ctrl+Alt+Space shortcut
            use std::str::FromStr;
            let mut hotkey_available = true;
            match Shortcut::from_str("ctrl+alt+space") {
                Ok(ctrl_alt_space) => {
                    if let Err(e) = app.global_shortcut().register(ctrl_alt_space) {
                        log::error!("Failed to register Ctrl+Alt+Space global shortcut: {}", e);
                        hotkey_available = false;
                    }
                }
                Err(e) => {
                    log::error!("Failed to parse Ctrl+Alt+Space shortcut: {}", e);
                    hotkey_available = false;
                }
            }
            app.manage(AppState {
                global_hotkey_available: std::sync::atomic::AtomicBool::new(hotkey_available),
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}

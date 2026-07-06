use tauri::Manager;

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
  let path_32 = std::path::Path::new(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe");
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![launch_app])
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

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

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
];

const MOCK_TARGETS: &[&'static str] = &["vscode", "chrome", "spotify"];

#[tauri::command]
fn launch_app(target_id: String) -> Result<String, String> {
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

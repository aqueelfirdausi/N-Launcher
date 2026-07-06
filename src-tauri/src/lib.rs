use tauri::Manager;

#[tauri::command]
fn launch_app(target_id: String) -> Result<String, String> {
  match target_id.as_str() {
    "files" => {
      std::process::Command::new("explorer.exe")
        .spawn()
        .map_err(|e| format!("Failed to launch File Explorer: {}", e))?;
      Ok("Opened File Explorer".to_string())
    }
    "vscode" | "terminal" | "chrome" | "spotify" => {
      println!("Mock launch accepted: {}", target_id);
      Ok(format!("Mock launch accepted: {}", target_id))
    }
    _ => Err("Unknown target id".to_string()),
  }
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

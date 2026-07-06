use tauri::Manager;

#[tauri::command]
fn launch_app(target_id: String) -> Result<String, String> {
  match target_id.as_str() {
    "vscode" | "terminal" | "chrome" | "files" | "spotify" => {
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

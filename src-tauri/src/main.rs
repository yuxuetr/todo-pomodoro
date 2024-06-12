#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem, Manager};
use tauri_plugin_sql::Builder;

fn main() {
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let show = CustomMenuItem::new("show".to_string(), "Show");

  let tray_menu = SystemTrayMenu::new()
    .add_item(show)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(quit);
  let system_tray = SystemTray::new().with_menu(tray_menu);

  tauri::Builder::default()
    .plugin(Builder::default().build())
    .system_tray(system_tray)
    .on_system_tray_event(|app, event| {
      match event {
        SystemTrayEvent::MenuItemClick {id, .. } => {
          match id.as_str() {
            "quit" => {
              std::process::exit(0);
            }
            "show" => {
              let window = app.get_window("main").unwrap();
              window.show().unwrap();
              window.set_focus().unwrap();
            }
            _ => {}
          }
        }
        _ => {}
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}


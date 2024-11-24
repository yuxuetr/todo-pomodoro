use tauri::{
  menu::{Menu, MenuItem},
  tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
  Manager,
};

pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_sql::Builder::new().build())
    .setup(|app| {
      let quit_item = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
      let menu = Menu::with_items(app, &[&quit_item])?;

      // 构建托盘图标
      TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
          "quit" => {
            app.exit(0);
          }
          _ => {
            print!("Unknown menu item: {:?}", event.id);
          }
        })
        .on_tray_icon_event(|tray, event| match event {
          TrayIconEvent::Click {
            id: _,
            position: _,
            rect: _,
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
          } => {
            println!("托盘图标被左键点击");
            let app_handle = tray.app_handle();
            if let Some(window) = app_handle.get_webview_window("main") {
              if let Err(e) = window.show() {
                eprintln!("Failed to show window: {:?}", e);
              }
              if let Err(e) = window.set_focus() {
                eprintln!("Failed to set focus to window: {:?}", e);
              }
            }
          }
          _ => {
            // 忽略其他事件
          }
        })
        .build(app)?;

      Ok(())
    })
    .plugin(tauri_plugin_sql::Builder::default().build())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

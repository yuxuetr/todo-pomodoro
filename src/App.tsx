import { useEffect } from "react";
import { appWindow } from "@tauri-apps/api/window";
import { PomodoroTimer, TodoList } from "./components";
import { createTodoTable } from "./dbops";

function App() {
  useEffect(() => {
    const hideWindowOnClose = async () => {
      await appWindow.listen('tauri://close-requested', () => {
        appWindow.hide();
      });
    };

    async function setupDb() {
      await createTodoTable();
    }

    hideWindowOnClose();
    setupDb();
  }, []);

  return (
    <div className="w-full flex">
      <div className="w-1/2">
        <PomodoroTimer />
      </div>
      <div className="w-1/2">
        <TodoList />
      </div>
    </div>
  );
}

export default App;

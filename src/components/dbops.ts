import Database from 'tauri-plugin-sql-api';
import { Todo } from './types';

async function initDb() {
  const db = await Database.load("sqlite:todos.db");
  return db;
}

export async function createTodoTable() {
  try {
    const db = await initDb();
    await db.execute(`
      CREATE TABLE IF NOT EXISTS todo (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT NOT NULL,
          completed INTEGER NOT NULL,
          created_time TEXT NOT NULL,
          completion_time TEXT,
          tags TEXT
      )
    `);
  } catch (error) {
    console.error("Failed to create todo table:", error);
  }
}

export async function insertTodo(text: string, tags: string | null) {
  try {
    const db = await initDb();
    const createdTime = new Date().toISOString();
    await db.execute(`
      INSERT INTO todo (text, completed, created_time, completion_time, tags) VALUES (?, ?, ?, ?, ?)
    `, [text, 0, createdTime, null, tags]);
  } catch (error) {
    console.error("Failed to insert todo:", error);
  }
}

export async function completeTodo(id: number) {
  try {
    const db = await initDb();
    const completionTime = new Date().toISOString();
    await db.execute(`
      UPDATE todo SET completed = ?, completion_time = ? WHERE id = ?
    `, [1, completionTime, id]);
  } catch (error) {
    console.error("Failed to complete todo:", error);
  }
}

export async function uncompleteTodo(id: number) {
  try {
    const db = await initDb();
    await db.execute(`
      UPDATE todo SET completed = ?, completion_time = ? WHERE id = ?
    `, [0, null, id]);
  } catch (error) {
    console.error("Failed to uncomplete todo:", error);
  }
}

export async function deleteTodo(id: number) {
  try {
    const db = await initDb();
    await db.execute(`
      DELETE FROM todo WHERE id = ?
    `, [id]);
  } catch (error) {
    console.error("Failed to delete todo:", error);
  }
}

export async function queryTodosByTag(tag: string): Promise<Todo[]> {
  try {
    const db = await initDb();
    const result = await db.select(`
      SELECT * FROM todo WHERE tags LIKE ?
    `, [`%${tag}%`]);
    return result as Todo[];
  } catch (error) {
    console.error("Failed to query todos by tag:", error);
    return []
  }
}

export async function queryAllTodos(): Promise<Todo[]> {
  try {
    const db = await initDb();
    const result = await db.select("SELECT * FROM todo");
    return result as Todo[];
  } catch (error) {
    console.error("Failed to query all todos:", error);
    return [];
  }
}


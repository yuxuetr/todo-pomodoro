export interface Todo {
  id: number;
  text: string;
  completed: number;
  created_time: string;
  completion_time: string | null;
  tags: string | null;
}

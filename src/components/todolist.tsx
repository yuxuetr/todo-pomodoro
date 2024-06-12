import React, { useEffect, useState } from 'react';
import { queryAllTodos, insertTodo, completeTodo, uncompleteTodo, deleteTodo } from '../dbops';

export const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchTodos() {
      const todos = await queryAllTodos();
      setTodos(todos);
    }
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (newTodoText.trim() === '') return;
    await insertTodo(newTodoText, selectedTags.join(','));
    const todos = await queryAllTodos();
    setTodos(todos);
    setNewTodoText('');
    setSelectedTags([]);
  };

  const toggleComplete = async (id: number, completed: boolean) => {
    if (completed) {
      await uncompleteTodo(id);
    } else {
      await completeTodo(id);
    }
    const todos = await queryAllTodos();
    setTodos(todos);
  };

  const removeTodo = async (id: number) => {
    await deleteTodo(id);
    const todos = await queryAllTodos();
    setTodos(todos);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  }

  return (
    <div className="p-4 bg-gray-200 h-screen">
      <h1 className="flex items-center text-4xl font-bold mb-4">ToDo List</h1>
      <div className="mb-4">
        <input
          type="text"
          className="bg-gray-300 text-black border p-2 mr-2 input input-bordered input-md w-full max-w-xs"
          placeholder="Add new todo"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
        />
        <div className="flex item-start gap-2 mt-4">
          {['Programming', 'Reading', 'Writing'].map(tag => (
            <div
              key={tag}
              className={`badge badge-outline badge-info cursor-pointer ${selectedTags.includes(tag) ? 'badge-selected' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
        <button
          className="btn bg-blue-500 text-white w-32 mt-4"
          onClick={addTodo}
        >
          Add
        </button>
      </div>
      <ul className="list-none">
        {todos.map((todo: any) => (
          <li key={todo.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id, todo.completed)}
            />
            <span className={`flex-1 ${todo.completed ? 'line-through text-red-300' : ''}`}>
              <span className="text-black mr-4">{todo.text}</span> 
              {todo.tags && todo.tags.split(',').map((tag: string, index: number) => (
                <span key={index} className="badge badge-outline badge-success mr-1">{tag}</span>
              ))}
            </span>
            <button
              className="btn btn-circle btn-outline btn-error text-white p-1 ml-2"
              onClick={() => removeTodo(todo.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};


import { Action, ActionPanel, Color, Icon, List, showToast, Toast, environment } from "@raycast/api";
import { LocalStorage } from "@raycast/api";
import { parseTimeContext, formatReminderTime } from "./time-parser";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  reminderTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Get the storage key for the current user
function getUserStorageKey(): string {
  return `todos_${environment.supportPath.split('/').pop()}`;
}

export async function getTodos(): Promise<Todo[]> {
  const storageKey = getUserStorageKey();
  const storedTodos = await LocalStorage.getItem<string>(storageKey);
  const todos = storedTodos ? JSON.parse(storedTodos) : [];
  
  // Convert stored date strings back to Date objects
  return todos.map((todo: Todo) => ({
    ...todo,
    reminderTime: todo.reminderTime ? new Date(todo.reminderTime) : undefined,
    createdAt: new Date(todo.createdAt),
    updatedAt: new Date(todo.updatedAt)
  }));
}

export async function saveTodos(todos: Todo[]) {
  const storageKey = getUserStorageKey();
  await LocalStorage.setItem(storageKey, JSON.stringify(todos));
}

export async function addTodo(title: string) {
  if (!title) {
    await showToast(Toast.Style.Failure, "Cannot add empty todo");
    return;
  }

  // Parse time context from the title
  const timeMatch = parseTimeContext(title);
  const reminderTime = timeMatch?.date;

  const now = new Date();
  const todos = await getTodos();
  todos.push({ 
    id: generateId(), 
    title, 
    completed: false,
    reminderTime,
    createdAt: now,
    updatedAt: now
  });

  await saveTodos(todos);
  
  if (reminderTime) {
    await showToast(Toast.Style.Success, "Todo added", `Reminder set for ${formatReminderTime(reminderTime)}`);
  } else {
    await showToast(Toast.Style.Success, "Todo added");
  }

  // If there's a reminder time, schedule a notification
  if (reminderTime) {
    const delay = reminderTime.getTime() - now.getTime();
    
    if (delay > 0) {
      setTimeout(async () => {
        await showToast(Toast.Style.Success, "Todo Reminder", title);
      }, delay);
    }
  }
}

export async function completeTodo(id: string) {
  const todos = await getTodos();
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = true;
    todo.updatedAt = new Date();
    await saveTodos(todos);
    await showToast(Toast.Style.Success, "Todo completed");
  }
}

export async function deleteTodo(id: string) {
  let todos = await getTodos();
  todos = todos.filter((t) => t.id !== id);
  await saveTodos(todos);
  await showToast(Toast.Style.Success, "Todo deleted");
}

export async function moveTodoUp(id: string) {
  const todos = await getTodos();
  const index = todos.findIndex((t) => t.id === id);
  if (index > 0) {
    [todos[index - 1], todos[index]] = [todos[index], todos[index - 1]];
    todos[index].updatedAt = new Date();
    todos[index - 1].updatedAt = new Date();
    await saveTodos(todos);
  }
}

export async function moveTodoDown(id: string) {
  const todos = await getTodos();
  const index = todos.findIndex((t) => t.id === id);
  if (index < todos.length - 1) {
    [todos[index], todos[index + 1]] = [todos[index + 1], todos[index]];
    todos[index].updatedAt = new Date();
    todos[index + 1].updatedAt = new Date();
    await saveTodos(todos);
  }
}

// Utility function to get all todos for a specific user
export async function getTodosForUser(username: string): Promise<Todo[]> {
  const storageKey = `todos_${username}`;
  const storedTodos = await LocalStorage.getItem<string>(storageKey);
  const todos = storedTodos ? JSON.parse(storedTodos) : [];
  
  return todos.map((todo: Todo) => ({
    ...todo,
    reminderTime: todo.reminderTime ? new Date(todo.reminderTime) : undefined,
    createdAt: new Date(todo.createdAt),
    updatedAt: new Date(todo.updatedAt)
  }));
}

// Utility function to clear all todos for the current user
export async function clearUserTodos(): Promise<void> {
  const storageKey = getUserStorageKey();
  await LocalStorage.removeItem(storageKey);
  await showToast(Toast.Style.Success, "All todos cleared");
} 
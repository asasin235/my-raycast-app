import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { completeTodo, deleteTodo, moveTodoDown, moveTodoUp, Todo } from "./todo-manager";

interface ManageTodosViewProps {
  todos?: {
    incomplete: Todo[];
    completed: Todo[];
  };
  revalidate: () => void;
}

export function ManageTodosView({ todos, revalidate }: ManageTodosViewProps) {
  async function handleComplete(id: string) {
    await completeTodo(id);
    revalidate();
  }

  async function handleDelete(id: string) {
    await deleteTodo(id);
    revalidate();
  }

  async function handleMoveUp(id: string) {
    await moveTodoUp(id);
    revalidate();
  }

  async function handleMoveDown(id: string) {
    await moveTodoDown(id);
    revalidate();
  }

  return (
    <List>
      <List.Section title="✅ To-Do">
        {todos?.incomplete.map((todo) => (
          <List.Item
            key={todo.id}
            title={todo.title}
            icon={Icon.Circle}
            actions={
              <ActionPanel>
                <Action title="Complete" onAction={() => handleComplete(todo.id)} />
                <Action title="Delete" onAction={() => handleDelete(todo.id)} />
                <Action title="Move Up" onAction={() => handleMoveUp(todo.id)} />
                <Action title="Move Down" onAction={() => handleMoveDown(todo.id)} />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
      <List.Section title="👍 Completed">
        {todos?.completed.map((todo) => (
          <List.Item
            key={todo.id}
            title={todo.title}
            icon={{ source: Icon.Checkmark, tintColor: Color.Green }}
            actions={
              <ActionPanel>
                <Action title="Delete" onAction={() => handleDelete(todo.id)} />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
} 
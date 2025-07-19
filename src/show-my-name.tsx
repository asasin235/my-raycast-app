import { Action, ActionPanel, Detail, getPreferenceValues, List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { getWeatherData, getHumidityDescription } from "./weather";
import { getCurrentTime, getGreeting } from "./time";
import { getRandomQuote } from "./quotes";
import { getTodos, Todo, completeTodo, deleteTodo } from "./todo-manager";
import { AddTodoForm } from "./add-todo-form";
import { ManageTodosView } from "./manage-todos-view";
import { formatReminderTime } from "./time-parser";

interface Preferences {
  userName: string;
  latitude: string;
  longitude: string;
  workAddress: string;
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const {
    data: weather,
    isLoading: weatherLoading,
    revalidate: revalidateWeather,
  } = usePromise(getWeatherData);
  const {
    data: todos,
    isLoading: todosLoading,
    revalidate: revalidateTodos,
  } = usePromise(async () => {
    const allTodos = await getTodos();
    const incomplete = allTodos.filter((todo: Todo) => !todo.completed);
    const completed = allTodos.filter((todo: Todo) => todo.completed);
    return { incomplete, completed };
  });

  const time = getCurrentTime();
  const greeting = getGreeting(preferences.userName);
  const quote = getRandomQuote();

  const commuteUrl = preferences.workAddress
    ? `https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${encodeURIComponent(
        preferences.workAddress,
      )}`
    : "https://www.google.com/maps";

  const weatherMarkdown = weather
    ? `### 🌦️ Weather\n\n*   **${weather.temp}°C**, ${
        weather.description
      }\n*   **💧 Humidity:** ${weather.humidity ?? "–"}%\n*   **🌡️ Heat Index:** ${
        weather.heatIndex ?? "–"
      }°C\n\n**☀️ Sun Safety:** ${
        getHumidityDescription(weather.humidity).sunSafety
      }\n\n**🌱 Environmental Advice:** ${getHumidityDescription(weather.humidity).advice}`
    : "Loading weather...";

  const todoMarkdown = `### ✅ To-Do\n\n${
    todos?.incomplete.map((todo: Todo) => {
      const reminderText = todo.reminderTime ? ` (🔔 ${formatReminderTime(todo.reminderTime)})` : '';
      return `- [ ] ${todo.title}${reminderText}`;
    }).join("\n") || "No tasks"
  }\n\n### 👍 Completed\n\n${
    todos?.completed.map((todo: Todo) => `- [x] ${todo.title}`).join("\n") || "No tasks"
  }`;

  function revalidateAll() {
    revalidateWeather();
    revalidateTodos();
  }

  async function handleComplete(id: string) {
    await completeTodo(id);
    revalidateTodos();
  }

  async function handleDelete(id: string) {
    await deleteTodo(id);
    revalidateTodos();
  }

  return (
    <Detail
      isLoading={weatherLoading || todosLoading}
      navigationTitle={greeting}
      markdown={`# ${greeting} 👋\n\n> ${quote}\n\n---\n\n${weatherMarkdown}\n\n---\n\n${todoMarkdown}`}
      actions={
        <ActionPanel>
          <Action.Push title="Add Todo" target={<AddTodoForm revalidate={revalidateTodos} />} />
          <Action.Push
            title="Manage Todos"
            target={<ManageTodosView todos={todos} revalidate={revalidateTodos} />}
          />
          <Action.OpenInBrowser title="Check Commute" url={commuteUrl} />
          <Action title="Refresh" onAction={revalidateAll} />
        </ActionPanel>
      }
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.TagList title="Pending Tasks">
            {todos?.incomplete.map((todo: Todo) => (
              <Detail.Metadata.TagList.Item
                key={todo.id}
                text={todo.reminderTime ? `${todo.title} 🔔` : todo.title}
                color={"#FF6B6B"}
                onAction={() => handleComplete(todo.id)}
              />
            ))}
          </Detail.Metadata.TagList>
          <Detail.Metadata.Separator />
          <Detail.Metadata.TagList title="Completed Tasks">
            {todos?.completed.map((todo: Todo) => (
              <Detail.Metadata.TagList.Item
                key={todo.id}
                text={todo.title}
                color={"#4CAF50"}
                onAction={() => handleDelete(todo.id)}
              />
            ))}
          </Detail.Metadata.TagList>
        </Detail.Metadata>
      }
    />
  );
}

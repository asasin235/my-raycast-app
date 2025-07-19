import { Action, ActionPanel, Form, showToast, Toast, useNavigation } from "@raycast/api";
import { addTodo } from "./todo-manager";

interface AddTodoFormProps {
  revalidate: () => void;
}

export function AddTodoForm({ revalidate }: AddTodoFormProps) {
  const { pop } = useNavigation();

  async function handleSubmit(values: { title: string }) {
    await addTodo(values.title);
    revalidate();
    pop();
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Add Todo" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="title" title="Title" placeholder="Enter todo title" />
    </Form>
  );
}

export default function () {
  return null;
} 
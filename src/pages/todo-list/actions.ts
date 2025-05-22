import { createTask, deleteTask } from "../../shared/api";

type CreateActionState = {
  error?: string;
  title: string;
};

export type CreateTaskActions = (
  state: CreateActionState,
  formData: FormData
) => Promise<CreateActionState>;

export function createTaskAction({
  refetchTasks,
  userId,
}: {
  userId: string;
  refetchTasks: () => void;
}): CreateTaskActions {
  return async (_, formData: FormData) => {
    const title = formData.get("title") as string;
    try {
      const task = {
        createdAt: Date.now(),
        done: false,
        userId,
        title,
        id: crypto.randomUUID(),
      };

      await createTask(task);
      refetchTasks();
      return { title: "" };
    } catch {
      return { title, error: "Error while creating task" };
    }
  };
}

type DeleteTaskActionState = {
  error?: string;
};

export type DeleteTaskActions = (
  state: DeleteTaskActionState,
  formData: FormData
) => Promise<DeleteTaskActionState>;

export function deleteTaskAction({
  refetchTasks,
}: {
  refetchTasks: () => void;
}): DeleteTaskActions {
  return async (_, formData) => {
    const id = formData.get("id") as string;
    try {
      await deleteTask(id);
      refetchTasks();
      return {};
    } catch {
      return {
        error: "Error while deleting task",
      };
    }
  };
}

import {
  startTransition,
  Suspense,
  use,
  useActionState,
  useMemo,
  useState,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { fetchTasks, type Task } from "../../shared/api";
import { useParams } from "react-router-dom";
import { createTaskAction, deleteTaskAction } from "./actions";

export function TodoListPage() {
  const { userId = "" } = useParams();
  const [paginatedTasksPromise, setTasksPromise] = useState(() =>
    fetchTasks({ filters: { userId } })
  );

  const refetchTasks = () =>
    startTransition(() => setTasksPromise(fetchTasks({ filters: { userId } })));

  const tasksPromise = useMemo(
    () => paginatedTasksPromise.then((r) => r.data),
    [paginatedTasksPromise]
  );

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Tasks user {userId}</h1>
      <CreateTaskForm refetchTasks={refetchTasks} userId={userId} />
      <ErrorBoundary
        fallbackRender={(e) => (
          <div className="text-red-500">
            Something went wrong: ${JSON.stringify(e)}
            {""}
          </div>
        )}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <TaskList tasksPromise={tasksPromise} refetchTasks={refetchTasks}/>
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

export function CreateTaskForm({
  userId,
  refetchTasks,
}: {
  userId: string;
  refetchTasks: () => void;
}) {
  const [state, dispatch, isPending] = useActionState(
    createTaskAction({ refetchTasks, userId }),
    { title: "" }
  );

  return (
    <form className="flex gap-2" action={dispatch}>
      <input className="border p-2 m-2 rounded" type="text" name="title" />
      <button
        className="bg-blue-500 hover bg-blue-700 text-white font-bolt py-2 px-4 rounded"
        type="submit"
        disabled={isPending}
        defaultValue={state.title}
      >
        Add
      </button>
      {state.error && <div className="text-red-500">{state.error}</div>}
    </form>
  );
}

export function TaskList({
  tasksPromise,
  refetchTasks,
}: {
  tasksPromise: Promise<Task[]>;
  refetchTasks: () => void;
}) {
  const tasks = use(tasksPromise);
  return (
    <ul className="flex flex-col">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} refetchTasks={refetchTasks} />
      ))}
    </ul>
  );
}

export function TaskCard({
  task,
  refetchTasks,
}: {
  task: Task;
  refetchTasks: () => void;
}) {
  const [deleteState, handleDelete, isPending] = useActionState(
    deleteTaskAction({ refetchTasks }),
    {}
  );

  return (
    <li className="border p-2 m-2 rounded bg-grey-100 flex" key={task.id}>
      {task.title}
      <form className="ml-auto" action={handleDelete}>
        <input type="hidden" name="id" value={task.id} />
        <button
          className="bg-red-500 hover bg-blue-700 text-white font-bolt py-2 px-4 rounded ml-auto"
          type="submit"
          disabled={isPending}
        >
          Delete
        </button>
        {deleteState.error && (
          <div className="text-red-500">{deleteState.error}</div>
        )}
      </form>
    </li>
  );
}

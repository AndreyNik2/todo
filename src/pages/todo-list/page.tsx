import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { Task } from "../../shared/api";
import { useParams } from "react-router-dom";

export function TodoListPage() {
  const { userId } = useParams();
  console.log(userId)
  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Tasks user {userId}</h1>
      <CreateTaskForm />
      <ErrorBoundary
        fallbackRender={(e) => (
          <div className="text-red-500">
            Something went wrong: ${JSON.stringify(e)}
            {""}
          </div>
        )}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <TaskList />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

export function CreateTaskForm() {
  return (
    <form className="flex gap-2">
      <input className="border p-2 m-2 rounded" type="email" name="email" />
      <button
        className="bg-blue-500 hover bg-blue-700 text-white font-bolt py-2 px-4 rounded"
        type="submit"
      >
        Add
      </button>
    </form>
  );
}

export function TaskList() {
  const tasks = [] as Task[];
  return (
    <ul className="flex flex-col">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </ul>
  );
}

export function TaskCard({ task }: { task: Task }) {
  return (
    <li className="border p-2 m-2 rounded bg-grey-100 flex" key={task.id}>
      {task.title}
      <form>
        <input type="hidden" name="id" value={task.id} />
        <button
          className="bg-red-500 hover bg-blue-700 text-white font-bolt py-2 px-4 rounded ml-auto"
          type="button"
        >
          Delete
        </button>
      </form>
    </li>
  );
}

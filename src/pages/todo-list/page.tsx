import {
  startTransition,
  Suspense,
  use,
  useActionState,
  useMemo,
  useState,
  useTransition,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  fetchTasks,
  type PaginatedResponse,
  type Task,
} from "../../shared/api";
import { useParams } from "react-router-dom";
import { createTaskAction, deleteTaskAction } from "./actions";
import { useUsersGlobal } from "../../entities/users-context";

export function TodoListPage() {
  const { userId = "" } = useParams();
  const [page, setPage] = useState(1);
  const [serch, setSerch] = useState('')
  const [paginatedTasksPromise, setTasksPromise] = useState(() =>
    fetchTasks({ filters: { userId } })
  );

  const refetchTasks = () =>
    startTransition(() =>
      setTasksPromise(fetchTasks({ filters: { userId }, page }))
    );
  
  const onPageChange = (newPage: number) => {
    console.log(newPage)
    setPage(newPage);
    setTasksPromise(fetchTasks({ filters: { userId }, page:newPage }));
  }
  fetchTasks({ filters: { userId }, page })


  const tasksPromise = useMemo(
    () => paginatedTasksPromise.then((r) => r.data),
    [paginatedTasksPromise]
  );

  const handeleChangeSerch = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSerch(e.target.value)
  }

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">
        Tasks{" "}
        {
          <Suspense>
            <UserPreview userId={userId} />
            <Pagination tasksPaginated={paginatedTasksPromise} page={1} onPageChange={onPageChange  } />
          </Suspense>
        }
      </h1>
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
          <TaskList tasksPromise={tasksPromise} refetchTasks={refetchTasks} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

function UserPreview({ userId }: { userId: string }) {
  const { usersPromise } = useUsersGlobal();
  const users = use(usersPromise);

  return <span>{users.find((u) => u.id === userId)?.email}</span>;
}

function Pagination({
  tasksPaginated,
  page,
  onPageChange,
}: {
  tasksPaginated: Promise<PaginatedResponse<Task>>;
  page: number;
  onPageChange?: (page: number) => void;
}) {
  const [isLoading, startTransition] = useTransition();
  const { last, first, next, prev, pages } = use(tasksPaginated);

  const onHandlePageChange = (page: number) => {
    startTransition(() => onPageChange?.(page));
  };
  return (
    <nav
      className={`${
        isLoading ? "opacity-50" : ""
      }flex items-center justify-between`}
    >
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => onHandlePageChange(first)}
          className="px-3 py-2 rounded-l"
          disabled={isLoading}
        >
          First({first})
        </button>
        {prev && (
          <button
            onClick={() => onHandlePageChange(prev)}
            className="px-3 py-2"
            disabled={isLoading}
          >
            Prev({prev})
          </button>
        )}
        {next && (
          <button
            onClick={() => onHandlePageChange(next)}
            className="px-3 py-2"
            disabled={isLoading}
          >
            Next({next})
          </button>
        )}
        <button
          onClick={() => onHandlePageChange(pages)}
          className="px-3 py-2 rounded-r"
          disabled={isLoading}
        >
          Last({last})
        </button>
      </div>
      <span className="text-sm">
        Page {page} of {pages}
      </span>
    </nav>
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

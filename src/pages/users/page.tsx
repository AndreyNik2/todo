import {
  Suspense,
  use,
  useActionState,
  useState,
  useTransition,
  startTransition,
} from "react";
import { deleteUser, fetchUsers } from "../../shared/api";
import { ErrorBoundary } from "react-error-boundary";
import { createUserAction } from "./actions";

type User = {
  id: string;
  email: string;
};

const defoultUsersPromise = fetchUsers();

export function UsersPage() {
  const [userPromise, setUserPromise] = useState(defoultUsersPromise);
  const refetchUsers = () =>
    startTransition(() => setUserPromise(fetchUsers()));
  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Users</h1>
      <CreateUserForm refetchUsers={refetchUsers} />
      <ErrorBoundary
        fallbackRender={(e) => (
          <div className="text-red-500">
            Something went wrong: ${JSON.stringify(e)}
            {""}
          </div>
        )}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <UserList userPromise={userPromise} refetchUsers={refetchUsers} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

export function CreateUserForm({ refetchUsers }: { refetchUsers: () => void }) {
  const [state, dispatch, isPending] = useActionState(
    createUserAction({ refetchUsers }),
    {email:""}
  );

  return (
    <form className="flex gap-2" action={dispatch}>
      <input
        className="border p-2 m-2 rounded"
        type="email"
        name="email"
        disabled={isPending}
        defaultValue={state.email}
      />
      <button
        className="bg-blue-500 hover bg-blue-700 text-white font-bolt py-2 px-4 rounded"
        type="submit"
        disabled={isPending}
      >
        Add
      </button>
      {state.error && <div text-red-500>{state.error}</div>}
    </form>
  );
}

export function UserList({
  userPromise,
  refetchUsers,
}: {
  userPromise: Promise<User[]>;
  refetchUsers: () => void;
}) {
  const users = use(userPromise);
  return (
    <ul className="flex flex-col">
      {users.map((user) => (
        <UserCard key={user.id} user={user} refetchUsers={refetchUsers} />
      ))}
    </ul>
  );
}

export function UserCard({
  user,
  refetchUsers,
}: {
  user: User;
  refetchUsers: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      await deleteUser(user.id);
      refetchUsers();
    });
  };

  return (
    <li className="border p-2 m-2 rounded bg-grey-100 flex" key={user.id}>
      {user.email}
      <button
        className="bg-red-500 hover bg-blue-700 text-white font-bolt py-2 px-4 rounded ml-auto"
        type="button"
        onClick={handleDelete}
        disabled={isPending}
      >
        Delete
      </button>
    </li>
  );
}

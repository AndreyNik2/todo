import { Suspense, use, useActionState, useOptimistic } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { type CreateUserActions, type DeleteUserActions } from "./actions";
import { useUsers } from "./use-user";

type User = {
  id: string;
  email: string;
};

export function UsersPage() {
  const { useUsersList, createUserAction, deleteUserAction } = useUsers();
  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Users</h1>
      <CreateUserForm createUserAction={createUserAction} />
      <ErrorBoundary
        fallbackRender={(e) => (
          <div className="text-red-500">
            Something went wrong: ${JSON.stringify(e)}
            {""}
          </div>
        )}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <UserList
            useUsersList={useUsersList}
            deleteUserAction={deleteUserAction}
          />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

export function CreateUserForm({
  createUserAction,
}: {
  createUserAction: CreateUserActions;
}) {
  const [state, dispatch] = useActionState(createUserAction, {
    email: "",
  });

  const [optimisticState, setOptimisticState]=useOptimistic(state)

  return (
    <form className="flex gap-2" action={(formDada: FormData) => {
      setOptimisticState({ email: "" })
      dispatch(formDada)
    }}>
      <input
        className="border p-2 m-2 rounded"
        type="email"
        name="email"
        defaultValue={optimisticState.email}
      />
      <button
        className="bg-blue-500 hover bg-blue-700 text-white font-bolt py-2 px-4 rounded"
        type="submit"
      >
        Add
      </button>
      {optimisticState.error && <div text-red-500>{optimisticState.error}</div>}
    </form>
  );
}

export function UserList({
  deleteUserAction,
  useUsersList,
}: {
  deleteUserAction: DeleteUserActions;
  useUsersList: () => User[];
}) {
  const users = useUsersList();
  return (
    <ul className="flex flex-col">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          deleteUserAction={deleteUserAction}
        />
      ))}
    </ul>
  );
}

export function UserCard({
  user,
  deleteUserAction,
}: {
  user: User;
  deleteUserAction: DeleteUserActions;
}) {
  const [state, handleDelete] = useActionState(deleteUserAction, {});

  return (
    <li className="border p-2 m-2 rounded bg-grey-100 flex" key={user.id}>
      {user.email}
      <form action={handleDelete}>
        <input type="hidden" name="id" value={user.id} />
        <button
          className="bg-red-500 hover bg-blue-700 text-white font-bolt py-2 px-4 rounded ml-auto"
          type="button"
        >
          Delete
        </button>
      </form>
      {state.error && <div text-red-500>{state.error}</div>}
    </li>
  );
}

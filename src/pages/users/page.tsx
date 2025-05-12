import { Suspense, use, useState, useTransition } from "react";
import { createUser, deleteUser, fetchUsers } from "../../shared/api";

type User = {
  id: string;
  email: string;
};

const defoultUsersPromise = fetchUsers();

export function UsersPage() {
  const [userPromise, setUserPromise] = useState(defoultUsersPromise);
  const refetchUsers = () => {
    setUserPromise(fetchUsers());
  };

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Users</h1>
      <CreateUserForm refetchUsers={refetchUsers} />
      <Suspense>
        <UserList userPromise={userPromise} refetchUsers={refetchUsers} />
      </Suspense>
    </main>
  );
}

export function CreateUserForm({ refetchUsers }: { refetchUsers: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await createUser({ email, id: crypto.randomUUID() });
      startTransition(() => {
        refetchUsers();
        setEmail("");
      });
    });
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        className="border p-2 m-2 rounded"
        type="email"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
      />
      <button
        className="bg-blue-500 hover bg-blue-700 text-white font-bolt py-2 px-4 rounded"
        type="submit"
        disabled={isPending}
      >
        Add
      </button>
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

export function UserCard({ user, refetchUsers }: { user: User; refetchUsers: () => void }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      await deleteUser(user.id);
      startTransition(() => {
        refetchUsers();
      });
    });
  };

  return (
    <li className="border p-2 m-2 rounded bg-grey-100" key={user.id}>
      {user.email}
      <button
        className="bg-red-500 hover bg-blue-700 text-white font-bolt py-2 px-4 rounded"
        type="button"
        onClick={handleDelete}
        disabled={isPending}
      >
        Delete
      </button>
    </li>
  );
}

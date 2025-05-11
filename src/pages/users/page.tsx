import { useState } from "react";

type User = {
  id: string;
  email: string;
};

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUsers([...users, { id: crypto.randomUUID(), email }]);
    setEmail("");
  };

  const handleDelete = (id: string) => {
    setUsers((users) => users.filter((user) => user.id !== id));
  };

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Users</h1>
      <section>
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
          >
            Add
          </button>
        </form>
      </section>
      <section>
        <ul className="flex flex-col">
          {users.map((user) => (
            <li className="border p-2 m-2 rounded bg-grey-100" key={user.id}>
              {user.email}
              <button
                className="bg-red-500 hover bg-blue-700 text-white font-bolt py-2 px-4 rounded"
                type="button"
                onClick={()=>handleDelete(user.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

import { createContext, startTransition, useContext, useState } from "react";
import { fetchUsers, type User } from "../shared/api";

type UserContextType = {
  usersPromise: Promise<User[]>;
  refetchUsers: () => void;
};

const UsersContext = createContext<UserContextType | null>(null);

const defaultUserPromise = fetchUsers();

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [usersPromise, setUsersPromise] = useState(defaultUserPromise);
  const refetchUsers = () =>
    startTransition(() => setUsersPromise(fetchUsers()));

  return (
    <UsersContext.Provider value={{ usersPromise, refetchUsers }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsersGlobal() {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsersGlobal must be used within a UsersProvider");
  }
  return context;
}


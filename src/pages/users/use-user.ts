import { useState, startTransition } from "react";
import { fetchUsers } from "../../shared/api";

const defoultUsersPromise = fetchUsers();
export function useUsers() {
  const [userPromise, setUserPromise] = useState(defoultUsersPromise);
  const refetchUsers = () =>
    startTransition(() => setUserPromise(fetchUsers()));
  return [userPromise, refetchUsers] as const;
}

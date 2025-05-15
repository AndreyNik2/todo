import { User } from "./../../shared/api";
import { useState, startTransition, useOptimistic, use } from "react";
import { fetchUsers } from "../../shared/api";
import { createUserAction, deleteUserAction } from "./actions";

const defoultUsersPromise = fetchUsers();
export function useUsers() {
  const [userPromise, setUserPromise] = useState(defoultUsersPromise);
  const refetchUsers = () =>
    startTransition(() => setUserPromise(fetchUsers()));

  const [createdUsers, optimisticCreate] = useOptimistic(
    [] as User[],
    (createdUsers, user: User) => [...createdUsers, user]
  );

  const [deletedUsersIds, optimisticDelete] = useOptimistic(
    [] as string[], (deletedUsers, id:string)=>deletedUsers.concat(id)
  )

  const useUsersList = () => {
    const userse = use(userPromise)

    return userse.concat(createdUsers).filter((user) => !deletedUsersIds.includes(user.id));
  }

  return {
    createUserAction: createUserAction({ refetchUsers, optimisticCreate }),
    deleteUserAction: deleteUserAction({ refetchUsers, optimisticDelete }),
    useUsersList,
  } as const;
}

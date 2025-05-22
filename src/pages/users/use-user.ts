import { useOptimistic, use } from "react";
import { type User } from "../../shared/api";
import { createUserAction, deleteUserAction } from "./actions";
import { useUsersGlobal } from "../../entities/users-context";

export function useUsers() {
  const { refetchUsers, usersPromise } = useUsersGlobal();

  const [createdUsers, optimisticCreate] = useOptimistic(
    [] as User[],
    (createdUsers, user: User) => [...createdUsers, user]
  );

  const [deletedUsersIds, optimisticDelete] = useOptimistic(
    [] as string[],
    (deletedUsers, id: string) => deletedUsers.concat(id)
  );

  const useUsersList = () => {
    const userse = use(usersPromise);

    return userse
      .concat(createdUsers)
      .filter((user) => !deletedUsersIds.includes(user.id));
  };

  return {
    createUserAction: createUserAction({ refetchUsers, optimisticCreate }),
    deleteUserAction: deleteUserAction({ refetchUsers, optimisticDelete }),
    useUsersList,
  } as const;
}

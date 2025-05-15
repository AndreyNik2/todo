import { createUser, deleteUser, type User } from "../../shared/api";

type CreateActionState = {
  error?: string;
  email: string;
};

export type CreateUserActions = (
  state: CreateActionState,
  formData: FormData
) => Promise<CreateActionState>;

export function createUserAction({
  refetchUsers,
  optimisticCreate,
}: {
  refetchUsers: () => void;
  optimisticCreate: (user: User) => void;
}): CreateUserActions {
  return async (_, formData: FormData) => {
    const email = formData.get("email") as string;

    if (email === "admin@gmail.com") {
      return {
        error: "Admin accound is not allowed",
        email,
      };
    }
    try {
      const user = {
        email,
        id: crypto.randomUUID(),
      };
      optimisticCreate(user);
      await createUser(user);
      refetchUsers();
      return { email: "" };
    } catch {
      return { email, error: "Error while creating user" };
    }
  };
}

type DeleteUserActionState = {
  error?: string;
};

export type DeleteUserActions = (
  state: DeleteUserActionState,
  formData: FormData
) => Promise<DeleteUserActionState>;

export function deleteUserAction({
  refetchUsers,
  optimisticDelete,
}: {
  refetchUsers: () => void;
  optimisticDelete: (id: string) => void;
}): DeleteUserActions {
  return async (_, formDada) => {
    const id = formDada.get("id") as string;
    try {
      optimisticDelete(id);
      await deleteUser(id);
      refetchUsers();
      return {};
    } catch {
      return {
        error: "Error while deleting user",
      };
    }
  };
}

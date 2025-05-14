import { createUser, deleteUser } from "../../shared/api";

type CreateActionState = {
  error?: string;
  email: string;
};

export const createUserAction =
  ({ refetchUsers }: { refetchUsers: () => void }) =>
  async (
    _: CreateActionState,
    formData: FormData
  ): Promise<CreateActionState> => {
    const email = formData.get("email") as string;

    if (email === "admin@gmail.com") {
      return {
        error: "Admin accound is not allowed",
        email,
      };
    }
    try {
      await createUser({ email, id: crypto.randomUUID() });
      refetchUsers();
      return { email: "" };
    } catch {
      return { email, error: "Error while creating user" };
    }
  };

type DeleteUserActionState = {
  error?: string;
};

export const deleteUserAction =
  ({ refetchUsers }: { refetchUsers: () => void }) =>
  async (state: DeleteUserActionState, formDada:FormData) => {
    try {
      const id = formDada.get("id") as string
      await deleteUser(id);
      refetchUsers();
      return {};
    } catch {
      return {
        error: "Error while deleting user",
      };
    }
  };

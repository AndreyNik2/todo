import { Route, Routes } from "react-router";
import { UsersPage } from "../pages/users";
import { TodoListPage } from "../pages/todo-list";
import { UsersProvider } from "../entities/users-context";

export function App() {
  return (
    <UsersProvider>
      <Routes>
        <Route path="/" element={<UsersPage />}></Route>
        <Route path="/:userId/tasks" element={<TodoListPage />}></Route>
      </Routes>
    </UsersProvider>
  );
}

import { Route, Routes } from "react-router";
import { UsersPage } from "../pages/users";
import { TodoListPage } from "../pages/todo-list";



export function App() {
  return (
    <Routes>
      <Route path="/" element={<UsersPage />}></Route>
      <Route path="/:userID/tascs" element={<TodoListPage />}></Route>
    </Routes>
  );
}

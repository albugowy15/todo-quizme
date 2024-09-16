import * as React from "react";
import { useDatabase } from "../providers/DatabaseProvider";
import { TodoForm, useTodoForm } from "../components/TodoForm";
import { addTodo } from "../services/todo";

export default function AddTodoPage() {
  const todoForm = useTodoForm({
    mutationFn: () =>
      addTodo(db, {
        title: todoForm.title,
        deadline: todoForm.deadline?.toLocaleString() ?? "",
      }),
    toastMessage: "Todo created!",
  });
  const db = useDatabase();
  return <TodoForm {...todoForm} />;
}

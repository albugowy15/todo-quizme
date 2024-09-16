import * as React from "react";
import { useDatabase } from "../providers/DatabaseProvider";
import { TodoForm, useTodoForm } from "../components/TodoForm";
import { addTodo } from "../services/todo";

export default function AddTodoPage() {
  const todoForm = useTodoForm(() =>
    addTodo(db, {
      title: todoForm.title,
      deadline: todoForm.deadline?.toLocaleString() ?? "",
    }),
  );
  const db = useDatabase();
  return <TodoForm {...todoForm} />;
}

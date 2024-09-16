import * as React from "react";
import { useLocalSearchParams } from "expo-router";
import { useDatabase } from "../../providers/DatabaseProvider";
import { useQuery } from "@tanstack/react-query";
import { TodoForm, useTodoForm } from "../../components/TodoForm";
import { getTodo, updateTodo } from "../../services/todo";

export default function EditTodoPage() {
  const { todoID } = useLocalSearchParams<{ todoID?: string }>();
  const db = useDatabase();
  const id = parseInt(todoID ?? "");
  const { data } = useQuery({
    queryKey: [`todos/${todoID}`],
    queryFn: () => getTodo(db, id),
  });
  const todoForm = useTodoForm({
    mutationFn: () =>
      updateTodo(db, id, {
        title: todoForm.title,
        deadline: todoForm.deadline?.toLocaleString() ?? "",
      }),
    toastMessage: "Todo updated!",
  });

  React.useEffect(() => {
    if (data) {
      todoForm.setDeadline(data.deadline);
      todoForm.setTitle(data.title);
    }
  }, [data]);

  return <TodoForm {...todoForm} />;
}

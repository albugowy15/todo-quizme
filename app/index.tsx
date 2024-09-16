import { useRouter } from "expo-router";
import * as React from "react";
import { FlatList, Text, View } from "react-native";
import { Chip, FAB } from "@rneui/themed";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRefreshOnFocus } from "../hooks/useRefreshOnFocus";
import { useDatabase } from "../providers/DatabaseProvider";
import {
  deleteTodo,
  toggleTodoActive,
  getTodosByActive,
  type FilterState,
} from "../services/todo";
import { TodoItemCard } from "../components/TodoItemCard";
import { showToast } from "../lib/toast";

export default function Page() {
  const [filterTodos, setFilterTodos] = React.useState<FilterState>("ACTIVE");
  const db = useDatabase();
  const { data, refetch } = useQuery({
    queryKey: ["todos"],
    queryFn: () => getTodosByActive(db, filterTodos),
  });
  useRefreshOnFocus(refetch);
  const router = useRouter();
  const mutateTodoDone = useMutation({
    mutationFn: (todoID: number) => toggleTodoActive(db, todoID),
    onSuccess: () => {
      showToast({ msg: "Todo active status updated!" });
      refetch();
    },
  });
  const mutateDeleteTodo = useMutation({
    mutationFn: (todoID: number) => deleteTodo(db, todoID),
    onSuccess: () => {
      showToast({ msg: "Todo deleted!" });
      refetch();
    },
  });
  React.useEffect(() => {
    refetch();
  }, [filterTodos]);

  return (
    <View style={{ padding: 10, flexGrow: 1 }}>
      <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
        <Chip
          title="Active"
          type={filterTodos == "ACTIVE" ? "solid" : "outline"}
          onPress={() => {
            setFilterTodos("ACTIVE");
          }}
        />
        <Chip
          title="Done"
          type={filterTodos == "DONE" ? "solid" : "outline"}
          onPress={() => {
            setFilterTodos("DONE");
          }}
        />
        <Chip
          title="All"
          type={filterTodos == "ALL" ? "solid" : "outline"}
          onPress={() => {
            setFilterTodos("ALL");
          }}
        />
      </View>
      <View style={{ marginTop: 10 }}>
        {data?.length === 0 ? (
          <Text style={{ textAlign: "center", fontSize: 18 }}>
            You don't have any todo
          </Text>
        ) : (
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <TodoItemCard
                active={item.active === 1}
                dealdine={item.deadline}
                title={item.title}
                onItemPress={() => router.push(`/edit/${item.id}`)}
                onCheckboxPress={() => mutateTodoDone.mutate(item.id)}
                onDeletePress={() => mutateDeleteTodo.mutate(item.id)}
              />
            )}
          />
        )}
      </View>
      <FAB
        icon={{ name: "add", color: "white" }}
        color="green"
        placement="right"
        onPress={() => router.push("/add-todo")}
      />
    </View>
  );
}

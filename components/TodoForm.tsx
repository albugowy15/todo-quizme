import { Button, Input } from "@rneui/themed";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import * as React from "react";
import { View, Text } from "react-native";
import type { DateType } from "react-native-ui-datepicker";
import DatePickerDialog from "./DatePickerDialog";
import { useRouter } from "expo-router";

export function useTodoForm(mutationFn: () => any) {
  const [title, setTitle] = React.useState("");
  const [deadline, setDeadline] = React.useState<DateType | undefined>();
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      router.dismiss();
    },
  });
  const onSaveTodo = () => {
    if (title === "") {
      setError("Title cannot be empty");
      return;
    }
    if (!deadline) {
      setError("Deadline cannot be empty");
      return;
    }
    const today = dayjs();
    const diff = dayjs(deadline).diff(today, "second");
    if (diff < 0) {
      setError("Cannot chose deadline before today");
      return;
    }
    setError(null);
    mutation.mutate();
  };
  return {
    title,
    setTitle,
    deadline,
    setDeadline,
    dialogVisible,
    setDialogVisible,
    error,
    setError,
    mutation,
    onSaveTodo,
  };
}

export interface TodoFormProps {
  title: string;
  dialogVisible: boolean;
  deadline: DateType | undefined;
  setDeadline: React.Dispatch<React.SetStateAction<DateType | undefined>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSaveTodo: () => void;
  error: string | null;
}
export const TodoForm = ({
  title,
  dialogVisible,
  deadline,
  setDeadline,
  setTitle,
  setDialogVisible,
  onSaveTodo,
  error,
}: TodoFormProps) => {
  return (
    <View style={{ padding: 10 }}>
      <Input
        label="Title"
        placeholder="Title"
        defaultValue={title}
        onChangeText={(value) => setTitle(value)}
      />
      <Input
        label="Deadline"
        placeholder="Deadline"
        onPress={() => {
          setDialogVisible(true);
        }}
        value={deadline?.toString()}
      />
      <DatePickerDialog
        deadline={deadline}
        setDeadline={setDeadline}
        visible={dialogVisible}
        setVisible={setDialogVisible}
      />
      <Button title="Save" onPress={onSaveTodo} />
      {error && (
        <View
          style={{
            borderWidth: 2,
            padding: 5,
            borderRadius: 5,
            borderColor: "rgb(225 29 72)",
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "rgb(225 29 72)",
              fontSize: 16,
            }}
          >
            Error: {error}
          </Text>
        </View>
      )}
    </View>
  );
};

TodoForm;

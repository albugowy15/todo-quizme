import { Button, Input } from "@rneui/themed";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import * as React from "react";
import { View } from "react-native";
import type { DateType } from "react-native-ui-datepicker";
import DatePickerDialog from "./DatePickerDialog";
import { useRouter } from "expo-router";
import { showToast } from "../lib/toast";

export function useTodoForm({
  mutationFn,
  toastMessage,
}: {
  mutationFn: () => any;
  toastMessage: string;
}) {
  const [title, setTitle] = React.useState("");
  const [deadline, setDeadline] = React.useState<DateType | undefined>();
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      showToast(toastMessage);
      router.dismiss();
    },
  });
  const onSaveTodo = () => {
    if (title === "") {
      showToast("Title cannot be empty", { variant: "error" });
      return;
    }
    if (!deadline) {
      showToast("Deadline cannot be empty", { variant: "error" });
      return;
    }
    const today = dayjs();
    const diff = dayjs(deadline).diff(today, "second");
    if (diff < 0) {
      showToast("Cannot chose deadline before today", { variant: "error" });
      return;
    }
    mutation.mutate();
  };
  return {
    title,
    setTitle,
    deadline,
    setDeadline,
    dialogVisible,
    setDialogVisible,
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
}

export const TodoForm = ({
  title,
  dialogVisible,
  deadline,
  setDeadline,
  setTitle,
  setDialogVisible,
  onSaveTodo,
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
    </View>
  );
};

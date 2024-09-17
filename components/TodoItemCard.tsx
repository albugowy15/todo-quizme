import * as React from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { CheckBox } from "@rneui/themed";
import { Icon } from "@rneui/base";

interface TodoItemCardProps {
  title: string;
  dealdine: string;
  active: boolean;
  onItemPress: () => void;
  onCheckboxPress?: () => void;
  onDeletePress?: () => void;
}

const bgColor: Record<"ACTIVE" | "DONE", string> = {
  DONE: "#16a34a",
  ACTIVE: "#000",
};

const TodoItemCard = (props: TodoItemCardProps) => {
  const statusLabel = props.active ? "ACTIVE" : "DONE";
  return (
    <TouchableHighlight onPress={props.onItemPress} style={{ marginTop: 8 }}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "white",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 5,
          paddingHorizontal: 10,
          borderColor: bgColor[statusLabel],
          borderRadius: 5,
          borderWidth: 2,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {props.title}
          </Text>
          <Text
            style={{
              fontSize: 16,
            }}
          >
            {props.dealdine}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CheckBox
            checked={!props.active}
            containerStyle={{ backgroundColor: "transparent", padding: 0 }}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            checkedColor="green"
            onPress={props.onCheckboxPress}
          />
          <Icon name="delete" color="red" onPress={props.onDeletePress} />
        </View>
      </View>
    </TouchableHighlight>
  );
};

export { type TodoItemCardProps, TodoItemCard };

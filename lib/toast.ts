import Toast from "react-native-root-toast";

export function showToast({
  msg,
  variant = "success",
}: {
  msg: string;
  variant?: "success" | "error";
}) {
  const bgColor = variant === "error" ? "red" : "white";
  const textColor = variant === "error" ? "white" : "black";
  Toast.show(msg, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    containerStyle: {
      backgroundColor: bgColor,
    },
    textColor: textColor,
  });
}

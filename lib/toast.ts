import Toast from "react-native-root-toast";

export function showToast(
  msg: string,
  options?: {
    variant?: "success" | "error";
  },
) {
  const bgColor = options?.variant === "error" ? "red" : "white";
  const textColor = options?.variant === "error" ? "white" : "black";
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

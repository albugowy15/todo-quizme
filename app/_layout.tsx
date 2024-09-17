import { Stack } from "expo-router";
import * as React from "react";
import { Text } from "react-native";
import { DatabaseProvider } from "../providers/DatabaseProvider";
import { QueryProvider } from "../providers/QueryProvier";
import * as Notifications from "expo-notifications";
import useNotifications from "../hooks/useNotifications";
import { RootSiblingParent } from "react-native-root-siblings";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useNotifications();

  return (
    <QueryProvider>
      <React.Suspense fallback={<Text>Loading...</Text>}>
        <DatabaseProvider>
          <RootSiblingParent>
            <Stack>
              <Stack.Screen
                name="index"
                options={{
                  headerTitle: "Home",
                }}
              />
              <Stack.Screen
                name="add-todo"
                options={{
                  headerTitle: "Add Todo",
                }}
              />
              <Stack.Screen
                name="edit/[todoID]"
                options={{
                  headerTitle: "Edit Todo",
                }}
              />
            </Stack>
          </RootSiblingParent>
        </DatabaseProvider>
      </React.Suspense>
    </QueryProvider>
  );
}

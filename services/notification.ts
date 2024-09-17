import * as Notifications from "expo-notifications";

interface SendNotification {
  title?: string;
  body?: string;
  seconds: number;
}

export async function sendNotification({
  title = `You've task todo`,
  body,
  seconds,
}: SendNotification) {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
    },
    trigger: { seconds },
  });
}

export async function cancelNotification(notificationID: string) {
  return await Notifications.cancelScheduledNotificationAsync(notificationID);
}

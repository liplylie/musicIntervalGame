import PushNotification from "react-native-push-notification";
import { PushNotificationIOS } from "react-native";
export const cancelAlarm = (device, id, oid = "") => {
  if (device === "ios") {
    PushNotificationIOS.getScheduledLocalNotifications(notification => {
      notification.forEach(({ userInfo }) => {
        if (userInfo.id === id || userInfo.oid === oid || userInfo.oid === id) {
          PushNotification.cancelLocalNotifications({ id: userInfo.id });
        }
      });
    });
  } else {
    PushNotification.cancelLocalNotifications({ id: JSON.stringify(id) });
  }
};

/**
 * Cancel Alarm for bug in Android push notification cancel
 * @id {string} int for android
 * @alarms {array}
 */
import PushNotification from "react-native-push-notification";
import { setAlarm } from "./setAlarm";

export const androidCancelAlarm = (id, alarms) => {
  PushNotification.cancelAllLocalNotifications();
  if (alarms.length) {
    alarms.forEach(a => {
      if (a.id !== id && a.active) {
        setAlarm("android", a.id, a.date, a.snooze, a.answersNeeded, a.message, a.instrument);
      }
    });
  }
};

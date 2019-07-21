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
        setAlarm({
          device: "android",
          id: a.id,
          date: a.date,
          snooze: a.snooze,
          answersNeeded: a.answersNeeded,
          message: a.message,
          instrument: a.instrument,
          intervalType: a.intervalType
        });
      }
    });
  }
};

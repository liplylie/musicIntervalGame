/**
 * Reset Alarm
 * Double check alarms to make sure they are scheduled
 * @device {string}
 * @a {object} alarm
 * @id {string} int for android
 * @oid {string} needed for iOS
 * @userInfo {object}
 */

import PushNotification from "react-native-push-notification";
import { PushNotificationIOS } from "react-native";

export const resetAlarm = ({ device, alarm, id, snooze = 3 }) => {
  if (device === "android") {
    let repeatTime = 1000 * 60 * Number(snooze);
    PushNotification.localNotificationSchedule({
      message: message || "Alarm",
      date: new Date(alarm.date),
      soundName: "perfect_fifth.mp3",
      id: JSON.stringify(id),
      userInfo: {
        id: JSON.stringify(id),
        oid: JSON.stringify(id),
        snooze: alarm.snoozeTime,
        answersNeeded: alarm.answersNeeded,
        instrument: alarm.instrument,
        intervalType: alarm.intervalType
      },
      repeatType: "time",
      repeatTime: repeatTime
    });
  } else {
    PushNotificationIOS.getScheduledLocalNotifications(notification => {
      if (notification.indexOf({ userInfo: { id: alarm.id } }) > -1) {
        for (let j = 0; j < 10; j++) {
          let initialAlarm = moment(alarm.date).add(
            Number(snooze) * j,
            "minutes"
          );
          for (let i = 0; i < 4; i++) {
            let tempDate = moment(initialAlarm).add(i * 8, "seconds");
            PushNotification.localNotificationSchedule({
              message: message || "Alarm",
              date: new Date(tempDate),
              soundName: "PerfectFifth.mp3",
              userInfo: {
                id: id + String(j) + String(i),
                oid: id,
                snooze: alarm.snoozeTime,
                answersNeeded: alarm.answersNeeded,
                instrument: alarm.instrument,
                intervalType: alarm.intervalType
              }
            });
          }
        }
      }
    });
  }
};

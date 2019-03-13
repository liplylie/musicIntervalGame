import PushNotification from "react-native-push-notification";
import moment from "moment";
export const setAlarm = (device, id, date, snooze) => {
  if (device === "android") {
    let repeatTime = 1000 * 60 * Number(snooze);
    PushNotification.localNotificationSchedule({
      message: message || "Alarm",
      date: new Date(date),
      soundName: "perfect_fifth.mp3",
      id: JSON.stringify(id),
      userInfo: { id: JSON.stringify(id) },
      repeatType: "time",
      repeatTime: repeatTime
    });
  } else {
    // work around for repeat type time for ios
    // oid stands for original id.
    for (let j = 0; j < 10; j++) {
      let initialAlarm = moment(date).add(Number(snooze) * j, "minutes");
      for (let i = 0; i < 4; i++) {
        let tempDate = moment(initialAlarm).add(i * 8, "seconds");
        PushNotification.localNotificationSchedule({
          message: message || "Alarm",
          date: new Date(tempDate),
          soundName: "PerfectFifth.mp3",
          userInfo: {
            id: id + String(j) + String(i),
            oid: id
          }
        });
      }
    }
  }
};

/**
 * Alarm
 * @id {string} int for android
 * @active {boolean}
 * @time {string} formatted hh:mm A
 * @date {string} ISO string
 * @message {string} Alarm message
 * @snoozeTime {int}
 * @answersNeeded {int}
 * @gameType {string}
 */
export class Alarm {
  constructor({
    id,
    active,
    time,
    date,
    message = "Alarm",
    snoozeTime = 1,
    answersNeeded = 3,
    instrument = "",
    intervalType = "",
    gameType = "Interval"
  }) {
    this.id = id;
    this.active = active;
    this.time = time;
    this.date = date;
    this.message = message;
    this.snoozeTime = snoozeTime;
    this.answersNeeded = answersNeeded;
    this.instrument = instrument;
    this.intervalType = intervalType;
    this.gameType = gameType;
  }
}

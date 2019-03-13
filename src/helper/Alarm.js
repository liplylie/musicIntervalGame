export class Alarm {
  constructor(
    id,
    active,
    time,
    date,
    message,
    snoozeTime = 1,
    answersNeeded = 3
  ) {
    this.id = id;
    this.active = active;
    this.time = time;
    this.date = date;
    this.message = message;
    this.snoozeTime = snoozeTime;
    this.answersNeeded = answersNeeded;
  }
}

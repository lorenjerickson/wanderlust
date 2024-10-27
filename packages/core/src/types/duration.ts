export interface Duration {
  length: number;
  interval: DurationInterval;
}

export enum DurationInterval {
  Seconds = 1,
  Minutes = 60,
  Hours = 60 * 60,
  Days = 60 * 60 * 24,
  Weeks = 60 * 60 * 24 * 7,
  Months = 60 * 60 * 24 * 30,
  Years = 60 * 60 * 24 * 30 * 12,
  Perpetual = Infinity,
}

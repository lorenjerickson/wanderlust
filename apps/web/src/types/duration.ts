export enum DurationType {
  Temporary = 'temporary',
  Permanent = 'permanent',
  Concentration = 'concentration',
}

export enum DurationUnits {
  Rounds = 'rounds',
  Seconds = 'seconds',
  Minutes = 'minutes',
  Hours = 'hours',
  Days = 'days',
  Weeks = 'weeks',
  Months = 'months',
  Years = 'years',
  UntilDispelled = 'untilDispelled',
}

export type Duration = {
  type: DurationType
  units?: DurationUnits
  interval?: number
}

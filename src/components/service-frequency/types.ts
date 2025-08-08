export const SERVICE_FREQUENCY_OPTIONS = ['weekly', 'fortnightly', 'every4weeks', 'custom', 'never'] as const

export type FrequencyType = typeof SERVICE_FREQUENCY_OPTIONS[number]

export const DAY_OF_WEEK_OPTIONS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

export type DayOfWeek = typeof DAY_OF_WEEK_OPTIONS[number]

export interface TimeWindow {
  start: string
  end: string
}

export interface ServiceFrequencyConfig {
  frequency: FrequencyType
  customDays?: DayOfWeek[]
  timeWindows?: TimeWindow[]
  exactTime?: string
}

export const SERVICE_FREQUENCY_OPTIONS = [
  'weekly',
  'fortnightly',
  'every_4_weeks',
  'never',
  'custom',
] as const

export type FrequencyType = (typeof SERVICE_FREQUENCY_OPTIONS)[number]

export const DAY_OF_WEEK_OPTIONS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

export type DayOfWeek = (typeof DAY_OF_WEEK_OPTIONS)[number]

export interface TimeWindow {
  start: string
  end: string
}

export interface ExactTime {
  exactTime: string
}

export type TimeConfig = TimeWindow | ExactTime

export interface ServiceFrequencyConfig {
  frequency: FrequencyType
  days?: Record<DayOfWeek, TimeConfig[]>
}

export const SERVICE_CONFIG_TYPE = ['exact_time', 'time_windows', 'individual'] as const

export type ServiceConfigType = (typeof SERVICE_CONFIG_TYPE)[number]

import {ref} from 'vue'
import {type DayOfWeek, type TimeConfig, type TimeWindow} from '../types.ts'

export function useIndividualDayConfig() {
  const individualDays = ref<DayOfWeek[]>([])
  const dayTimeWindowsEnabled = ref<Record<DayOfWeek, boolean>>({} as Record<DayOfWeek, boolean>)
  const dayTimeWindows = ref<Record<DayOfWeek, TimeWindow[]>>({} as Record<DayOfWeek, TimeWindow[]>)
  const dayExactTimeEnabled = ref<Record<DayOfWeek, boolean>>({} as Record<DayOfWeek, boolean>)
  const dayExactTimes = ref<Record<DayOfWeek, string>>({} as Record<DayOfWeek, string>)

  const initializeFromConfig = (
    selectedDays: DayOfWeek[],
    daysConfig: Record<DayOfWeek, TimeConfig[]>,
  ) => {
    individualDays.value = selectedDays

    selectedDays.forEach((day) => {
      const dayConfigs = daysConfig[day] || []

      const timeWindowConfigs = dayConfigs.filter(
        (config) => 'start' in config && 'end' in config,
      ) as TimeWindow[]
      if (timeWindowConfigs.length > 0) {
        dayTimeWindowsEnabled.value[day] = true
        dayTimeWindows.value[day] = timeWindowConfigs
      } else {
        dayTimeWindowsEnabled.value[day] = false
        dayTimeWindows.value[day] = [{start: '', end: ''}]
      }

      const exactTimeConfig = dayConfigs.find((config) => 'exactTime' in config)
      if (exactTimeConfig) {
        dayExactTimeEnabled.value[day] = true
        dayExactTimes.value[day] = (exactTimeConfig as { exactTime: string }).exactTime
      } else {
        dayExactTimeEnabled.value[day] = false
        dayExactTimes.value[day] = ''
      }
    })
  }

  const reset = () => {
    individualDays.value = []
    dayTimeWindowsEnabled.value = {} as Record<DayOfWeek, boolean>
    dayTimeWindows.value = {} as Record<DayOfWeek, TimeWindow[]>
    dayExactTimeEnabled.value = {} as Record<DayOfWeek, boolean>
    dayExactTimes.value = {} as Record<DayOfWeek, string>
  }

  const removeDay = (day: DayOfWeek) => {
    individualDays.value = individualDays.value.filter((d) => d !== day)
    delete dayTimeWindowsEnabled.value[day]
    delete dayTimeWindows.value[day]
    delete dayExactTimeEnabled.value[day]
    delete dayExactTimes.value[day]
  }

  const toggleIndividualDay = (day: DayOfWeek) => {
    if (individualDays.value.includes(day)) {
      individualDays.value = individualDays.value.filter((d) => d !== day)
      delete dayTimeWindowsEnabled.value[day]
      delete dayTimeWindows.value[day]
      delete dayExactTimeEnabled.value[day]
      delete dayExactTimes.value[day]
    } else {
      individualDays.value.push(day)
      if (!dayTimeWindows.value[day]) {
        dayTimeWindows.value = {
          ...dayTimeWindows.value,
          [day]: [{start: '', end: ''}],
        }
      }
      if (!dayExactTimes.value[day]) {
        dayExactTimes.value = {
          ...dayExactTimes.value,
          [day]: '',
        }
      }
    }
  }

  const toggleDayTimeWindows = (day: DayOfWeek, enabled: boolean) => {
    dayTimeWindowsEnabled.value[day] = enabled
    if (!enabled) {
      dayTimeWindows.value[day] = [{start: '', end: ''}]
    }
  }

  const updateDayTimeWindow = (
    day: DayOfWeek,
    index: number,
    field: keyof TimeWindow,
    value: string,
  ) => {
    const updatedTimeWindows = [...dayTimeWindows.value[day]]
    updatedTimeWindows[index] = {
      ...updatedTimeWindows[index],
      [field]: value,
    }
    dayTimeWindows.value = {
      ...dayTimeWindows.value,
      [day]: updatedTimeWindows,
    }
  }

  const addDayTimeWindow = (day: DayOfWeek) => {
    const updatedTimeWindows = [...dayTimeWindows.value[day], {start: '', end: ''}]
    dayTimeWindows.value = {
      ...dayTimeWindows.value,
      [day]: updatedTimeWindows,
    }
  }

  const removeDayTimeWindow = (day: DayOfWeek, index: number) => {
    if (dayTimeWindows.value[day].length > 1) {
      const updatedTimeWindows = [...dayTimeWindows.value[day]]
      updatedTimeWindows.splice(index, 1)
      dayTimeWindows.value = {
        ...dayTimeWindows.value,
        [day]: updatedTimeWindows,
      }
    }
  }

  const toggleDayExactTime = (day: DayOfWeek, enabled: boolean) => {
    dayExactTimeEnabled.value[day] = enabled
    if (!enabled) {
      dayExactTimes.value[day] = ''
    }
  }

  const updateDayExactTime = (day: DayOfWeek, value: string) => {
    dayExactTimes.value = {
      ...dayExactTimes.value,
      [day]: value,
    }
  }

  const getDayConfigs = (): Record<DayOfWeek, TimeConfig[]> => {
    const configs: Record<DayOfWeek, TimeConfig[]> = {} as Record<DayOfWeek, TimeConfig[]>

    individualDays.value.forEach((day) => {
      const timeConfigs: TimeConfig[] = []

      if (dayTimeWindows.value[day] && dayTimeWindows.value[day].some((tw) => tw.start || tw.end)) {
        timeConfigs.push(...dayTimeWindows.value[day].filter((tw) => tw.start || tw.end))
      }

      if (dayExactTimes.value[day] && dayExactTimes.value[day].trim()) {
        timeConfigs.push({exactTime: dayExactTimes.value[day]})
      }

      if (timeConfigs.length > 0) {
        configs[day] = timeConfigs
      }
    })

    return configs
  }

  const getDayTimeWindows = (day: DayOfWeek): TimeWindow[] => {
    return dayTimeWindows.value[day] || [{start: '', end: ''}]
  }

  const getDayExactTime = (day: DayOfWeek): string => {
    return dayExactTimes.value[day] || ''
  }

  return {
    individualDays,
    dayTimeWindowsEnabled,
    dayTimeWindows,
    dayExactTimeEnabled,
    dayExactTimes,
    initializeFromConfig,
    reset,
    removeDay,
    toggleIndividualDay,
    toggleDayTimeWindows,
    updateDayTimeWindow,
    addDayTimeWindow,
    removeDayTimeWindow,
    toggleDayExactTime,
    updateDayExactTime,
    getDayConfigs,
    getDayTimeWindows,
    getDayExactTime,
  }
}

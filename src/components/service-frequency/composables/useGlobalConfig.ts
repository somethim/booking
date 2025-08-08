import {ref} from 'vue'
import {type TimeConfig, type TimeWindow} from '../types.ts'

export function useGlobalConfig() {
  const specifyTimeWindows = ref<boolean>(false)
  const timeWindows = ref<TimeWindow[]>([{start: '', end: ''}])
  const exactTime = ref<boolean>(false)
  const exactTimeValue = ref<string>('')

  const initializeFromConfig = (daysConfig: Record<string, TimeConfig[]>) => {
    const firstDay = Object.values(daysConfig)[0]
    if (!firstDay || firstDay.length === 0) return

    const hasTimeWindows = firstDay.some((config) => 'start' in config && 'end' in config)
    if (hasTimeWindows) {
      specifyTimeWindows.value = true
      timeWindows.value = firstDay
        .filter((config) => 'start' in config && 'end' in config)
        .map((config) => config as TimeWindow)
    }

    const hasExactTime = firstDay.some((config) => 'exactTime' in config)
    if (hasExactTime) {
      exactTime.value = true
      const exactTimeConfig = firstDay.find((config) => 'exactTime' in config) as {
        exactTime: string
      }
      exactTimeValue.value = exactTimeConfig.exactTime
    }
  }

  const reset = () => {
    specifyTimeWindows.value = false
    exactTime.value = false
    exactTimeValue.value = ''
    timeWindows.value = [{start: '', end: ''}]
  }

  const toggleTimeWindows = (enabled: boolean) => {
    specifyTimeWindows.value = enabled
    if (!enabled) {
      timeWindows.value = [{start: '', end: ''}]
    }
  }

  const updateTimeWindow = (index: number, field: keyof TimeWindow, value: string) => {
    timeWindows.value[index] = {
      ...timeWindows.value[index],
      [field]: value,
    }
  }

  const addTimeWindow = () => {
    timeWindows.value.push({start: '', end: ''})
  }

  const removeTimeWindow = (index: number) => {
    if (timeWindows.value.length > 1) {
      timeWindows.value.splice(index, 1)
    }
  }

  const toggleExactTime = (enabled: boolean) => {
    exactTime.value = enabled
    if (!enabled) {
      exactTimeValue.value = ''
    }
  }

  const updateExactTime = (value: string) => {
    exactTimeValue.value = value
  }

  const getDaysConfig = (selectedDays: string[]): Record<string, TimeConfig[]> => {
    if (
      (!specifyTimeWindows.value || !timeWindows.value.some((tw) => tw.start || tw.end)) &&
      (!exactTime.value || !exactTimeValue.value)
    ) {
      return Object.fromEntries(selectedDays.map((day) => [day, []]))
    }

    const timeConfigs: TimeConfig[] = []

    if (specifyTimeWindows.value && timeWindows.value.some((tw) => tw.start || tw.end)) {
      timeConfigs.push(...timeWindows.value.filter((tw) => tw.start || tw.end))
    }

    if (exactTime.value && exactTimeValue.value) {
      timeConfigs.push({exactTime: exactTimeValue.value})
    }

    return Object.fromEntries(selectedDays.map((day) => [day, [...timeConfigs]]))
  }

  return {
    specifyTimeWindows,
    timeWindows,
    exactTime,
    exactTimeValue,
    initializeFromConfig,
    reset,
    toggleTimeWindows,
    updateTimeWindow,
    addTimeWindow,
    removeTimeWindow,
    toggleExactTime,
    updateExactTime,
    getDaysConfig,
  }
}

<template>
  <div class="flex flex-col gap-3">
    <div v-for="day in selectedDays" :key="day" class="space-y-3 border rounded-lg p-4">
      <div class="mb-2">
        <span class="font-medium text-lg">{{ day.charAt(0).toUpperCase() + day.slice(1) }}</span>
      </div>

      <div class="space-y-3">
        <RadioGroup
          :model-value="getDayOption(day)"
          class="flex space-x-4"
          @update:model-value="(value) => handleValueChange(day, value)"
        >
          <div v-for="option in options" :key="option" class="flex items-center space-x-2">
            <RadioGroupItem :id="`${day}-${option}`" :value="option"/>
            <label
              :for="`${day}-${option}`"
              class="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {{ formatOptionLabel(option) }}
            </label>
          </div>
        </RadioGroup>

        <div v-if="getDayOption(day) === 'time_windows'" class="space-y-2">
          <label class="text-sm font-medium">Time Windows</label>
          <TimeWindowsManager
            :enabled="true"
            :model-value="getDayTimeWindows(day)"
            :on-add-time-window="() => onAddTimeWindow(day)"
            :on-remove-time-window="(index) => onRemoveTimeWindow(day, index)"
            :on-toggle-enabled="() => {}"
            :on-update-time-window="
              (index, field, value) => onUpdateTimeWindow(day, index, field, value)
            "
          />
        </div>

        <div v-if="getDayOption(day) === 'exact_time'" class="space-y-2">
          <label class="text-sm font-medium">Exact Time</label>
          <ExactTimeManager
            :enabled="true"
            :model-value="getDayExactTime(day)"
            :on-toggle-enabled="() => {}"
            :on-update-value="(value) => onUpdateExactTime(day, value)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TimeWindowsManager from './TimeWindowsManager.vue'
import ExactTimeManager from './ExactTimeManager.vue'
import {type DayOfWeek, type TimeConfig, type TimeWindow} from '../types'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {ref} from 'vue'

const options = ['exact_time', 'time_windows'] as const

const dayOptions = ref<Record<DayOfWeek, string>>({} as Record<DayOfWeek, string>)

const getDayOption = (day: DayOfWeek): string => {
  return dayOptions.value[day] || 'exact_time'
}

const formatOptionLabel = (option: string): string => {
  return option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')
}

const handleValueChange = (day: DayOfWeek, value: string) => {
  dayOptions.value[day] = value
  console.log(`Day ${day} selected option: ${value}`)
}

interface Props {
  selectedDays: DayOfWeek[]
  enabledDays: DayOfWeek[]
  dayConfigs: Record<DayOfWeek, TimeConfig[]>
  onToggleDay: (day: DayOfWeek) => void
  onUpdateTimeWindow: (day: DayOfWeek, index: number, field: 'start' | 'end', value: string) => void
  onAddTimeWindow: (day: DayOfWeek) => void
  onRemoveTimeWindow: (day: DayOfWeek, index: number) => void
  onUpdateExactTime: (day: DayOfWeek, value: string) => void
  getDayTimeWindows: (day: DayOfWeek) => TimeWindow[]
  getDayExactTime: (day: DayOfWeek) => string
}

defineProps<Props>()
</script>

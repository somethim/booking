<template>
  <div>
    <label class="block font-medium leading-none pb-2">Select Custom Days</label>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pt-2">
      <div v-for="day in DAY_OF_WEEK_OPTIONS" :key="day" class="flex items-center space-x-2 py-0.5">
        <Checkbox
          :id="day.toLowerCase()"
          :checked="modelValue.includes(day)"
          class="peer"
          @click="() => onToggleDay(day)"
        />
        <label
          :for="day.toLowerCase()"
          class="pl-1 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {{ day.charAt(0).toUpperCase() + day.slice(1) }}
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Checkbox} from '@/components/ui/checkbox'
import {DAY_OF_WEEK_OPTIONS, type DayOfWeek} from './types.ts'

interface Props {
  modelValue: DayOfWeek[]
  onToggleDay: (day: DayOfWeek) => void
}

defineProps<Props>()
</script>

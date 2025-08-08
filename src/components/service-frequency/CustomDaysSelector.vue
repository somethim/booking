<template>
  <div>
    <label class="block font-medium leading-none mb-2">Select Custom Days</label>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-4">
      <div v-for="day in DAY_OF_WEEK_OPTIONS" :key="day" class="flex items-center space-x-2">
        <Checkbox
          :id="day.toLowerCase()"
          :checked="modelValue.includes(day)"
          class="peer"
          @click="() => toggleDay(day)"
        />
        <label
          :for="day.toLowerCase()"
          class="pl-1 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {{ day }}
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
}

interface Emits {
  'update:modelValue': [value: DayOfWeek[]]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const toggleDay = (day: DayOfWeek): void => {
  const currentDays = [...props.modelValue]
  const index = currentDays.indexOf(day)

  if (index > -1) {
    currentDays.splice(index, 1)
  } else {
    currentDays.push(day)
  }

  emit('update:modelValue', currentDays)
}
</script>

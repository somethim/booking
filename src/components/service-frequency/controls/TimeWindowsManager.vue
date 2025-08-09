<template>
  <div class="space-y-3 ml-6">
    <div
      v-for="(window, index) in modelValue"
      :key="index"
      class="flex items-center gap-2 flex-wrap pt-2 pb-4"
    >
      <div class="flex items-center gap-2 pb-2">
        <label :for="'start-' + index" class="text-sm text-gray-600">From:</label>
        <Input
          :id="'start-' + index"
          :model-value="window.start"
          class="w-32"
          type="time"
          @update:model-value="
            (value: string | number) => onUpdateTimeWindow(index, 'start', String(value))
          "
        />
      </div>
      <div class="flex items-center gap-2">
        <label :for="'end-' + index" class="text-sm text-gray-600">To:</label>
        <Input
          :id="'end-' + index"
          :class="{
            'border-red-500 focus:border-red-500': isInvalidTimeWindow(window),
          }"
          :min="window.start || '00:00'"
          :model-value="window.end"
          class="w-32"
          type="time"
          @update:model-value="
            (value: string | number) => onUpdateTimeWindow(index, 'end', String(value))
          "
        />
      </div>
      <div v-if="isInvalidTimeWindow(window)" class="text-red-500 text-xs w-full">
        End time must be at least 30 minutes after start time
      </div>
      <Button
        v-if="modelValue.length > 1"
        class="text-red-600 hover:text-red-800 hover:bg-red-50"
        size="sm"
        variant="outline"
        @click="onRemoveTimeWindow(index)"
      >
        Remove
      </Button>
    </div>
    <Button
      class="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
      size="sm"
      variant="outline"
      @click="onAddTimeWindow"
    >
      Add Time Window
    </Button>
  </div>
</template>

<script lang="ts" setup>
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import type {TimeWindow} from '../types.ts'

interface Props {
  modelValue: TimeWindow[]
  enabled: boolean
  onToggleEnabled: (enabled: boolean) => void
  onUpdateTimeWindow: (index: number, field: keyof TimeWindow, value: string) => void
  onAddTimeWindow: () => void
  onRemoveTimeWindow: (index: number) => void
}

defineProps<Props>()

const timeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * 60 + minutes
}

const isInvalidTimeWindow = (window: TimeWindow): boolean => {
  if (!window.start || !window.end) return false

  const startMinutes = timeToMinutes(window.start)
  const endMinutes = timeToMinutes(window.end)

  return endMinutes < startMinutes + 30
}
</script>

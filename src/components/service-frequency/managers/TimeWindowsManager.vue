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
          :model-value="window.end"
          class="w-32"
          type="time"
          @update:model-value="
            (value: string | number) => onUpdateTimeWindow(index, 'end', String(value))
          "
        />
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
</script>

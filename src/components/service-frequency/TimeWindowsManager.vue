<template>
  <div>
    <div class="flex items-center space-x-2 mb-3">
      <Checkbox
        id="specifyTimeWindows"
        :checked="!enabled"
        @click="() => $emit('update:enabled', !enabled)"
      />
      <label
        class="pl-1 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        for="specifyTimeWindows"
      >
        Specify time window(s)
      </label>
    </div>

    <div v-if="enabled" class="space-y-3 ml-6">
      <div
        v-for="(window, index) in modelValue"
        :key="index"
        class="flex items-center gap-3 flex-wrap py-2"
      >
        <div class="flex items-center gap-2">
          <label :for="'start-' + index" class="text-sm text-gray-600">From:</label>
          <Input
            :id="'start-' + index"
            :model-value="window.start"
            class="w-32"
            type="time"
            @update:model-value="
              (value: string | number) => updateTimeWindow(index, 'start', String(value))
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
              (value: string | number) => updateTimeWindow(index, 'end', String(value))
            "
          />
        </div>
        <Button
          v-if="modelValue.length > 1"
          class="text-red-600 hover:text-red-800 hover:bg-red-50"
          size="sm"
          variant="outline"
          @click="removeTimeWindow(index)"
        >
          Remove
        </Button>
      </div>
      <Button
        class="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
        size="sm"
        variant="outline"
        @click="addTimeWindow"
      >
        Add Time Window
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Checkbox} from '@/components/ui/checkbox'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import type {TimeWindow} from './types.ts'

interface Props {
  modelValue: TimeWindow[]
  enabled: boolean
}

interface Emits {
  'update:modelValue': [value: TimeWindow[]]
  'update:enabled': [value: boolean]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const updateTimeWindow = (index: number, field: keyof TimeWindow, value: string): void => {
  const updatedWindows = [...props.modelValue]
  updatedWindows[index] = {
    ...updatedWindows[index],
    [field]: value,
  }
  emit('update:modelValue', updatedWindows)
}

const addTimeWindow = (): void => {
  const updatedWindows = [...props.modelValue, {start: '', end: ''}]
  emit('update:modelValue', updatedWindows)
}

const removeTimeWindow = (index: number): void => {
  if (props.modelValue.length > 1) {
    const updatedWindows = [...props.modelValue]
    updatedWindows.splice(index, 1)
    emit('update:modelValue', updatedWindows)
  }
}
</script>

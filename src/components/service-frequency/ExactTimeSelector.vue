<template>
  <div>
    <div class="flex items-center space-x-2 mb-3">
      <Checkbox
        id="exactTime"
        :checked="enabled"
        @click="() => $emit('update:enabled', !enabled)"
      />
      <label
        class="pl-1 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        for="exactTime"
      >
        Set exact time
      </label>
    </div>

    <div v-if="enabled" class="pt-2">
      <Input
        :model-value="modelValue"
        class="w-32"
        placeholder="13:30"
        type="time"
        @update:model-value="(value: string | number) => $emit('update:modelValue', String(value))"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Checkbox} from '@/components/ui/checkbox'
import {Input} from '@/components/ui/input'

interface Props {
  modelValue: string
  enabled: boolean
}

interface Emits {
  'update:modelValue': [value: string]
  'update:enabled': [value: boolean]
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <div class="pt-2 space-y-2">
    <Input
      :model-value="modelValue"
      class="w-32"
      type="time"
      @update:model-value="(value: string | number) => onUpdateValue(String(value))"
    />
  </div>
</template>

<script lang="ts" setup>
import {Input} from '@/components/ui/input'

interface Props {
  modelValue: string
  enabled: boolean
  onToggleEnabled: (enabled: boolean) => void
  onUpdateValue: (value: string) => void
}

defineProps<Props>()
</script>

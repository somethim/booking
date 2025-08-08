<template>
  <div class="space-y-2 pt-4 pb-3">
    <label class="text-sm font-medium leading-none mb-2">Configuration Type</label>
    <Select :model-value="modelValue" @update:model-value="handleValueChange">
      <SelectTrigger class="w-full">
        <SelectValue placeholder="Select configuration type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="type in SERVICE_CONFIG_TYPE" :key="type" :value="type">
          {{ formatter(type) }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

<script lang="ts" setup>
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  SERVICE_CONFIG_TYPE,
  type ServiceConfigType,
} from '@/components/service-frequency/types.ts'

defineProps<{
  modelValue: ServiceConfigType
}>()
const emit = defineEmits<{
  'update:modelValue': [value: ServiceConfigType]
}>()

const handleValueChange = (value: unknown) => {
  if (value) {
    emit('update:modelValue', String(value) as ServiceConfigType)
  }
}

const formatter = (value: string | null) => {
  if (!value) return ''

  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
</script>

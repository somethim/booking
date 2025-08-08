<template>
  <div class="space-y-2">
    <RadioGroup :model-value="modelValue" @update:model-value="handleValueChange">
      <div
        v-for="option in SERVICE_FREQUENCY_OPTIONS"
        :key="option"
        class="flex items-center space-x-2 py-0.5"
      >
        <RadioGroupItem :id="option" :value="option"/>
        <label
          :for="option"
          class="pl-1 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {{ formatValue(option) }}
        </label>
      </div>
    </RadioGroup>
  </div>
</template>

<script lang="ts" setup>
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {type FrequencyType, SERVICE_FREQUENCY_OPTIONS} from './types.ts'

interface Props {
  modelValue: FrequencyType
}

interface Emits {
  'update:modelValue': [value: FrequencyType]
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleValueChange = (value: string | number) => {
  emit('update:modelValue', String(value) as FrequencyType)
}

const formatValue = (value: FrequencyType) => {
  if (value === 'custom') {
    return 'Custom'
  }
  if (value === 'fortnightly') {
    return 'Fortnightly (every 2 weeks)'
  }
  if (value === 'every_4_weeks') {
    return 'Every 4 weeks'
  }
  if (value === 'never') {
    return 'None'
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}
</script>

<template>
  <div class="w-[60vw] h-[60vh] flex gap-6">
    <!-- Main Configuration Card -->
    <Card class="border border-gray-200 shadow-sm flex-1 overflow-y-auto">
      <CardHeader>
        <CardTitle class="text-xl">Service Frequency</CardTitle>
        <CardDescription class="text-sm">Select how often to service the toilet</CardDescription>
      </CardHeader>

      <CardContent>
        <FrequencySelector
          :model-value="frequency"
          @update:model-value="handleFrequencyChange"
        />

        <div v-if="showCustomSection" class="pt-8 space-y-6">
          <CustomDaysSelector
            :model-value="customDays"
            @update:model-value="customDays = $event"
          />

          <TimeWindowsManager
            :enabled="specifyTimeWindows"
            :model-value="timeWindows"
            class="pt-6"
            @update:model-value="timeWindows = $event"
            @update:enabled="specifyTimeWindows = $event"
          />

          <ExactTimeSelector
            :enabled="exactTime"
            :model-value="exactTimeValue"
            class="pt-6"
            @update:model-value="exactTimeValue = $event"
            @update:enabled="exactTime = $event"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Config Output Card -->
    <Card class="border border-gray-200 shadow-sm w-1/2 overflow-y-auto">
      <CardHeader class="pb-4">
        <CardTitle class="text-xl">Configuration Output</CardTitle>
        <CardDescription class="text-sm">Generated configuration JSON</CardDescription>
      </CardHeader>
      <CardContent>
        <ConfigOutput :config="jsonConfig"/>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watchEffect} from 'vue'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import FrequencySelector from './FrequencySelector.vue'
import CustomDaysSelector from './CustomDaysSelector.vue'
import TimeWindowsManager from './TimeWindowsManager.vue'
import ExactTimeSelector from './ExactTimeSelector.vue'
import ConfigOutput from './ConfigOutput.vue'
import {
  type DayOfWeek,
  type FrequencyType,
  SERVICE_FREQUENCY_OPTIONS,
  type ServiceFrequencyConfig,
  type TimeWindow,
} from './types.ts'

interface Props {
  scheduleConfig?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  scheduleConfig: null,
})

const frequency = ref<FrequencyType>('custom')
const customDays = ref<DayOfWeek[]>([])
const specifyTimeWindows = ref<boolean>(false)
const timeWindows = ref<TimeWindow[]>([{start: '', end: ''}])
const exactTime = ref<boolean>(false)
const exactTimeValue = ref<string>('')

watchEffect(() => {
  if (props.scheduleConfig) {
    const parsedConfig: ServiceFrequencyConfig = JSON.parse(props.scheduleConfig)

    if (parsedConfig.frequency && SERVICE_FREQUENCY_OPTIONS.includes(parsedConfig.frequency)) {
      frequency.value = parsedConfig.frequency
    }

    if (parsedConfig.frequency === 'custom' && parsedConfig.customDays) {
      customDays.value = parsedConfig.customDays
    }

    if (
      parsedConfig.frequency === 'custom' &&
      parsedConfig.timeWindows &&
      parsedConfig.timeWindows.length > 0
    ) {
      specifyTimeWindows.value = true
      timeWindows.value = parsedConfig.timeWindows
    }

    if (parsedConfig.frequency === 'custom' && parsedConfig.exactTime) {
      exactTime.value = true
      exactTimeValue.value = parsedConfig.exactTime
    }
  }
})

const showCustomSection = computed(() => frequency.value === 'custom')

const handleFrequencyChange = (newFrequency: FrequencyType): void => {
  frequency.value = newFrequency

  if (newFrequency !== 'custom') {
    customDays.value = []
    specifyTimeWindows.value = false
    exactTime.value = false
    exactTimeValue.value = ''
    timeWindows.value = [{start: '', end: ''}]
  }
}

const jsonConfig = computed<ServiceFrequencyConfig>(() => {
  const config: ServiceFrequencyConfig = {
    frequency: frequency.value,
  }

  if (frequency.value === 'custom') {
    config.customDays = customDays.value

    if (specifyTimeWindows.value && timeWindows.value.some((tw) => tw.start || tw.end)) {
      config.timeWindows = timeWindows.value.filter((tw) => tw.start || tw.end)
    }

    if (exactTime.value && exactTimeValue.value) {
      config.exactTime = exactTimeValue.value
    }
  }

  return config
})
</script>

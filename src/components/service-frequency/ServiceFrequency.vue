<template>
  <div class="w-[70vw] flex gap-4">
    <Card class="border border-gray-200 shadow-sm flex-1 overflow-y-auto">
      <CardHeader>
        <CardTitle class="text-xl">Service Frequency</CardTitle>
        <CardDescription class="text-sm">Select how often to service the toilet</CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <FrequencySelector :model-value="frequency" @update:model-value="handleFrequencyChange"/>

        <div v-if="showCustomSection" class="pt-8 space-y-4">
          <CustomDaysSelector :model-value="selectedDays" :on-toggle-day="handleToggleDay"/>

          <div v-if="selectedDays.length > 0" class="pt-2">
            <ConfigurationTypeSelector
              :model-value="configType"
              @update:model-value="handleConfigTypeChange"
            />
          </div>

          <div v-if="configType === 'exact_time' && selectedDays.length > 0" class="pt-2">
            <ExactTimeManager
              :enabled="globalConfig.exactTime.value"
              :model-value="globalConfig.exactTimeValue.value"
              :on-toggle-enabled="globalConfig.toggleExactTime"
              :on-update-value="globalConfig.updateExactTime"
            />
          </div>

          <div v-if="configType === 'time_windows' && selectedDays.length > 0" class="pt-2">
            <TimeWindowsManager
              :enabled="globalConfig.specifyTimeWindows.value"
              :model-value="globalConfig.timeWindows.value"
              :on-add-time-window="globalConfig.addTimeWindow"
              :on-remove-time-window="globalConfig.removeTimeWindow"
              :on-toggle-enabled="globalConfig.toggleTimeWindows"
              :on-update-time-window="globalConfig.updateTimeWindow"
            />
          </div>

          <div v-if="configType === 'individual' && selectedDays.length > 0" class="pt-2">
            <IndividualDayManager
              :day-configs="individualDayConfig.getDayConfigs()"
              :enabled-days="individualDayConfig.individualDays.value"
              :get-day-exact-time="individualDayConfig.getDayExactTime"
              :get-day-time-windows="individualDayConfig.getDayTimeWindows"
              :on-add-time-window="individualDayConfig.addDayTimeWindow"
              :on-remove-time-window="individualDayConfig.removeDayTimeWindow"
              :on-toggle-day="individualDayConfig.toggleIndividualDay"
              :on-update-exact-time="individualDayConfig.updateDayExactTime"
              :on-update-time-window="individualDayConfig.updateDayTimeWindow"
              :selected-days="selectedDays"
            />
          </div>
        </div>
      </CardContent>

      <div class="flex justify-start p-4">
        <Button
          @click="
            toast('Config saved', { description: 'Configuration has been saved successfully' })
          "
        >
          Save Configuration
        </Button>
      </div>
    </Card>

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
import ConfigurationTypeSelector from './ConfigurationTypeSelector.vue'
import IndividualDayManager from './managers/IndividualDayManager.vue'
import TimeWindowsManager from './managers/TimeWindowsManager.vue'
import ExactTimeManager from './managers/ExactTimeManager.vue'
import ConfigOutput from './ConfigOutput.vue'
import {useIndividualDayConfig} from './composables/useIndividualDayConfig'
import {useGlobalConfig} from './composables/useGlobalConfig'
import {
  type DayOfWeek,
  type FrequencyType,
  SERVICE_FREQUENCY_OPTIONS,
  type ServiceConfigType,
  type ServiceFrequencyConfig,
} from './types.ts'
import {Button} from '@/components/ui/button'
import {toast} from 'vue-sonner'

interface Props {
  scheduleConfig?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  scheduleConfig: null,
})

const frequency = ref<FrequencyType>('fortnightly')
const selectedDays = ref<DayOfWeek[]>([])
const configType = ref<ServiceConfigType>('exact_time')

const individualDayConfig = useIndividualDayConfig()
const globalConfig = useGlobalConfig()

watchEffect(() => {
  if (!props.scheduleConfig) return

  const parsedConfig = JSON.parse(props.scheduleConfig) as ServiceFrequencyConfig

  if (!parsedConfig.frequency || !SERVICE_FREQUENCY_OPTIONS.includes(parsedConfig.frequency)) return

  frequency.value = parsedConfig.frequency

  if (parsedConfig.frequency !== 'custom' || !parsedConfig.days) return

  selectedDays.value = Object.keys(parsedConfig.days) as DayOfWeek[]

  const hasIndividualConfigs = Object.values(parsedConfig.days).some((configs) =>
    configs.some((config) => 'start' in config || 'exactTime' in config),
  )
  if (hasIndividualConfigs) {
    configType.value = 'individual'
    individualDayConfig.initializeFromConfig(selectedDays.value, parsedConfig.days)
    return
  }

  const firstDay = Object.values(parsedConfig.days)[0]
  if (!firstDay || firstDay.length === 0) return

  const hasTimeWindows = firstDay.some((config) => 'start' in config && 'end' in config)
  if (hasTimeWindows) {
    configType.value = 'time_windows'
    globalConfig.initializeFromConfig(parsedConfig.days)
    return
  }

  const hasExactTime = firstDay.some((config) => 'exactTime' in config)
  if (hasExactTime) {
    configType.value = 'exact_time'
    globalConfig.initializeFromConfig(parsedConfig.days)
  }
})

const showCustomSection = computed(() => frequency.value === 'custom')

const handleFrequencyChange = (newFrequency: FrequencyType): void => {
  frequency.value = newFrequency

  if (newFrequency !== 'custom') {
    selectedDays.value = []
    configType.value = 'exact_time'
    individualDayConfig.reset()
    globalConfig.reset()
  }
}

const handleConfigTypeChange = (newType: ServiceConfigType): void => {
  configType.value = newType

  if (newType === 'individual') {
    globalConfig.reset()
    selectedDays.value.forEach((day) => {
      individualDayConfig.toggleIndividualDay(day)
    })
  }

  if (newType === 'exact_time') {
    globalConfig.reset()
    individualDayConfig.reset()
    globalConfig.toggleExactTime(true)
  }

  if (newType === 'time_windows') {
    globalConfig.reset()
    individualDayConfig.reset()
    globalConfig.toggleTimeWindows(true)
  }
}

const handleToggleDay = (day: DayOfWeek): void => {
  if (selectedDays.value.includes(day)) {
    selectedDays.value = selectedDays.value.filter((d) => d !== day)
    individualDayConfig.removeDay(day)
  } else {
    selectedDays.value.push(day)

    if (configType.value === 'individual') {
      individualDayConfig.toggleIndividualDay(day)
    }
  }
}

const jsonConfig = computed<ServiceFrequencyConfig>(() => {
  if (frequency.value !== 'custom' || selectedDays.value.length === 0) {
    return {frequency: frequency.value}
  }

  if (configType.value === 'individual') {
    return {
      frequency: frequency.value,
      days: individualDayConfig.getDayConfigs(),
    }
  }

  return {
    frequency: frequency.value,
    days: globalConfig.getDaysConfig(selectedDays.value),
  }
})
</script>

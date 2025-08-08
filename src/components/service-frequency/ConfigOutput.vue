<template>
  <div class="w-full">
    <h3 class="font-medium text-gray-900 mb-3">Configuration Output</h3>
    <pre
      class="bg-white border border-gray-200 rounded-md p-4 text-sm text-gray-800 overflow-auto max-h-64"
    >{{ formattedConfig }}</pre
    >
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import type {ServiceFrequencyConfig} from './types.ts'

interface Props {
  config: ServiceFrequencyConfig
}

const props = defineProps<Props>()

const formattedConfig = computed(() => {
  return JSON.stringify(props.config, null, 2)
})
</script>

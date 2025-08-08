<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-medium text-gray-900">Configuration Output</h3>
      <Button :disabled="isCopied" size="sm" variant="outline" @click="copyToClipboard">
        {{ isCopied ? 'Copied!' : 'Copy JSON' }}
      </Button>
    </div>
    <pre
      class="bg-white border border-gray-200 rounded-md p-3 text-sm text-gray-800 overflow-auto"
    >{{ formattedConfig }}</pre
    >
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import {Button} from '@/components/ui/button'
import type {ServiceFrequencyConfig} from './types.ts'

interface Props {
  config: ServiceFrequencyConfig
}

const props = defineProps<Props>()
const isCopied = ref(false)

const formattedConfig = computed(() => {
  return JSON.stringify(props.config, null, 2)
})

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(formattedConfig.value)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}
</script>

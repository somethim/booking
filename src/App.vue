<script lang="ts">
import {defineComponent} from 'vue'
import ServiceFrequency from '@/components/service-frequency/ServiceFrequency.vue'
import 'vue-sonner/style.css'
import {Toaster} from "@/components/ui/sonner";

export default defineComponent({
  components: {Toaster, ServiceFrequency},
})
</script>

<template>
  <Toaster/>
  <ServiceFrequency/>
</template>

<style scoped>
header {
  line-height: 1.5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
}
</style>

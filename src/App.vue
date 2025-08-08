<script lang="ts">
import {defineComponent} from "vue";
import ServiceFrequency from "@/components/ServiceFrequency.vue";

export default defineComponent({
  components: {ServiceFrequency}
})
</script>

<template>
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

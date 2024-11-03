<template>
  <q-skeleton square :height="height" :width="width" />
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  height: { type: String, default: '150px' },
  width: { type: String }
})
</script>

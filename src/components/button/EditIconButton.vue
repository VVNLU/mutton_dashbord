<template>
  <base-icon-button icon="edit" :outline="outline" :label="label" :flat="flat" />
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  label: { type: String },
  outline: { type: Boolean, default: true },
  flat: { type: Boolean, default: true }
})
</script>

<template>
  <base-icon-button
    color="red"
    icon="delete"
    :outline="outline"
    :label="label"
  />
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  label: { type: String },
  outline: { type: Boolean, default: true }
})
</script>

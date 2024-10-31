<template>
  <base-icon-button icon="edit" :outline="outline" :label="label" />
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  label: { type: String },
  outline: { type: Boolean, default: false }
})
</script>

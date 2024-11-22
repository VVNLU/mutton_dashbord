<template>
  <base-button :label="label" icon="add" />
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  label: { type: String }
})
</script>

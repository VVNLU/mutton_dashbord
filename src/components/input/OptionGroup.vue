<template>
  <div class="rounded-borders py-10px">
    <label v-if="label" class="text-bold text-18px">{{ label }}</label>
    <q-option-group v-model="observeValue" :options="options" :color="color" :inline="inline" :type="type"
      :disable="disable" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue: { type: [String, Number, null, Object, Boolean] },
  options: { type: Array, default() { return [] } },
  label: { type: String },
  inline: { type: Boolean, default: true },
  color: { type: String, default: 'primary' },
  type: { type: String },
  disable: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const observeValue = useVModel(props, 'modelValue', emit)
</script>

<style lang="scss" scoped></style>

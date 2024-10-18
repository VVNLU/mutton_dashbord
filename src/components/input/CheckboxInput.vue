<template>
  <q-field v-model="observeValue" :rules="rules" borderless dense>
    <template #control>
      <q-checkbox v-model="observeValue" :label="label">
        <template v-if="$slots.default" #default>
          <slot name="default" />
        </template>
      </q-checkbox>
    </template>
  </q-field>
</template>

<script setup>
import { useVModel } from '@vueuse/core';
import { defineProps } from 'vue'

const props = defineProps({
  modelValue: { type: [Boolean, Array], default: false },
  rules: { type: Array },
  label: { type: String }
})
const emit = defineEmits(['update:modelValue'])

const observeValue = useVModel(props, 'modelValue', emit)
</script>
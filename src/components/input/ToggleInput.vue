<template>
    <q-toggle v-model="observeVale" :left-label="leftLabel" />
</template>

<script setup>
import { defineProps } from 'vue';
import { useVModel } from '@vueuse/core'

const props = defineProps({
    modelValue: { type: Boolean, default: true },
    leftLabel: :{ type: Boolean, default: true }
})
const emit = (['update:modelValue'])

const observeVale = useVModel(props, 'modelValue', emit)
</script>
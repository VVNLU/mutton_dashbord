<template>
    <text-input v-model="observeValue" :label="label" :placeholder="placeholder">
        <template v-slot:append>
            <q-icon name="search" />
        </template>
    </text-input>
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import { defineProps } from 'vue';

const props = defineProps({
    modelValue: { type: [String, Number, null] },
    label: { type: String, default: '關鍵字' },
    placeholder: { type: String, default: '請輸入關鍵字' }
})
const emit = defineEmits(['update:modelValue'])

const observeValue = useVModel(props, 'modelValue', emit)
</script>
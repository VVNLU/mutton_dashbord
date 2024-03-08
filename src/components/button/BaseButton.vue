<template>
    <div class="q-pa-md q-gutter-sm">
        <q-btn :color="color" :text-color="textColor" :label="label" />
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    label: { type: String },
    textColor: { type: String, default: 'white' },
    color: { type: String, default: 'primary' }
})
</script>
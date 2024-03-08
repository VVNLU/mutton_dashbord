<template>
    <div class="q-gutter-y-md">
        <q-btn :style="{ width: width }" :color="color" :text-color="textColor" :label="label" />
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    label: { type: String },
    textColor: { type: String, default: 'white' },
    color: { type: String, default: 'primary' },
    width: { type: String, default: '60px' }
})
</script>
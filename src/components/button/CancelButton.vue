<template>
    <base-button :label="label" :outline="outline" :rounded="rounded" :color="color" />
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
    label: { type: String },
    outline: { type: Boolean, default: false },
    rounded: { type: Boolean, default: false },
    color: { type: String, default: 'primary' },
})

</script>
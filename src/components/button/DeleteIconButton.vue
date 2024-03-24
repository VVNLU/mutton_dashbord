<template>
    <base-icon-button color="red" icon="delete" :outline="outline" :label="buttonLabel" />
</template>

<script setup>
import { defineProps, toRefs, computed } from 'vue';

const props = defineProps({
    label: { type: String },
    outline: { type: Boolean, default: true }
})

const { label } = toRefs(props)

const buttonLabel = computed(() => {
    return label.value
})
</script>
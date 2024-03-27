<template>
    <base-button :label="buttonLabel" icon="add_circle" :color="'orange-11'" />
</template>

<script setup>
import { defineProps, toRefs, computed } from 'vue';

const props = defineProps({
    label: { type: String }
})

const { label } = toRefs(props)

const buttonLabel = computed(() => {
    return label.value
})
</script>
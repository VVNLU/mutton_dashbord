<template>
    <base-button :label="label" icon="add_circle" :color="'orange-11'" />
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    label: { type: String }
})
</script>
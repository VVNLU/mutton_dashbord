<template>
    <base-button :label="label" icon="add_circle" :color="'orange-12'" />
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    label: { type: String }
})
</script>
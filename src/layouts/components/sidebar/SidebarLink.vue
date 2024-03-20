<template>
    <q-item v-ripple :to="to" clickable class="text-black">
        <q-item-section avatar>
            <q-icon :name="icon" size="1.8rem" />
        </q-item-section>
        <q-item-section>
            <q-item-label>{{ title }}</q-item-label>
        </q-item-section>
    </q-item>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    to: { type: String, required: true },
    icon: { type: String },
    title: { type: String, default: '' }
})
</script>
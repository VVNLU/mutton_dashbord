<template>
    <q-btn :outline="outline" :round="round" :flat="flat" :color="color" :icon="icon" :loading="isLoading" :size="size">
        <q-tooltip v-if="label">{{ label }}</q-tooltip>
        <template #loading>
            <q-spinner-hourglass size="0.75em" />
        </template>
    </q-btn>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import { useApp } from '@/stores/app'

const props = defineProps({
    label: { type: String },
    color: { type: String, default: 'primary' },
    icon: { type: String },
    outline: { type: Boolean, default: false },
    round: { type: Boolean, default: true },
    flat: { type: Boolean, default: false },
    size: { type: String, default: 'md' },
    useLoading: { type: Boolean, default: false }
})

const storeApp = useApp()
const isLoading = computed(() => {
    return props.useLoading && (storeApp.isCreate || storeApp.isUpdate || storeApp.isDelete)
})
</script>
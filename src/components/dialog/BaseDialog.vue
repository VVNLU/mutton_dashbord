<template>
    <q-dialog v-model="observeValue" :persistent="persistent" @show="onShow" @hide="onHide">
        <q-card :class="sizeClass">
            <q-card-section class="bg-orange-11 text-white row items-center dialog-header">
                <slot name="title">
                    <div class="text-h6">{{ title }}</div>
                </slot>
                <q-space />
                <q-btn v-close-popup icon="far fa-times-circle" flat round dense @click="onCancel" />
            </q-card-section>
            <q-separator />
            <q-card-section class="scroll q-dialog-body">
                <slot />
            </q-card-section>
            <q-separator />
            <q-card-actions class="q-dialog-footer" align="right">
                <slot name="footer" class="text-primary">
                    <confirm-button v-if="showSave" padding="sm 2.5em" class="q-mr-sm text-black"
                        :color="confirmButtonColor" :label="confirmButtonText" @click="onSave" />
                    <cancel-button v-if="showCancel" v-close-popup class="text-black" padding="sm 2.5em"
                        :color="cancelButtonColor" :label="cancelButtonText" @click="onCancel" />
                </slot>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { useVModel } from '@vueuse/core';
import { computed, defineProps } from 'vue';

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: '標題' },
    cancelButtonText: { type: String },
    cancelButtonColor: { type: String, default: 'white' },
    confirmButtonText: { type: String },
    confirmButtonColor: { type: String, default: 'orange-11' },
    persistent: { type: Boolean, default: false },
    size: { type: String },
    showCancel: { type: Boolean, default: true },
    showSave: { type: Boolean, default: true }
})
const emit = defineEmits(['update:modelValue', 'save', 'cancel', 'show', 'hide'])

const observeValue = useVModel(props, 'modelValue', emit)

const sizeClass = computed(() => {
    switch (props.size) {
        case 'small':
            return 'w-25rem'
        case 'medium':
            return 'w-30rem'
        default:
            return 'w-full'
    }
})

const onSave = () => {
    emit('save')
}
const onCancel = () => {
    emit('cancel')
}
const onShow = () => {
    emit('show')
}
const onHide = () => {
    emit('hide')
}
</script>

<style lang="scss" scoped>
.q-card {
    .q-dialog-body {
        @apply max-h-40em;
    }
}
</style>
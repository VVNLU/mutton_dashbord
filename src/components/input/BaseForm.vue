<template>
    <q-form ref="form" @submit="onSubmit" @reset="onReset">
        <template v-if="$slots.default" #default>
            <slot name="default" />
        </template>
    </q-form>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['submit', 'reset'])
const form = ref()

const validate = () => {
    return form.value.validate()
}
const resetValidation = () => {
    return form.value.resetValidation()
}
const submit = (evt = null) => {
    return form.value.submit(evt)
}
const reset = (evt = null) => {
    return form.value.reset(evt)
}
const getValidationComponents = () => {
    return form.value.getValidationComponents()
}
const onSubmit = () => {
    emit('submit')
}
const onReset = () => {
    emit('reset')
}
</script>
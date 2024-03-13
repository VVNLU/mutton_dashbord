<template>
    <text-input :label="'密碼'" :placeholder="'請輸入密碼'" v-model="observeValue" :maxLength="15"
        :type="isPwd ? 'password' : 'text'">
        <template #append>
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-point" @click="isPwd = !isPwd" />
        </template>
    </text-input>
</template>

<script setup>
import { ref } from 'vue'
import { useVModel } from '@vueuse/core';

const props = defineProps({
    modelValue: { type: [String, Number] }
})
const emit = defineEmits(['update:modelValue'])

const observeValue = useVModel(props, 'modelValue', emit)
const isPwd = ref(true)

</script>
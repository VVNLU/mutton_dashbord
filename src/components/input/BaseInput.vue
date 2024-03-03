<template>
    <div class="q-pa-md">
        <div class="q-gutter-y-md column" style="max-width: 300px">
            <q-input outlined :label="label" :placeholder="placeholder" :type="type">
                <template v-slot:append />
            </q-input>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    label: { type: String },
    placeholder: { type: String, default: '請輸入' },
    type: { type: String, default: 'text' }
})
</script>
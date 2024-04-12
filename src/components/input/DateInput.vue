<template>
    <text-input ref="inputData" v-model="observeValue" :label="label" :placeholder="placeholder" :rules="ruleList"
        inputmode="none">
        <template #append>
            <q-icon name="event" />
        </template>
        <template v-if="$slots.hint" #hint>
            <slot name="hint" />
        </template>
        <template #default>
            <q-popup-proxy v-model="show" class="flex justify-center" transition-show="scale" transition-hide="scale">
                <q-date v-model="observeValue" :title="dateTitle" :subtitle="dateSubtitle" :options="observeOptions"
                    @update:model="updateModelValue">
                    <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                </q-date>
            </q-popup-proxy>
        </template>
    </text-input>
</template>

<script setup>
import { useVModel } from '@vueuse/core';
import { computed, defineProps, ref, toRefs } from 'vue';
import { vuelidate } from '@/plugins/vuelidate'

const props = defineProps({
    modelValue: { type: String },
    label: { type: String },
    placeholder: { type: String, default: '年/月/日' },
    options: { type: Array },
    min: { type: String },
    max: { type: String },
    rules: { type: Array, default() { return [] } }
})
const emit = defineEmits(['update:modelValue'])

const inputData = ref()
const show = ref(false)
const { min, max, options, rules } = toRefs(props)
const observeValue = useVModel(props, 'update:modelValue', emit)

const dateTitle = computed(() => {
    return !observeValue ? ' ' : ''
})

const dateSubtitle = computed(() => {
    return !observeValue ? ' ' : ''
})

const observeOptions = computed(() => {
    const _options = options.value
    const dateFn = (date) => {
        const _min = min.value
        const _max = max.value
        if (!_min && _max) return true
        if (_min && _max) return date >= _min && date <= _max
        if (_min) return date >= _min
        if (_max) return date <= _max
    }
    if (_options && _options.length > 0) return _options
    return dateFn
})

const ruleList = computed(() => {
    const rule = []
    min.value && rule.push(vuelidate.dayjIssameOrAfter(min.value, `必須比${min.value}晚`))
    max.value && rule.push(vuelidate.dayjIssameOrBefore(max.value, `必須比${min.value}早`))
    return rule.concat(rules.value)
})

const showPop = (isShow) => {
    setTimeout(() => {
        show.value = isShow
    }, 200)
}

const updateModelValue = (value, reason, details) => {
    if (value) showPop(false)
}
</script>
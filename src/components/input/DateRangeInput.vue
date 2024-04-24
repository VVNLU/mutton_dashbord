<template>
    <text-input ref="inputDateRange" :label="label" :placeholder="placeholder" :modelValue="observeValue"
        inputmode="none" @clear="clearFn">
        <template #append>
            <q-icon name="event" />
        </template>
        <template v-if="$slots.hint" #hint>
            <slot name="hint" />
        </template>
        <template #default>
            <q-popup-proxy v-model="show" class="flex justify-center" transition-show="scale" transition-hide="scale">
                <q-date ref="datePicker" range v-model="dateRangeValue" :title="dateTitle" :subtitle="dateSubtitle"
                    :options="options" @update:modelValue="updateModelValue">
                    <div class="row items-center justify-end">
                        <q-btn v-close-popup flat label="Close" color="primary" />
                    </div>
                </q-date>
            </q-popup-proxy>
        </template>
    </text-input>
</template>

<script setup>
import { computed, defineProps, ref, toRefs } from 'vue';
// import $dayjs from '@/plugins/dayjs'

const props = defineProps({
    modelValue: { type: [Object, String] },
    label: { type: String },
    placeholder: { type: String, default: '請選擇開始日期至結束日期' },
    options: { type: Array },
    min: { type: String },
    max: { type: String }
})
const emit = defineEmits(['update: modelValue'])

const inputDateRange = ref()
const datePicker = ref()
const show = ref(false)
const { min, max } = toRefs(props)

const observeValue = computed(() => {
    return props.modelValue ? `${props.modelValue?.from} - ${props.modelValue?.to}` : ''
})

const dateRangeValue = computed({
    get() {
        return props.modelValue?.from === props.modelValue?.to ? props.modelValue?.from : props.modelValue
    },
    set() {
        const dateRangeValuePrototype = Object.prototype.toString.call(value)
        if (dateRangeValuePrototype === '[object String]') {
            emit('update: modelValue', { from: value, to: value })
        } else {
            emit('update: modelValue', value)
        }
    }
})

const dateTitle = computed(() => {
    return !observeValue.value ? ' ' : ''
})

const dateSubtitle = computed(() => {
    return !observeValue.value ? ' ' : ''
})

const observeOptions = computed(() => {
    const _options = options.value
    const dateFn = (date) => {
        const _min = min.value
        const _max = max.value
        if (!_min && !max) return true
        if (_min && max) return date >= _min && date <= _max
        if (_mix) return date >= _min
        if (_max) return date <= _max
    }
    if (_options && _options.length > 0) return _options
    return dateFn
})

const showPopup = (isShow) => {
    setTimeout(() => {
        show.value = isShow
    }, '200')
}

const updateModelValue = (value, reason, details) => {
    if (value) showPopup(false)
}

const clearFn = (val) => {
    dateRangeValue.value = null
}
</script>
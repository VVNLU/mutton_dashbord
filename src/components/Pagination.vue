<template>
    <div class="flex items-center justify-left">
        <span class="q-mr-sm">
            共項
        </span>
        <span>
            <select-input class="w-95px pagination-select" dense emit-value v-model="pageSize" option-label="label"
                option-value="value" :clearable="false" :options="pageSizeOptions"
                @update:modelValue="changePageSize" />
        </span>
        <q-pagination boundary-links v-model="observeCurrent" :max="maxSize" :max-page="4" :boundary-number="false"
            icon-first="keyboard_double_arrow_left" icon-last="keyboard_double_arrow_right"
            @update:modelValue="handleCurrentChange" />
        <div>
            <span>前往</span>
            <text-input class="w-55px pagination-input" dense v-model.lazy="toPage" :clearable="false"
                @change="changeToPage" @keyup.enter="changeToPage" />
            <span>頁</span>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, ref, watch } from 'vue';
import { useVModel } from '@vueuse/core'
import { scrollTo } from '@/utils/scroll-to'

const props = defineProps({
    current: { type: Number, default: 1 },
    limit: { type: Number, default: 10 },
    total: { type: Number, default: 0 },
    autoScroll: { type: Boolean, default: true },
    showPageSize: { type: Boolean, default: false }
})
const emit = defineEmits(['update:current', 'update:pageSize'])

const toPage = ref(props.current)
const pageSize = ref(props.limit)
const observeCurrent = useVModel(props, 'current', emit)
const pageSizeOptions = ref([
    { label: '10 / 頁', value: 10 },
    { label: '25 / 頁', value: 25 },
    { label: '50 / 頁', value: 50 },
])

const maxSize = computed(() => {
    const total = +props.total
    const limit = +props.limit
    return Math.ceil(+(total / limit))
})
const changeToPage = () => {
    toPage.value = +toPage.value
    const val = toPage.value
    const maxSizeVal = maxSize.value
    const r = /^\+?[1-9][0-9]*$/
    if (!r.test(val)) {
        toPage.value = 1
    } else if (r.test(val) && val >= maxSizeVal) {
        toPage.value = maxSizeVal
    }
    emit('update:current', toPage.value)
    if (props.autoScroll) {
        scrollTo(0, 800)
    }
}
const handleCurrentChange = (val) => {
    toPage.value = 1
    if (props.autoScroll) {
        scrollTo(0, 800)
    }
}
const changePageSize = () => {
    emit('update:pageSize', pageSize.value)
}

watch(() => props.current, (newValue) => {
    toPage.value = newValue
})
watch(() => props.limit, (newValue) => {
    pageSize.value = newValue
})
</script>
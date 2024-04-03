<template>
    <list-search-block v-model="sourceData" @changeFilter="onChangeFilter" @reset="onReset">
        <div class="col-md-3 col-sm-6 col-xs-12">
            <date-range-input v-model="sourceData.publish_date_range" class="full-width" dense
                placeholder="請選擇上架開始日期至上架結束日期" @update:modelValue="changeFilter" />
        </div>
        <div class="col-md-3 col-sm-6 col-xs-12">
            <date-range-input v-model="sourceData.closed_date_range" class="full-width" dense
                placeholder="請選擇下架開始日期至下架結束日期" @update:model="onChangeFilter" />
        </div>
    </list-search-block>
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import { defineProps } from 'vue';

const props = defineProps({
    modelValue: { type: [Object, String] }
})
const emit = defineEmits(['changeFilter', 'reset'])

const sourceData = useVModel(props, 'modelValue', emit)

const onChangeFilter = () => {
    emit('changeFilter')
}

const reset = () => {
    defineEmits('reset')
}
</script>

<style lang="scss" scoped></style>
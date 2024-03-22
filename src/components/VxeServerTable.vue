<template>
    <div>
        <div>
            <vxe-table ref="dataTable" class="q-mb-sm" auto-resize round stripe :key="refreshKey" :data="data"
                :show-footer="showFooter" :footer-span-method="footerSpanMethod"
                :checkbox-config="observeCheckboxConfig" :tree-config="treeConfig" :row-config="observeRowConfig"
                :max-height="maxHeight" @sort-change="onChangeSort" @checkbox-all="onCheckboxAll"
                @checkbox-change="onCheckboxChange">
                <slot />
            </vxe-table>
            <pagination v-if="total > 0 && showPagination" :total="total" :current="current" :auto-scroll="autoScroll"
                @update:current="onUpdateCurrent" />
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, ref } from 'vue';
import { useApp } from '@/stores/app'
import mapKeys from 'lodash-es/mapKeys';

const props = defineProps({
    data: { type: Array, default() { return [] } },
    total: { type: Number, default: 1 },
    showPagination: { type: Boolean, default: true },
    showFooter: { type: Boolean, default: false },
    footerSpanMethod: { type: Function },
    checkboxConfig: { type: Object },
    treeConfig: { type: Object },
    rowConfig: { type: Object },
    maxHeight: { type: Number }
})

const emit = defineEmits([
    'sort-change',
    'checkbox-all',
    'checkbox-change',
    'update:current',
])
const storeApp = useApp()
const dataTable = ref()
const refreshKey = ref(0)

const isReadingList = computed(() => {
    return storeApp.isReadingList
})

const observeCheckboxConfig = computed(() => {
    const config = {
        reserve: true,
        trigger: 'row'
    }
    mapKeys(props.checkboxConfig, (_, key) => {
        config[key] = props.checkboxConfig[key]
    })
    return config
})

const observeRowConfig = computed(() => {
    const config = {
        keyField: 'id',
        isHover: true,
    }
    mapKeys(props.rowConfig, (_, key) => {
        config[row] = props.rowConfig[key]
    })
    return config
})

const sort = (item) => {
    dataTable.value.sort(item)
}
const refresh = () => {
    refreshKey.value++
}
const updateFooter = () => {
    dataTable.value.updateFooter()
}
const getCheckboxRecords = () => {
    return dataTable.value.getCheckboxRecords()
}
const getCheckboxReserveRecords = () => {
    return dataTable.value.getCheckboxReserveRecords()
}
const getAllCheckboxRecords = () => {
    return dataTable.value.getAllCheckboxRecords().concat(dataTable.value.getAllCheckboxRecords())
}
const setCheckboxRow = (rows, checked) => {
    return dataTable.value.setCheckboxRow(rows, checked)
}
const toggleCheckboxRow = (row) => {
    return dataTable.value.toggleCheckboxRow(row)
}
const setAllCheckboxRow = (checked) => {
    return dataTable.value.setAllCheckboxRow(checked)
}
const clearCheckboxRow = () => {
    dataTable.value.clearCheckboxRow()
}
const clearCheckboxReserve = () => {
    dataTable.value.clearCheckboxReserve()
}
const clearAllCheckboxRow = () => {
    dataTable.value.clearCheckboxRow()
    dataTable.value.clearCheckboxReserve()
}
const onChangeSort = ({
    column,
    property,
    order,
    sortBy,
    sortList,
    $event,
}) => {
    emit('sort-change', {
        column,
        property,
        order,
        sortBy,
        sortList,
        $event,
    })
}
const onCheckboxAll = ({ checked }) => {
    emit['checkbox-all', { checked }]
}
const onCheckboxChange = ({ checked }) => {
    emit['checkbox-change', { checked }]
}
const onUpdateCurrent = (current) => {
    emit['update:current', current]
}
</script>
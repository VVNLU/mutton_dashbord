<template>
    <vxe-column :field="field" :title="title" :sortable="sortable" :width="width">
        <template #default="{ row }">
            <base-image :src="getValueByPath(row, field)" :use-authorization="useAuthorization" />
        </template>
    </vxe-column>
</template>

<script setup>
import { defineProps } from 'vue';
import { getValueByPath } from '@/utils'

const props = defineProps({
    field: { type: String },
    title: { type: String },
    sortable: { type: Boolean, default: false },
    width: { type: [Number, String], default: 200 },
    useAuthorization: { type: Boolean, default: false }
})
</script>
<template>
  <div class="flex items-center justify-left">
    <span class="q-ml-sm"> 共 {{ total }} 項 </span>
    <q-pagination boundary-links v-model="observeCurrent" :max="maxSize" @update:modelValue="handleCurrentChange" />
  </div>
</template>

<script setup>
import { computed, defineProps, ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  current: { type: Number, default: 1 },
  limit: { type: Number, default: 5 },
  total: { type: Number, default: 0 },
  rows: { type: Array, required: true },
  autoScroll: { type: Boolean, default: true },
})
const emit = defineEmits(['update:current', 'update:pageSize'])

const observeCurrent = useVModel(props, 'current', emit)
const pageSize = ref(props.limit)
const paginatedRows = ref([])

// 計算最大頁數
const maxSize = computed(() => Math.ceil(props.total / props.limit))

// 計算分頁後的資料
const computePaginatedRows = () => {
  const start = (observeCurrent.value - 1) * props.limit
  const end = start + props.limit
  paginatedRows.value = props.rows.slice(start, end)

  emit('update:paginatedRows', paginatedRows.value) // 傳遞分頁後的資料
}

// 監聽當前頁碼或資料變化時重新計算
watch([() => props.rows, () => observeCurrent.value], computePaginatedRows, { immediate: true })
watch([() => props.rows, () => observeCurrent.value], () => {
  computePaginatedRows()
}, { immediate: true })

const handleCurrentChange = (val) => {
  observeCurrent.value = val
}
</script>

<style lang="scss" scoped>
.pagination-input,
.pagination-select {
  @apply my-0 mx-3px;
  @apply inline-block;

  :deep(.q-field__inner) {
    @apply h-32px;

    .q-field__control {
      @apply h-32px min-h-0px;
    }
  }
}

:deep {
  .q-btn--flat.q-btn--rectangle {
    min-width: 2rem !important;
  }

  .q-btn--standard.q-btn--rectangle {
    min-width: 2rem !important;
  }
}
</style>

<template>
  <div>
    <q-table class="my-sticky-header-table" :rows="rows" :columns="columns" :filter="filter" row-key="name"
      :loading="loading" :pagination="initialPagination" flat bordered>
      <!-- 搜尋欄位 -->
      <template v-slot:top-left>
        <q-input dense debounce="300" v-model="filter" placeholder="搜尋">
          <template v-slot:append>
            <q-icon name="cancel" @click="onCancel" size="0.8em" />
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <!-- 沒有資料的提示 -->
      <template v-slot:no-data="{ filter }">
        <div class="full-width row flex-center text-indigo q-gutter-sm">
          <q-icon size="2em" :name="filter ? 'search_off' : 'sentiment_dissatisfied'" />
          <span>
            很抱歉，{{ filter ? '沒有符合搜尋條件的結果。' : '目前沒有任何資料可顯示。' }}
          </span>
        </div>
      </template>
      <!-- 插槽 -->
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th class="th-first" auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>
            <slot name="props" :row="props.row" />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <!-- 多行 -->
            <div v-if="col.isMultiline" v-html="props.row[col.name]"></div>
            <div v-else>
              {{ props.row[col.name] }}
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  rows: {
    type: Array,
    default() {
      return []
    }
  },
  columns: {
    type: Array,
    default() {
      return []
    }
  },
  loading: {
    type: Boolean
  }
})

const emit = defineEmits(['update:modelValue'])
const filter = ref('')

const initialPagination = {
  sortBy: 'desc',
  descending: false,
}

const onCancel = () => {
  filter.value = ''
}
</script>
<style lang="scss" scoped>
.my-sticky-header-table {

  td:first-child,
  .th-first {
    background-color: #fff !important;
    z-index: 1;
    position: sticky;
    left: 0;
  }
}
</style>

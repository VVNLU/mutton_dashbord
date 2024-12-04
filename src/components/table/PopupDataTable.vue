<template>
  <q-table :rows="rows" :columns="columns" row-key="name" :filter="filter" binary-state-sort>
    <!-- 沒有資料的提示 -->
    <template v-slot:no-data>
      <div class="full-width row flex-center text-indigo q-gutter-sm">
        <q-icon size="2em" name="sentiment_dissatisfied" />
        <span> 目前尚未添加任何資料。 </span>
      </div>
    </template>
    <!-- 刪除按鈕插槽 -->
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th class="th-first" auto-width />
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          <q-tooltip v-if="col.isPopupEdit" anchor="top middle" class="bg-grey-13 text-black shadow-4"
            :offset="[20, 20]">
            點擊數字可編輯
          </q-tooltip>
          {{ col.label }}
          <q-icon v-if="col.isPopupEdit" name="error" size="xs" color="amber" />
        </q-th>
      </q-tr>
    </template>
    <!-- 內容插槽 -->
    <template v-slot:body="props">
      <q-tr :props="props">
        <!-- 刪除紐內容插槽 -->
        <q-td>
          <slot name="props" :row="props.row" />
        </q-td>
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <div v-if="col.isPopupEdit">
            {{ props.row[col.name] }}
            <q-popup-edit v-model="props.row[col.name]" v-slot="scope" buttons>
              <q-input type="number" v-model.number="scope.value" dense autofocus />
            </q-popup-edit>
          </div>
          <div v-else>
            {{ props.row[col.name] }}
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
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

const filter = ref('')
</script>

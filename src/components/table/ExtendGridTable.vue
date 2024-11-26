<template>
  <div class="row items-center q-gutter-y-md">
    <div v-if="rows.length === 0" class="row flex-center text-indigo q-gutter-sm">
      <q-icon size="2em" name="sentiment_dissatisfied" />
      <span>
        目前尚未添加任何資料。
      </span>
    </div>
    <q-card flat bordered v-for="(row, index) in rows" :key="index" class="full-width">
      <q-card-section>
        <div class="row items-start"> <!-- 使用 row 並對齊到左側 -->
          <div class="column items-start"> <!-- 使用 column 顯示垂直排列 -->
            <div v-if="columns.find(column => column.name === 'date')" class="q-pb-xs">
              <span class="q-pr-xs text-bold text-16px">
                {{ columns.find(column => column.name === 'date').label }}
              </span>
              <span class="rowStyle">
                {{ row['date'] }}
              </span>
            </div>

            <!-- 新增 remark 顯示 -->
            <div v-if="columns.find(column => column.name === 'remark')">
              <span class="q-pr-xs text-bold text-16px">
                {{ columns.find(column => column.name === 'remark').label }}
              </span>
              <span class="rowStyle">
                {{ row['remark'] }}
              </span>
            </div>
          </div>

          <!-- 插入的按鈕區塊，使用 flex 來對齊到右側 -->
          <q-card-actions class="justify-end q-pa-none">
            <slot name="action" :row="row" />
          </q-card-actions>
        </div>
      </q-card-section>

      <!-- <下拉選單 /> -->
      <q-card-actions class="row justify-center items-center q-pa-none">
        <div @click="row.isExpanded = !row.isExpanded" class="row items-center">
          <span v-if="!row.isExpanded">檢視全部原物料</span>
          <span v-else>收回</span>
          <q-btn color="grey" round flat dense :icon="row.isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            align="center" />
        </div>
      </q-card-actions>

      <q-slide-transition>
        <div v-show="row.isExpanded">
          <q-separator v-if="!row.isExpanded" />
          <q-markup-table>
            <thead>
              <tr>
                <th v-for="column in columns.filter(column => column.name !== 'date' && column.name !== 'remark')"
                  :key="column.name" class="text-left">{{ column.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="column in columns.filter(column => column.name !== 'date' && column.name !== 'remark')"
                  :key="column.name" class="text-left">
                  <span v-html="row[column.name]"></span>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </q-slide-transition>
    </q-card>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
})

// const isExpanded = ref(false)
props.rows.forEach(row => {
  row.isExpanded = false
})

console.log('row', props.rows)
</script>

<style lang="scss" scoped>
.rowStyle {
  background: #fff9c4;
  border-radius: 10px;
  padding: 5px;
  display: inline-block;
}
</style>
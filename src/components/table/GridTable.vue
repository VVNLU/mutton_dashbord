<template>
  <div class="row items-center q-gutter-md">
    <div v-if="rows.length === 0" class="row flex-center text-indigo q-gutter-sm">
      <q-icon size="2em" name="sentiment_dissatisfied" />
      <span>
        目前尚未添加任何資料。
      </span>
    </div>
    <q-card flat bordered v-for="(row, index) in rows" :key="index">
      <q-card-section class="row items-start q-gutter-md ">
        <div v-for="column in columns" :key="column.name">
          <div class="text-bold text-16px q-pb-xs">
            {{ column.label }}
          </div>
          <div class="row flex-center">
            <span v-if="column.name !== 'quantity' && column.name !== 'price' && column.name !== 'total'"
              class=" rowStyle">
              {{ row[column.name] }}
            </span>
            <span v-else-if="column.name === 'price'" class="rowStyle">
              $ {{ row[column.name] }}
            </span>
            <span v-else style="width: 80px">
              <q-input type="number" v-model.number="row[column.name]" dense autofocus clearable />
            </span>
          </div>
        </div>
        <q-space />
        <q-card-actions class="justify-around q-pa-none">
          <slot name="action" :row="row" />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
})
</script>

<style lang="scss" scoped>
.rowStyle {
  background: #fff9c4;
  border-radius: 10px;
  padding: 5px;
  display: inline-block;
}
</style>
<template>
  <div class="row items-center q-gutter-md">
    <div v-if="rows.length === 0" class="row flex-center text-indigo q-gutter-sm">
      <q-icon size="2em" name="sentiment_dissatisfied" />
      <span>
        目前尚未添加任何資料。
      </span>
    </div>
    <q-card flat bordered v-for="(row, index) in rows" :key="index">
      <q-card-section>
        <div v-for="column in columns" :key="column.name">
          <div class="text-bold q-pt-xs q-pb-xs">
            {{ column.label }}
          </div>
          <div>
            <span v-if="column.name !== 'quantity' && column.name !== 'price'" class=" rowStyle">
              {{ row[column.name] }}
            </span>
            <span v-else-if="column.name === 'price'" class="rowStyle">
              $ {{ row[column.name] }}
            </span>
            <div v-else style="width: 80px">
              <q-input type="number" v-model.number="row[column.name]" dense autofocus clearable />
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- <插入按鈕 /> -->
      <q-card-actions class="justify-around q-pa-none">
        <slot name="action" :row="row" />
      </q-card-actions>

      <!-- <下拉選單 /> -->
      <q-card-actions v-show="isExpanded">
        <!-- <q-space /> -->
        <q-btn color="grey" round flat dense :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expanded = !expanded" />
      </q-card-actions>
      <q-slide-transition>
        <div v-show="expanded">
          <q-separator />
          <q-card-section>
            <p>123</p>
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  isExpanded: { type: Boolean, default: true },
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
})

const expanded = ref(false)
</script>

<style lang="scss" scoped>
.rowStyle {
  background: #fff9c4;
  border-radius: 15px;
  padding: 5px 10px;
  display: inline-block;
}
</style>
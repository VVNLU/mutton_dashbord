<template>
  <div class="row items-center q-gutter-y-md">
    <!-- 搜尋框 -->
    <div class="col-12">
      <q-input v-model="searchQuery" placeholder="搜尋…" outlined dense clearable>
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <!-- 無資料 -->
    <div v-if="props.rows.length === 0" class="row flex-center text-indigo q-gutter-sm">
      <q-icon size="2em" name="sentiment_dissatisfied" />
      <span>
        目前沒有任何資料可顯示。
      </span>
    </div>
    <div v-else-if="filteredRows.length === 0" class="row flex-center text-indigo q-gutter-sm">
      <q-icon size="2em" name="search_off" />
      <span>
        很抱歉，沒有符合搜尋條件的結果。
      </span>
    </div>
    <div class="col-12">
      <q-virtual-scroll :items="paginatedRows" :item-size="72">
        <template #default="props">
          <q-card flat bordered class="row q-mb-sm">
            <!-- 前兩筆欄位 -->
            <q-card-section v-for="column in columns.slice(0, 2)" :key="column.name"
              :class="column.label === '公司地址' || column.label === '備註' ? 'col-12' : 'col-6'">
              <q-field :label="column.label" stack-label>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ props.item[column.name] }}</div>
                </template>
              </q-field>
            </q-card-section>
            <!-- 欄位數量 <= 2，顯示下拉按鈕 -->
            <div v-if="columns.length <= 2" class="row justify-center full-width">
              <slot name="action" :row="props.item" />
            </div>
            <!-- 顯示更多按鈕和隱藏欄位 -->
            <div v-if="columns.length > 2" class="row col-12">
              <q-btn @click="toggleShowMore(props.index)" :label="expandedRows[props.index] ? '收回' : '詳情'"
                :icon="expandedRows[props.index] ? 'keyboard_arrow_up ' : 'keyboard_arrow_down'" color="grey" flat dense
                class="col-12" />
              <div v-show="expandedRows[props.index]" class="row col-12">
                <q-card-section v-for="column in columns.slice(2)" :key="column.name"
                  :class="column.label === '公司地址' || column.label === '備註' ? 'col-sm-6 col-xs-12' : 'col-6'">
                  <q-field :label="column.label" stack-label>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">{{ props.item[column.name] }}</div>
                    </template>
                  </q-field>
                </q-card-section>
                <div class="row justify-center full-width">
                  <slot name="action" :row="props.item" />
                </div>
              </div>
            </div>
          </q-card>
        </template>
      </q-virtual-scroll>

      <!-- 分頁 -->
      <div class="row justify-center q-mt-md">
        <q-pagination v-model="currentPage" :max="totalPages" :max-pages="5" direction-links flat color="grey"
          active-color="primary" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, reactive, ref, watch } from 'vue'

const props = defineProps({
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
})

const expandedRows = reactive({})
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 5

const filteredRows = computed(() => {
  const query = (searchQuery.value || "").trim().toLowerCase()

  if (!query) {
    return props.rows
  } return props.rows.filter(row => {
    return Object.values(row).some(value =>
      String(value).toLowerCase().includes(query)
    )
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredRows.value.length / pageSize)
})

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredRows.value.slice(start, end)
})

const toggleShowMore = (index) => {
  expandedRows[index] = !expandedRows[index]
}

</script>
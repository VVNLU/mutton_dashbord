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
    <!-- 資料清單 -->
    <div class="col-12">
      <q-virtual-scroll :items="paginatedRows" :item-size="72">
        <template #default="props">
          <q-card flat bordered class="q-mb-sm bg-grey-1">
            <!-- 前兩筆欄位 -->
            <div v-if="activeColumns.length > 0" class="row">
              <q-card-section v-for="column in activeColumns.slice(0, 2)" :key="column.name" class="col-6">
                <q-field :label="column.label" stack-label>
                  <template v-slot:control>
                    <div v-if="props.item.styleColor" class="self-center full-width no-outline" tabindex="0"
                      :class="props.item.styleColor[column.name]">
                      {{ props.item[column.name] }}
                    </div>
                    <div v-else class="self-center full-width no-outline" tabindex="0">
                      {{ props.item[column.name] }}
                    </div>
                  </template>
                </q-field>
              </q-card-section>
            </div>

            <!-- 顯示更多內容  -->
            <div v-if="activeColumns.length > 2" class="row">
              <!-- 下拉按鈕 -->
              <q-btn @click="toggleShowMore(props.index)" :label="expandedRows[props.index] ? '收回' : '詳情'"
                :icon="expandedRows[props.index] ? 'keyboard_arrow_up ' : 'keyboard_arrow_down'" color="grey" flat dense
                class="col-12" />
              <!-- 詳情 -->
              <div v-show="expandedRows[props.index]" class="full-width">
                <div v-if="multipleColumns && multipleColumns.length > 0" class="row">
                  <q-card-section v-for="column in activeColumns.slice(2, sliceNumber)" :key="column.name"
                    class="col-6">
                    <q-field :label="column.label" stack-label>
                      <template v-slot:control>
                        <div class="self-center full-width no-outline" tabindex="0">
                          {{ props.item[column.name] }}
                        </div>
                      </template>
                    </q-field>
                  </q-card-section>
                  <q-card-section v-for="(content, index) in props.item.contents" :key="index" class="col-12">
                    <q-card flat bordered>
                      <div class="row col-6">
                        <q-field v-for="(column, colIndex) in multipleColumns.slice(sliceNumber)" :key="colIndex"
                          :label="column.label" stack-label class="col-6 q-pa-sm">
                          <template v-slot:control>
                            <div class="self-center full-width no-outline" tabindex="0">
                              {{ content[column.name] }}
                            </div>
                          </template>
                        </q-field>
                      </div>
                    </q-card>
                  </q-card-section>
                </div>
                <div v-else-if="columns && columns.length > 0" class="row">
                  <q-card-section v-for="column in  columns.slice(2) " :key="column.name" class="col-6">
                    <q-field :label="column.label" stack-label>
                      <template v-slot:control>
                        <div v-if="props.item.styleColor"
                          :class="[props.item.styleColor[column.name], 'self-center', 'full-width', 'no-outline']"
                          tabindex="0">
                          {{ props.item[column.name] || '-' }}
                        </div>
                        <div v-else class="self-center full-width no-outline" tabindex="0">
                          {{ props.item[column.name] || '-' }}
                        </div>
                      </template>
                    </q-field>
                  </q-card-section>
                </div>
              </div>
            </div>
            <div class="row justify-center full-width">
              <slot name="action" :row="props.item" />
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
  multipleColumns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
  sliceNumber: { type: Number, default: 3 },
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

const activeColumns = computed(() => props.multipleColumns.length > 0 ? props.multipleColumns : props.columns)

const toggleShowMore = (index) => {
  expandedRows[index] = !expandedRows[index]
}

// 監控 props.rows 的變化
watch(() => props.rows, () => {
  // 重置 expandedRows 狀態
  Object.keys(expandedRows).forEach(key => {
    expandedRows[key] = false
  })
})
</script>
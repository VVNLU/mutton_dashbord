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

    <q-card v-for="(row, index) in formattedRows" :key="index" flat bordered class="q-mb-sm col-12">
      <div class="row">
        <div v-for="column in columns" :key="column.name" class="col-xs-5 col-sm-5 col-md-4 q-pa-sm">
          <q-input v-if="column.isPopupEdit" v-model.number="row[column.name]" :label="column.label" type="number"
            clearable autofocus />
          <q-select v-else-if="column.isSelected" v-model="row.selectedPackage" :options="mergeUnitsAndPackages(row)"
            :label="column.label" clearable />
          <q-field v-else :label="column.label" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline">
                {{ row[column.name] }}
              </div>
            </template>
          </q-field>
        </div>
        <div class="row items-center justify-center col-2">

          <slot name="action" :row="row" />
        </div>
      </div>
    </q-card>
  </div>
</template>
<script setup>
import { defineProps, ref, computed } from 'vue'

const props = defineProps({
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
})

const searchQuery = ref('')

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

const formattedRows = computed(() =>
  filteredRows.value.map((row) => ({
    ...row,
    quantity: Math.abs(row.quantity), // 將 quantity 處理為正數
  }))
)

const mergeUnitsAndPackages = (row) => {
  const packageOptions = row.packages.map((pkg) => ({
    label: `${pkg.unit} - ${pkg.size} ${row.unit}`,
    value: { size: pkg.size, unit: pkg.unit },
  }))

  return [
    { label: row.unit, value: null }, // 選擇 units，值為 null
    ...packageOptions,
  ]
}

</script>
<template>
  <q-page class="q-pa-lg">
    <page-header>
      {{ $route.meta.title }}
      <template #action>
        <add-button to="/material-record/create" />
      </template>
    </page-header>
    <q-card class="shadow-7">
      <card-body>
        <q-btn-toggle v-model="switchStyle" no-caps rounded class="q-mb-sm" toggle-color="primary" color="white"
          text-color="primary" :options="[
        { label: '條列式', value: 'columnType' },
        { label: '網格式', value: 'gridType' }
      ]" />
        <div v-if="switchStyle === 'gridType'">
          <grid-table :rows="rows" :multipleColumns="multipleColumns">
            <template #action="{ row }">
              <edit-icon-button :to="'/material-record/edit/' + row.id" />
              <delete-icon-button @click="onDelete(row)" />
            </template>
          </grid-table>
        </div>
        <div v-else>
          <data-table :columns="columns" :rows="rows" :loading="loading">
            <template v-slot:body-cell-materialTitle="{ row }">
              <div v-html="row.materialTitle"></div>
            </template>
            <template #props="{ row }">
              <edit-icon-button :to="'/material-record/edit/' + row.id" />
              <delete-icon-button @click="onDelete(row)" />
            </template>
          </data-table>
        </div>
      </card-body>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getList, updateData, deleteData } from '@/api/materialRecord'
import useMessageDialog from '@/hooks/useMessageDialog'
import useCRUD from '@/hooks/useCRUD'

const rows = ref([])
const loading = ref(true)
const switchStyle = ref('gridType')

const columns = ref([
  {
    name: 'date',
    label: '日期',
    field: 'date',
    align: 'center',
    sortable: true
  },
  {
    name: 'orderId',
    label: '訂單單號',
    field: 'orderId',
    align: 'center',
    isMultiline: true
  },
  {
    name: 'materialTitle',
    label: '原物料',
    field: 'materialTitle',
    align: 'center',
    isMultiline: true
  },
  {
    name: 'materialQuantity',
    label: '數量',
    field: 'materialQuantity',
    align: 'center',
    isMultiline: true
  },
  {
    name: 'materialUnit',
    label: '單位',
    field: 'materialUnit',
    align: 'center',
    isMultiline: true
  },
  {
    name: 'materialPrice',
    label: '單價',
    field: 'materialPrice',
    align: 'center',
    isMultiline: true
  },
  {
    name: 'materialTotal',
    label: '總價',
    field: 'materialTotal',
    align: 'center',
    isMultiline: true
  },
  {
    name: 'remark',
    label: '備註',
    field: 'remark',
    align: 'center',
    isMultiline: true
  }
])

const multipleColumns = ref([
  {
    name: 'date',
    label: '日期',
    field: 'date',
    align: 'center',
    sortable: true
  },
  {
    name: 'orderId',
    label: '訂單單號',
    field: 'orderId',
    align: 'center',
    isMultiline: true
  },
  {
    name: 'remark',
    label: '備註',
    field: 'remark',
    align: 'center',
    isMultiline: true
  },
  {
    name: 'title',
    label: '原物料',
    field: 'title',
    align: 'center',
    isMultiline: true
  },
  {
    name: 'quantity',
    label: '數量',
    field: 'quantity',
    align: 'center',
    isMultiline: true
  },
  {
    name: 'unit',
    label: '單位',
    field: 'unit',
    align: 'center',
    isMultiline: true
  },
  // {
  //   name: 'price',
  //   label: '單價',
  //   field: 'price',
  //   align: 'center',
  //   isMultiline: true
  // },
  {
    name: 'total',
    label: '總價',
    field: 'total',
    align: 'center',
    isMultiline: true
  },
])

onMounted(async () => {
  await readListFetch()
  loading.value = false
})

const readListFetch = async (payload) => {
  return await getList(payload).then((result) => {
    rows.value = result.map((res) => {
      // 計算 materialQuantities 和 materialTotals
      const materialQuantities = res.items.map((item) => item.quantity)
      const materialTotals = res.items.map((item) => item.total)

      // 計算 materialPrice
      const materialPrices = materialTotals.map((total, index) => {
        const quantity = materialQuantities[index]
        return quantity > 0 ? (total / quantity).toFixed(2) : '0.00'
      })

      // 計算 calculatedColumns
      const selectedPackageSizes = res.items
        .map((item) => item.selectedPackage?.value).map((pkg) => pkg?.size)
        .filter((size) => size !== undefined)

      if (selectedPackageSizes.length > 0) {
        res.items = res.items.map((item) => {
          const size = item.selectedPackage?.value?.size || 1
          const quantity = item.quantity || 1
          return {
            ...item,
            quantity: Math.abs(size * quantity)
          }
        })
      } else {
        res.items = res.items.map((item) => {
          return {
            ...item,
            quantity: Math.abs(item.quantity)
          }
        })
      }

      return {
        ...res,
        contents: res.items,
        materialTitle: res.items.map((item) => item.title).join('<br>'),
        materialQuantity: materialQuantities.join('<br>'),
        materialTotal: materialTotals.join('<br>'),
        materialUnit: res.items.map((item) => item.unit).join('<br>'),
        materialPrice: materialPrices.join('<br>')
      }
    })
  })
}

const updateFetch = async (id, payload) => {
  return await updateData(id, payload)
}

const delFetch = async (id) => {
  return await deleteData(id)
}

const onDelete = async (row) => {
  const result = await messageDelete({
    title: '刪除',
    message: '確認刪除原物料紀錄？',
    confirmButtonText: '確認',
    cancelButtonText: '取消'
  })
  if (!result) return
  const [delRes] = await callDeleteFetch(row.id)
  if (delRes) {
    callReadListFetch()
  }
}

const { callReadListFetch, callDeleteFetch } = useCRUD({
  updateFetch,
  readListFetch,
  deleteFetch: delFetch
})

const { messageDelete } = useMessageDialog()
</script>

<template>
  <q-page class="q-pa-lg">
    <page-header>
      {{ $route.meta.title }}
      <template #action>
        <add-button to="/material/create" />
      </template>
    </page-header>
    <q-card class="shadow-7">
      <card-body>
        <data-table :columns="columns" :rows="rows" :loading="loading">
          <template v-slot:body-cell-materialTitle="{ row }">
            <div v-html="row.materialTitle"></div>
          </template>
          <template #props="{ row }">
            <edit-icon-button :to="'/material/edit/' + row.id" />
            <delete-icon-button @click="onDelete(row)" />
          </template>
        </data-table>
      </card-body>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getList, updateData, deleteData } from '@/api/material'
import useMessageDialog from '@/hooks/useMessageDialog'
import useCRUD from '@/hooks/useCRUD'

const rows = ref([])
const loading = ref(true)
const columns = [
  {
    name: 'manufacturingDate',
    label: '日期',
    field: 'manufacturingDate',
    align: 'center',
    sortable: true
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
  }
]

onMounted(async () => {
  await readListFetch()
  loading.value = false
})

const readListFetch = async (payload) => {
  return await getList(payload).then((res) => {
    rows.value = res.map((item) => {
      const materialQuantities = item.contents.map((item) => item.quantity)
      const materialTotals = item.contents.map((item) => item.total)

      // 計算 materialPrice，並設為 materialTotal / materialQuantity
      const materialPrices = materialTotals.map((total, index) => {
        const quantity = materialQuantities[index]
        return quantity > 0 ? (total / quantity).toFixed(2) : '0.00'
      })

      return {
        ...item,
        materialTitle: item.contents.map((item) => item.title).join('<br>'),
        materialQuantity: materialQuantities.join('<br>'),
        materialTotal: materialTotals.join('<br>'),
        materialUnit: item.contents.map((item) => item.unit).join('<br>'),
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
  const res = await messageDelete({
    title: '刪除',
    message: '確認刪除原物料紀錄？',
    confirmButtonText: '確認',
    cancelButtonText: '取消'
  })
  if (!res) return
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

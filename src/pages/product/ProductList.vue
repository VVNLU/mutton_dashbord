<template>
  <q-page class="q-pa-lg">
    <page-header>
      {{ $route.meta.title }}
      <template #action>
        <add-button to="/product/create" />
      </template>
    </page-header>
    <q-card class="shadow-7">
      <card-body>
        <toggle-input v-model="switchStyle" :label="switchStyle ? '網格式' : '條列式'" />
        <div v-if="switchStyle">
          <extend-table :isExpanded="false" :columns="columns" :rows="rows">
            <template #action="{ row }">
              <edit-icon-button :to="'/product/edit/' + row.id" />
              <delete-icon-button @click="onDelete(row)" />
            </template>
          </extend-table>
        </div>
        <div v-else>
          <data-table :columns="columns" :rows="rows" :loading="loading">
            <template #props="{ row }">
              <edit-icon-button :to="'/product/edit/' + row.id" />
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
import { getList, updateData, deleteData } from '@/api/product'
import { initializeDates } from '@/utils/dateHandler'
import useMessageDialog from '@/hooks/useMessageDialog'
import useCRUD from '@/hooks/useCRUD'

const rows = ref([])
const loading = ref(true)
const switchStyle = ref(true)

const columns = [
  { name: 'title', label: '商品名稱', field: 'title', align: 'center' },
  { name: 'depiction', label: '商品敘述', field: 'depiction', align: 'center' },
  { name: 'price', label: '定價', field: 'price', align: 'center' },
]

onMounted(async () => {
  await readListFetch()
  loading.value = false
})

const readListFetch = async (payload) => {
  return await getList(payload).then((res) => {
    rows.value = res.map((item) => initializeDates(item))
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
    message: '確認刪除商品？',
    confirmButtonText: '確認',
    cancelButtonText: '取消'
  })
  if (!res) return
  const [delRes] = await callDeleteFetch(row.id)
  if (delRes) {
    await callReadListFetch()
  }
}

const { callReadListFetch, callDeleteFetch } = useCRUD({
  updateFetch,
  readListFetch,
  deleteFetch: delFetch
})

const { messageDelete } = useMessageDialog()
</script>

<template>
  <q-page class="q-pa-lg">
    <page-header>
      {{ $route.meta.title }}
      <template #action>
        <add-button @click="showDialog({ id: null, mode: 'create', callRead: false })" />
      </template>
    </page-header>
    <q-card class="shadow-7">
      <card-body>
        <data-table :columns="columns" :rows="rows" :loading="loading">
          <template #props="{ row }">
            <edit-icon-button @click="showDialog({ id: row.id, mode: 'edit', callRead: true })" />
            <delete-icon-button @click="onDelete(row)" />
          </template>
        </data-table>
      </card-body>
    </q-card>

    <vendor-dialog ref="dialog" @save="refreshFetch" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getList, updateData, deleteData } from '@/api/vendor'
import { initializeDates } from '@/utils/dateHandler'
import VendorDialog from './components/VendorDialog.vue'
import useMessageDialog from '@/hooks/useMessageDialog'
import useCRUD from '@/hooks/useCRUD'

const rows = ref([])
const loading = ref(true)
const dialog = ref()
const columns = [
  { name: 'title', label: '公司名稱', field: 'title', align: 'center' },
  { name: 'contact', label: '聯絡人', field: 'contact', align: 'center' },
  { name: 'tel', label: '聯絡電話', field: 'tel', align: 'center' },
  { name: 'address', label: '公司地址', field: 'address', align: 'center' },
  { name: 'supplies', label: '供應品項', field: 'supplies', align: 'center' },
  { name: 'remark', label: '備註', field: 'remark', align: 'center' },
]

onMounted(async () => {
  await readListFetch()
  loading.value = false
})

const readListFetch = async (payload) => {
  return await getList(payload)
    .then((res) => {
      rows.value = res.map(item => initializeDates(item))
    })
}

const updateFetch = async (id, payload) => {
  return await updateData(id, payload)
}

const delFetch = async (id) => {
  return await deleteData(id)
}

const refreshFetch = async () => {
  await callReadListFetch()
}

const onDelete = async (row) => {
  const res = await messageDelete({
    title: '刪除',
    message: '確認刪除供應商？',
    confirmButtonText: '確認',
    cancelButtonText: '取消'
  })
  if (!res) return
  const [delRes] = await callDeleteFetch(row.id)
  if (delRes) {
    callReadListFetch()
  }

}

const showDialog = ({ id, mode, callRead }) => {
  dialog.value.showDialog({ id, mode, callRead })
}

const { callReadListFetch, callDeleteFetch } = useCRUD({
  updateFetch,
  readListFetch,
  deleteFetch: delFetch
})

const { messageDelete } = useMessageDialog()
</script>

<template>
  <q-page class="q-pa-lg">
    <page-header>
      {{ $route.meta.title }}
      <template #action>
        <add-button
          @click="showDialog({ id: null, mode: 'create', callRead: false })"
        />
      </template>
    </page-header>
    <q-card class="shadow-7">
      <card-body>
        <data-table :columns="columns" :rows="rows" :loading="loading">
          <template #props="{ row }">
            <edit-icon-button
              @click="showDialog({ id: row.id, mode: 'edit', callRead: true })"
            />
            <delete-icon-button @click="onDelete(row)" />
            <toggle-input
              v-model="row.is_enable"
              checked-icon="check"
              unchecked-icon="clear"
              color="secondary"
              @update:modelValue="onEnable(row)"
            />
          </template>
        </data-table>
      </card-body>
    </q-card>

    <material-dialog ref="dialog" @save="refreshFetch" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getList, updateData, deleteData } from '@/api/materialCategory'
import { initializeDates, updateDates } from '@/utils/dateHandler'
import MaterialDialog from './components/MaterialCategoryDialog.vue'
import useMessageDialog from '@/hooks/useMessageDialog'
import useCRUD from '@/hooks/useCRUD'

const rows = ref([])
const loading = ref(true)
const dialog = ref()
const columns = [
  { name: 'title', label: '分類名稱', field: 'title', align: 'center' },
  { name: 'unit', label: '單位', field: 'contact', align: 'center' }
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

const refreshFetch = async () => {
  await callReadListFetch()
}

const onEnable = async (row) => {
  const payload = updateDates({ is_enable: row.is_enable }, 'edit') // 更新時間
  const [res] = await callUpdateFetch(row.id, { ...payload })
  if (res) refreshFetch()
}

const onDelete = async (row) => {
  const res = await messageDelete({
    title: '刪除',
    message: '確認刪除原物料？',
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

const { callReadListFetch, callUpdateFetch, callDeleteFetch } = useCRUD({
  updateFetch,
  readListFetch,
  deleteFetch: delFetch
})

const { messageDelete } = useMessageDialog()
</script>

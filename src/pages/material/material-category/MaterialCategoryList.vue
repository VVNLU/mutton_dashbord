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
        <q-btn-toggle v-model="switchStyle" no-caps rounded class="q-mb-sm" toggle-color="primary" color="white"
          text-color="primary" :options="[
        { label: '條列式', value: 'columnType' },
        { label: '網格式', value: 'gridType' }
      ]" />
        <div v-if="switchStyle === 'gridType'">
          <grid-table :multipleColumns="multipleColumns" :rows="rows" :sliceNumber="2">
            <template #action="{ row }">
              <edit-icon-button @click="showDialog({ id: row.id, mode: 'edit', callRead: true })" />
              <delete-icon-button @click="onDelete(row)" />
            </template>
          </grid-table>
        </div>
        <div v-else>
          <data-table :columns="columns" :rows="rows" :loading="loading">
            <template #props="{ row }">
              <edit-icon-button @click="showDialog({ id: row.id, mode: 'edit', callRead: true })" />
              <delete-icon-button @click="onDelete(row)" />
            </template>
          </data-table>
        </div>
      </card-body>
    </q-card>

    <material-dialog ref="dialog" @save="refreshFetch" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getList, deleteData } from '@/api/materialCategory'
import MaterialDialog from './components/MaterialCategoryDialog.vue'
import useMessageDialog from '@/hooks/useMessageDialog'
import useCRUD from '@/hooks/useCRUD'

const rows = ref([])
const loading = ref(true)
const dialog = ref()
const switchStyle = ref('gridType')

const columns = [
  {
    name: 'title',
    label: '原物料名稱',
    field: 'title',
    align: 'center'
  },
  {
    name: 'unit',
    label: '單位',
    field: 'unit',
    align: 'center'
  },
  {
    name: 'packageUnit',
    label: '其他單位名稱',
    field: 'packageUnit',
    align: 'center',
    isMultiline: true
  },
  {
    name: 'packageSize',
    label: '數量',
    field: 'packageSize',
    align: 'center',
    isMultiline: true
  },
]
const multipleColumns = [
  {
    name: 'title',
    label: '原物料名稱',
    field: 'title',
    align: 'center'
  },
  {
    name: 'unit',
    label: '單位',
    field: 'unit',
    align: 'center'
  },
  {
    name: 'unit',
    label: '其他單位名稱',
    field: 'unit',
    align: 'center'
  },
  {
    name: 'size',
    label: '數量',
    field: 'size',
    align: 'center'
  },
]

onMounted(async () => {
  await readListFetch()
})

const readListFetch = async (payload) => {
  loading.value = true
  try {
    const res = await getList(payload)
    rows.value = res.map((item) => ({
      ...item,
      contents: item.packages,
      packageUnit: item.packages.map((pkg)=>pkg.unit).join('<br>'),
      packageSize: item.packages.map((pkg)=>pkg.size).join('<br>'),
    }))
  } finally {
    loading.value = false
  }
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

const { messageDelete } = useMessageDialog()
const { callReadListFetch, callDeleteFetch } = useCRUD({
  readListFetch,
  deleteFetch: delFetch
})

</script>

<template>
  <q-page class="q-pa-lg">
    <page-header>
      {{ $route.meta.title }}
      <template #action>
        <add-button @click="showDialog({})" />
      </template>
    </page-header>
    <q-card class="shadow-7">
      <card-body>
        <material-list-search-block v-model="search" @changeFilter="onChangeFilter" @reset="onReset" />
        <vxe-server-table ref="dataTable" :data="data" :total="total" :current="search.page" @sort-change="OnChangeSort"
          @update:current="onChangePage">
          <vxe-column v-for="{ field, title, min_width, sort } in tableFields" :key="field" :field="field"
            :title="title" :sortable="sort" :min-width="min_width" />
          <vxe-column title="啟用設定" width="150">
            <template #default="{ row }">
              <toggle-input v-model="row.is_enable" :label="row.is_enable ? '啟用' : '不啟用'"
                @update:modelValue="onEnable(row)" />
            </template>
          </vxe-column>
          <vxe-column title="操作" fixed="right" width="115">
            <template #default="{ row }">
              <div class="flex-center row">
                <edit-icon-button class="q-mr-xs q-mb-xs" @click="
        showDialog({ id: row.id, mode: 'edit', callRead: true })
        " />
                <delete-icon-button class="q-mr-xs q-mb-xs" @click="onDelete(row)" />
              </div>
            </template>
          </vxe-column>
        </vxe-server-table>
      </card-body>
    </q-card>

    <material-dialog ref="dialog" @save="refreshFetch" />
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { getList, updateData, deleteData } from '@/api/materialClassification'
import { initializeDates, updateDates } from '@/utils/dateHandler'
import MaterialListSearchBlock from './components/MaterialClassificationListSearchBlock.vue'
import MaterialDialog from './components/MaterialClassificationDialog.vue'
import useVxeServerDataTable from '@/hooks/useVxeServerDataTable'
import useMessageDialog from '@/hooks/useMessageDialog'
import useCRUD from '@/hooks/useCRUD'

const filter = reactive({
  keyword: null
})

const tableFields = ref([
  { title: '分類名稱', field: 'name', min_width: '130', sort: false },
  { title: '單位', field: 'unit', min_width: '130', sort: false },
  { title: '排序', field: 'sequence', width: '130', sort: true }
])
const dialog = ref()

const readListFetch = async (payload) => {
  return await getList(payload).then((res) => {
    data.value = res.map(item => initializeDates(item))
    total.value = res.length
  })
}

const updateFetch = async (id, payload) => {
  return await updateData(id, payload)
}

const delFetch = async (id) => {
  return await deleteData(id)
}

const refreshFetch = async () => {
  await callReadListFetch({ ...search })
}

const onEnable = async (row) => {
  const payload = updateDates({ is_enable: row.is_enable }, 'edit') // 更新時間
  const [res] = await callUpdateFetch(row.id, { ...payload })
  if (res) refreshFetch()
}

const onDelete = async (row) => {
  const res = await messageDelete({
    title: '刪除',
    message: '確認刪除原物料分類？',
    confirmButtonText: '確認',
    cancelButtonText: '取消'
  })
  if (!res) return
  const [delRes] = await callDeleteFetch(row.id)
  if (delRes) {
    onChangeFilter()
  }
}

const showDialog = ({ id, mode, callRead }) => {
  dialog.value.showDialog({ id, mode, callRead })
}

const {
  dataTable,
  search,
  data,
  total,
  onChangePage,
  onChangeFilter,
  OnChangeSort,
  onReset
} = useVxeServerDataTable({
  searchParams: filter,
  sortParams: [{ field: 'sequence', order: 'asc' }],
  sessionStorageKey: 'dashboardMaterialServerDataTable',
  callback: refreshFetch
})

const { callReadListFetch, callDeleteFetch, callUpdateFetch } = useCRUD({
  updateFetch: updateFetch,
  readListFetch: readListFetch,
  deleteFetch: delFetch
})

const { messageDelete } = useMessageDialog()
</script>

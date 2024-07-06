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
        <!-- <material-list-search-block v-model="search" class="q-mb-sm" @changeFilter="onChangeFilter" @reset="onReset" /> -->
        <vxe-server-table ref="dataTable" :data="data" :total="total" :current="search.page" @sort-change="OnChangeSort"
          @update:current="onChangePage">
          <vxe-column v-for="{ field, title, min_width, sort } in tableFields" :key="field" :field="field"
            :title="title" :sortable="sort" :min-width="min_width" />
          <vxe-column title="操作" fixed="right" width="115">
            <template #default="{ row }">
              <div class="flex-center row">
                <edit-icon-button class="q-mr-xs q-mb-xs" :to="'/material/edit/' + row.id" />
                <delete-icon-button class="q-mr-xs q-mb-xs" @click="onDelete(row)" />
              </div>
            </template>
          </vxe-column>
        </vxe-server-table>
      </card-body>
    </q-card>
  </q-page>
</template>

<script setup>
// import MaterialListSearchBlock from './components/MaterialListSearchBlock.vue'
import { reactive, ref } from 'vue'
import { getList, updateData, deleteData } from '@/api/material'
import useCRUD from '@/hooks/useCRUD'
import useMessageDialog from '@/hooks/useMessageDialog'
import useVxeServerDataTable from '@/hooks/useVxeServerDataTable'

const filter = reactive({
  keyword: null,
  publish_date_range: null,
  closed_date_range: null,
  start_publish_date: null,
  end_publish_date: null,
  start_closed_date: null,
  end_closed_date: null,
})

const tableFields = ref([
  { title: '日期', field: '', min_width: '120', sort: true },
  { title: '內容物', field: '', min_width: '120', sort: false },
  { title: '單價', field: '', min_width: '120', sort: false },
  { title: '單位', field: '', min_width: '100', sort: false },
  { title: '數量', field: '', min_width: '120', sort: false },
  { title: '總成本', field: '', min_width: '120', sort: false },
])

const readListFetch = async (payload) => {
  return await getList(payload)
    .then((res) => {
      data.value = res
      total.value = res.length
    })
}

const updateFetch = async (id, payload) => {
  return await updateData(id, payload)
}

const delFetch = async (id) => {
  return await deleteData(id)
}

const onEnable = async (row) => {
  const payload = { is_enable: row.is_enable }
  const urlObj = {
    edit: () => {
      return callUpdateFetch(row.id, { ...payload })
    },
  }
  const [res] = await urlObj.edit()
  if (res) refreshFetch()
}

const onBlank = async (row) => {
  const payload = { is_link_blank: row.is_link_blank }
  const urlObj = {
    edit: () => {
      return callUpdateFetch(row.id, { ...payload })
    },
  }
  const [res] = await urlObj.edit()
  if (res) refreshFetch()
}

const onDelete = async (row) => {
  const res = await messageDelete({ title: '刪除', message: '確認刪除輪播圖？', confirmButtonText: '確認', cancelButtonText: '取消' })
  if (!res) return
  const [delRes] = await callDeleteFetch(row.id)
  if (delRes) {
    search.page = 1
    refreshFetch()
  }
}

const refreshFetch = async () => {
  const filter = { ...search }
  filter.start_publish_date = filter.publish_date_range?.from ? filter.publish_date_range.from : null
  filter.end_publish_date = filter.publish_date_range?.to ? filter.publish_date_range.to : null
  filter.start_closed_date = filter.closed_date_range?.from ? filter.closed_date_range.from : null
  filter.end_closed_date = filter.closed_date_range?.to ? filter.closed_date_range.to : null
  await getDataList({ ...filter })
}

const { dataTable, search, data, total, onChangePage, onChangeFilter, OnChangeSort, onReset } = useVxeServerDataTable({
  searchParams: filter,
  sortParams: [{
    field: 'sequence',
    order: 'asc',
  }],
  sessionStorageKey: 'dashboardMaterialServerDataTable',
  callback: refreshFetch,
})

const { messageDelete } = useMessageDialog()
const { callUpdateFetch, callDeleteFetch, callReadListFetch: getDataList } = useCRUD({
  updateFetch: updateFetch,
  deleteFetch: delFetch,
  readListFetch: readListFetch,
})

</script>
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
        <vxe-server-table
          ref="dataTable"
          :data="data"
          :total="total"
          :current="search.page"
          @sort-change="OnChangeSort"
          @update:current="onChangePage"
        >
          <vxe-column title="日期" field="data" min_width="110" />
          <vxe-column title="原物料" min_width="110">
            <template #default="{ row }">
              <div v-for="item in row.contents">{{ item.title }}</div>
            </template>
          </vxe-column>
          <vxe-column title="數量" min_width="110">
            <template #default="{ row }">
              <div v-for="item in row.contents">{{ item.quantity }}</div>
            </template>
          </vxe-column>
          <vxe-column title="單位" min_width="110">
            <template #default="{ row }">
              <div v-for="item in row.contents">{{ item.unit }}</div>
            </template>
          </vxe-column>
          <vxe-column title="單價" min_width="110">
            <template #default="{ row }">
              <div v-for="item in row.contents">{{ item.price }}</div>
            </template>
          </vxe-column>
          <vxe-column title="總價" min_width="110">
            <template #default="{ row }">
              <div v-for="item in row.contents">{{ item.total }}</div>
            </template>
          </vxe-column>
          <vxe-column title="操作" fixed="right" width="115">
            <template #default="{ row }">
              <div class="flex-center row">
                <edit-icon-button
                  class="q-mr-xs q-mb-xs"
                  :to="'/material/edit/' + row.id"
                />
                <delete-icon-button
                  class="q-mr-xs q-mb-xs"
                  @click="onDelete(row)"
                />
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
  end_closed_date: null
})

const readListFetch = async (payload) => {
  return await getList(payload).then((res) => {
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

const onDelete = async (row) => {
  const res = await messageDelete({
    title: '刪除',
    message: '確認刪除輪播圖？',
    confirmButtonText: '確認',
    cancelButtonText: '取消'
  })
  if (!res) return
  const [delRes] = await callDeleteFetch(row.id)
  if (delRes) {
    search.page = 1
    refreshFetch()
  }
}

const refreshFetch = async () => {
  const filter = { ...search }
  filter.start_publish_date = filter.publish_date_range?.from
    ? filter.publish_date_range.from
    : null
  filter.end_publish_date = filter.publish_date_range?.to
    ? filter.publish_date_range.to
    : null
  filter.start_closed_date = filter.closed_date_range?.from
    ? filter.closed_date_range.from
    : null
  filter.end_closed_date = filter.closed_date_range?.to
    ? filter.closed_date_range.to
    : null
  await getDataList({ ...filter })
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
  sortParams: [
    {
      field: 'sequence',
      order: 'desc'
    }
  ],
  sessionStorageKey: 'dashboardMaterialServerDataTable',
  callback: refreshFetch
})

const { messageDelete } = useMessageDialog()
const { callDeleteFetch, callReadListFetch: getDataList } = useCRUD({
  updateFetch: updateFetch,
  deleteFetch: delFetch,
  readListFetch: readListFetch
})
</script>

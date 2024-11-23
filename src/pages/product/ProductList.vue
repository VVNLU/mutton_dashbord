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
        <!-- <product-list-search-block v-model="search" class="q-mb-sm" @changeFilter="onChangeFilter" @reset="onReset" /> -->
        <vxe-server-table
          ref="dataTable"
          :data="data"
          :total="total"
          :current="search.page"
          @sort-change="OnChangeSort"
          @update:current="onChangePage"
        >
          <vxe-column
            v-for="{ field, title, min_width } in tableFields"
            :key="field"
            :field="field"
            :title="title"
            :min-width="min_width"
          />
          <vxe-column title="上架設定" width="120">
            <template #default="{ row }">
              <toggle-input
                v-model="row.isAvailable"
                :label="row.isAvailable ? '上架' : '不上架'"
                @update:modelValue="onAvailable(row)"
              />
            </template>
          </vxe-column>
          <vxe-column title="操作" fixed="right" width="115">
            <template #default="{ row }">
              <div class="flex-center row">
                <edit-icon-button
                  class="q-mr-xs q-mb-xs"
                  :to="'/product/edit/' + row.id"
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
// import ProductListSearchBlock from './components/ProductListSearchBlock.vue'
import { reactive, ref } from 'vue'
import { getList, updateData, deleteData } from '@/api/product'
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

const tableFields = ref([
  { title: '商品名稱', field: 'title', min_width: '120' },
  { title: '商品敘述', field: 'depiction', min_width: '150' },
  { title: '成本', field: '', min_width: '100' },
  { title: '定價', field: 'price', min_width: '100' }
])

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

const onAvailable = async (row) => {
  const payload = { isAvailable: row.isAvailable }
  const urlObj = {
    edit: () => {
      return callUpdateFetch(row.id, { ...payload })
    }
  }
  const [res] = await urlObj.edit()
  if (res) refreshFetch()
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
      order: 'asc'
    }
  ],
  sessionStorageKey: 'dashboardProductServerDataTable',
  callback: refreshFetch
})

const { messageDelete } = useMessageDialog()
const {
  callUpdateFetch,
  callDeleteFetch,
  callReadListFetch: getDataList
} = useCRUD({
  updateFetch: updateFetch,
  deleteFetch: delFetch,
  readListFetch: readListFetch
})
</script>

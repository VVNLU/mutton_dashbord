<template>
  <q-page class="q-pa-lg">
    <page-header>
      {{ $route.meta.title }}
      <template #action>
        <add-button to="/order/create" />
      </template>
    </page-header>

    <q-card class="shadow-7">
      <card-body>
        <!-- <order-list-search-block v-model="search" class="q-mb-sm" @changeFilter="onChangeFilter" @reset="onReset" /> -->
        <vxe-server-table ref="dataTable" :data="data" :total="total" :current="search.page" @sort-change="OnChangeSort"
          @update:current="onChangePage" :cell-class-name="getCellClassName">
          <vxe-column v-for="{ field, title, min_width } in tableFields" :key="field" :field="field" :title="title"
            :min-width="min_width" />
          <vxe-column title="操作" fixed="right" width="60">
            <template #default="{ row }">
              <div class="flex-center row">
                <edit-icon-button icon="search" class="q-mr-xs q-mb-xs"
                  @click="showDialog({ id: row.id, mode: 'edit', callRead: true })" />
              </div>
            </template>
          </vxe-column>
        </vxe-server-table>
      </card-body>
    </q-card>

    <order-edit ref="dialog" @save="refreshFetch" />
  </q-page>
</template>

<script setup>
// import OrderListSearchBlock from './components/OrderListSearchBlock.vue'
import { reactive, ref, onMounted } from 'vue'
import { getList, updateData, deleteData } from '@/api/order'
import OrderEdit from './OrderEdit.vue'
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

const dialog = ref()
const tableFields = ref([
  { title: '訂單單號', field: 'id', min_width: '120' },
  { title: '訂購人', field: 'client.name', min_width: '100' },
  { title: '電話', field: 'client.tel', min_width: '120' },
  { title: '狀態', field: 'state', min_width: '80' },
  { title: '交易方式', field: 'payment', min_width: '80' },
  { title: '後五碼', field: 'accountLastFive', min_width: '80' },
  { title: '是否付款', field: 'isPaid', min_width: '80' },
  { title: '出貨方式', field: 'ship', min_width: '80' },
  { title: '是否出貨', field: 'isShipped', min_width: '80' },
  { title: '人員', field: '', min_width: '80' },
  { title: '備註', field: 'client.remark', min_width: '120' },
])

onMounted(() => {
  getCellClassName()
})

const getCellClassName = ({ row = {}, column = {} } = {}) => {
  const field = column.field
  switch (field) {
    case 'state':
      return row.state === '處理中' ? 'processing' : row.state === '已完成' ? 'completed' : row.state === '已取消' ? 'canceled' : ''
    case 'isPaid':
      return row.isPaid === '處理中' ? 'processing' : row.isPaid === '已完成' ? 'completed' : row.isPaid === '已取消' ? 'canceled' : ''
    case 'isShipped':
      return row.isShipped === '處理中' ? 'processing' : row.isShipped === '已完成' ? 'completed' : row.isShipped === '已取消' ? 'canceled' : ''
    default:
      return ''
  }
}

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

const onDelete = async (row) => {
  const res = await messageDelete({
    title: '刪除',
    message: '確認刪除訂單？',
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
  sortParams: [
    {
      field: 'sequence',
      order: 'asc'
    }
  ],
  sessionStorageKey: 'dashboardOrderServerDataTable',
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

<style lang="scss">
.processing,
.completed,
.canceled {
  font-weight: bold;
  border-radius: 15px;
}

.processing {
  background-color: $rating-grade-color;
}

.completed {
  color: white;
  background-color: $green;
}

.canceled {
  color: white;
  background-color: $red;
}
</style>
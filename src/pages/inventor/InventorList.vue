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
        <inventor-list-search-block
          v-model="search"
          @changeFilter="onChangeFilter"
          @reset="onReset"
        />
        <div class="text-bold text-h6 q-mb-sm">
          庫存量： {{ totalStock }} 包
        </div>
        <vxe-server-table
          ref="dataTable"
          :data="data"
          :total="total"
          :current="search.page"
          :show-footer="true"
          :footer-method="calculateFooterTotals"
          @sort-change="OnChangeSort"
          @update:current="onChangePage"
        >
          <vxe-column
            v-for="{ field, title, min_width, sort } in tableFields"
            :key="field"
            :field="field"
            :title="title"
            :sortable="sort"
            :min-width="min_width"
          />
          <vxe-column title="銷貨量" field="salesVolume" width="200">
            <template #default="{ row }">
              {{ row.salesVolume }}
              <span>
                <base-icon-button
                  v-if="row.salesVolume > 0"
                  icon="fas fa-circle-exclamation"
                  :size="'sm'"
                  :color="'warning'"
                  :flat="true"
                />
                <q-tooltip class="text-h6">
                  重慶市場: {{ row.chongqing_market }}<br />
                  四八市場: {{ row.shiba_market }}<br />
                  外送: {{ row.delivery }}<br />
                  自取: {{ row.pick_up }}<br />
                  公關: {{ row.gift }}<br />
                </q-tooltip>
              </span>
            </template>
          </vxe-column>
          <vxe-column title="備註" width="250">
            <template #default="{ row }">
              {{ row.remark }}
            </template>
          </vxe-column>
          <vxe-column title="操作" fixed="right" width="120">
            <template #default="{ row }">
              <div class="flex-center row">
                <edit-icon-button
                  class="q-mr-xs q-mb-xs"
                  @click="
                    showDialog({ id: row.id, mode: 'edit', callRead: true })
                  "
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

    <inventor-dialog ref="dialog" @save="refreshFetch" />
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { getList, updateData, deleteData } from '@/api/inventor'
import InventorListSearchBlock from './components/InventorListSearchBlock.vue'
import InventorDialog from './components/InventorDialog.vue'
import useVxeServerDataTable from '@/hooks/useVxeServerDataTable'
import useMessageDialog from '@/hooks/useMessageDialog'
import useCRUD from '@/hooks/useCRUD'

const filter = reactive({
  keyword: null
})

const tableFields = ref([
  { title: '日期', field: 'date', min_width: '120', sort: true },
  { title: '進貨量', field: 'restock', min_width: '100', sort: false }
])
const dialog = ref()
const totalStock = ref(0)

const formatNumberWithCommas = (number) => {
  return number.toLocaleString('en-US')
}

const calculateFooterTotals = ({ columns, data }) => {
  const footerData = [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return '總計'
      }
      if (['restock'].includes(column.field)) {
        const mapRestock = data.map((item) => {
          const clearStr = item.restock.replace(/,/g, '')
          return Number(clearStr)
        })
        const sumRestock = mapRestock.reduce((acc, num) => acc + num, 0)
        return formatNumberWithCommas(sumRestock)
      }
      if (['salesVolume'].includes(column.field)) {
        const mapSalesVolume = data.map((item) => {
          const clearStr = item.salesVolume.replace(/,/g, '')
          return Number(clearStr)
        })
        const sumSalesVolume = mapSalesVolume.reduce((acc, num) => acc + num, 0)
        return formatNumberWithCommas(sumSalesVolume)
      }
    })
  ]
  return footerData
}
const readListFetch = async (payload) => {
  return await getList(payload).then((res) => {
    let totalRestock = 0
    let totalSalesVolume = 0

    res.forEach((item) => {
      const salesVolume =
        item.chongqing_market +
        item.shiba_market +
        item.delivery +
        item.pick_up +
        item.gift
      totalRestock += item.restock
      totalSalesVolume += salesVolume
      item.salesVolume = formatNumberWithCommas(salesVolume)
      item.restock = formatNumberWithCommas(item.restock)
    })

    data.value = res
    total.value = res.length
    totalStock.value = formatNumberWithCommas(totalRestock - totalSalesVolume)
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

const onDelete = async (row) => {
  const res = await messageDelete({
    title: '刪除',
    message: '確認刪除進銷存？',
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
  sortParams: [
    { field: 'date', order: 'asc' },
    { field: 'id', order: 'desc' }
  ],
  sessionStorageKey: 'dashboardInventorServerDataTable',
  callback: refreshFetch
})

const { callReadListFetch, callDeleteFetch } = useCRUD({
  updateFetch: updateFetch,
  readListFetch: readListFetch,
  deleteFetch: delFetch
})

const { messageDelete } = useMessageDialog()
</script>

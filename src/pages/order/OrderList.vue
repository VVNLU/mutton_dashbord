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
        <toggle-input v-model="switchStyle" :label="switchStyle ? '網格式' : '條列式'" />
        <div v-if="switchStyle">
          <extend-grid-table :columns="columns" :rows="rows">
            <template #action="{ row }">
              <edit-icon-button @click="showDialog({ id: row.id, mode: 'edit', callRead: true })" />
            </template>
          </extend-grid-table>
        </div>
        <div v-else>
          <data-table :columns="columns" :rows="rows" :loading="loading">
            <template #props="{ row }">
              <edit-icon-button @click="showDialog({ id: row.id, mode: 'edit', callRead: true })" />
            </template>
          </data-table>
        </div>
      </card-body>
    </q-card>

    <order-edit ref="dialog" @delete="refreshFetch" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getList, updateData, deleteData } from '@/api/order'
import { initializeDates } from '@/utils/dateHandler'
import OrderEdit from './OrderEdit.vue'
import useCRUD from '@/hooks/useCRUD'
import useMessageDialog from '@/hooks/useMessageDialog'

const loading = ref(true)
const dialog = ref()
const rows = ref([])
const switchStyle = ref(true)

const columns = [
  { name: 'id', label: '訂單單號', field: 'id', align: 'center' },
  { name: 'clientName', label: '訂購人', field: 'clientName', align: 'center' },
  { name: 'clientTel', label: '電話', field: 'clientTel', align: 'center' },
  { name: 'state', label: '狀態', field: 'state', align: 'center' },
  { name: 'payment', label: '交易方式', field: 'payment', align: 'center' },
  { name: 'accountLastFive', label: '後五碼', field: 'accountLastFive', align: 'center' },
  { name: 'isPaid', label: '是否付款', field: 'isPaid', align: 'center' },
  { name: 'ship', label: '出貨方式', field: 'ship', align: 'center' },
  { name: 'orderNumber', label: '貨運單號', field: 'orderNumber', align: 'center' },
  { name: 'isShipped', label: '是否出貨', field: 'isShipped', align: 'center' },
  // { name: '', label: '人員', field: '', align: 'center' },
  { name: 'clientRemark', label: '備註', field: 'clientRemark', align: 'center' },
]

onMounted(() => {
  readListFetch()
  loading.value = false
})

const getCellClassName = ({ row = {}, column = {} } = {}) => {
  const field = column.field
  switch (field) {
    case 'state':
      return row.state === '處理中'
        ? 'processing '
        : row.state === '已完成'
          ? 'completed'
          : row.state === '已取消'
            ? 'canceled'
            : ''
    case 'isPaid':
      return row.isPaid === '處理中'
        ? 'processing'
        : row.isPaid === '已完成'
          ? 'completed'
          : row.isPaid === '已取消'
            ? 'canceled'
            : ''
    case 'isShipped':
      return row.isShipped === '處理中'
        ? 'processing'
        : row.isShipped === '已完成'
          ? 'completed'
          : row.isShipped === '已取消'
            ? 'canceled'
            : ''
    default:
      return ''
  }
}

const readListFetch = async (payload) => {
  return await getList(payload).then((res) => {
    rows.value = res.map((item) => {
      return initializeDates({
        ...item,
        clientName: item.client.name,
        clientTel: item.client.tel,
        clientAddress: item.client.address,
        clientRemark: item.client.remark
      })
    })
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
    message: '確認刪除訂單？',
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
const {
  callDeleteFetch,
  callReadListFetch
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
  display: flex;
  justify-content: center;
  font-weight: bold;
  border-radius: 4px;
}

.processing {
  color: $dark;
  background-color: $warning;
}

.completed {
  color: white;
  background-color: $positive;
}

.canceled {
  color: white;
  background-color: $negative;
}
</style>

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
        <q-btn-toggle v-model="switchStyle" no-caps rounded class="q-mb-sm" toggle-color="primary" color="white"
          text-color="primary"
          :options="[{ label: '條列式', value: 'columnType' }, { label: '網格式', value: 'gridType' }]" />
        <div v-if="switchStyle === 'gridType'">
          <grid-table :columns="columns" :rows="rowsWithStyleColor">
            <template #action="{ row }">
              <edit-icon-button @click="showDialog({ id: row.id, mode: 'edit', callRead: true })" />
            </template>
          </grid-table>
        </div>
        <div v-else>
          <data-table :columns="columns" :rows="rowsWithStyleColor" :loading="loading">
            <template #props="{ row }">
              <edit-icon-button @click="showDialog({ id: row.id, mode: 'edit', callRead: true })" />
            </template>
          </data-table>
        </div>
      </card-body>
    </q-card>

    <order-edit ref="dialog" @delete="refreshFetch" @update="refreshFetch" />
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getList, updateData } from '@/api/order'
import OrderEdit from './OrderEdit.vue'
import useCRUD from '@/hooks/useCRUD'

const loading = ref(true)
const dialog = ref()
const rows = ref([])
const switchStyle = ref('gridType')

const columns = ref([
  { name: 'orderNumber', label: '訂單單號', field: 'orderNumber', align: 'center' },
  { name: 'state', label: '訂單狀態', field: 'state', align: 'center' },
  { name: 'clientName', label: '訂購人', field: 'clientName', align: 'center' },
  { name: 'clientTel', label: '電話', field: 'clientTel', align: 'center' },
  { name: 'isPaid', label: '收款狀態', field: 'isPaid', align: 'center' },
  { name: 'payment', label: '交易方式', field: 'payment', align: 'center' },
  { name: 'accountLastFive', label: '後五碼', field: 'accountLastFive', align: 'center' },
  { name: 'isDelivered', label: '出貨狀態', field: 'isDelivered', align: 'center' },
  { name: 'delivery', label: '出貨方式', field: 'delivery', align: 'center' },
  { name: 'deliveryNumber', label: '貨運單號', field: 'deliveryNumber', align: 'center' },
  { name: 'salesperson', label: '銷售員', field: 'salesperson', align: 'center' },
  { name: 'clientRemark', label: '備註', field: 'clientRemark', align: 'center' },
])

onMounted(() => {
  readListFetch()
  loading.value = false
})

// 增加 className 到每個 row
const rowsWithStyleColor = computed(() => {
  return rows.value.map(row => {
    const styleColor = {
      state: getStyleColor(row.state, 'state'),
      isPaid: getStyleColor(row.isPaid, 'isPaid'),
      isDelivered: getStyleColor(row.isDelivered, 'isDelivered'),
    }
    return { ...row, styleColor }
  })
})

const getStyleColor = (value, field) => {
  switch (field) {
    case 'state':
      return value === '處理中'
        ? 'processing'
        : value === '已完成'
          ? 'completed'
          : value === '已取消'
            ? 'canceled'
            : ''
    case 'isPaid':
      return value === '已收款'
        ? 'completed'
        : value === '未收款'
          ? 'processing'
          : ''
    case 'isDelivered':
      return value === '已出貨'
        ? 'completed'
        : value === '未出貨'
          ? 'processing'
          : ''
    default:
      return ''
  }
}

const readListFetch = async (payload) => {
  return await getList(payload).then((res) => {
    rows.value = res.map((item) => {
      return {
        ...item,
        clientName: item.client.name,
        clientTel: item.client.tel,
        clientAddress: item.client.address,
        clientRemark: item.client.remark
      }
    })
  })
}

const updateFetch = async (id, payload) => {
  return await updateData(id, payload)
}

const refreshFetch = async () => {
  await callReadListFetch()
}

const showDialog = ({ id, mode, callRead }) => {
  dialog.value.showDialog({ id, mode, callRead })
}

const {
  callReadListFetch
} = useCRUD({
  updateFetch: updateFetch,
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

<template>
  <base-dialog v-model="isShowDialog" title="訂單詳情" :confirmButtonText="'送出'" :cancelButtonText="'取消'" @hide="onHide"
    :isShowFooter="false">
    <base-form ref="form">
      <div class="row q-gutter-y-sm">
        <q-card class="col-12 row justify-center items-center" bordered>
          <q-card-section :horizontal="isSmScreen">
            <q-card-section class="row justify-center col-xs-12 col-sm-6 q-pa-none">
              <div>
                <!-- 狀態 -->
                <div>
                  <q-chip :class="getStateColor(clientData.state)" :icon="getStateIcon(clientData.state)">
                    訂單狀態：{{ clientData.state }}
                  </q-chip>
                </div>
                <div>
                  <q-chip :class="getStateColor(clientData.isPaid)" :icon="getStateIcon(clientData.isPaid)">
                    金流狀態：{{ clientData.isPaid }}
                  </q-chip>
                </div>
                <div>
                  <q-chip :class="getStateColor(clientData.isDelivered)" :icon="getStateIcon(clientData.isDelivered)">
                    出貨狀態：{{ clientData.isDelivered }}
                  </q-chip>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="row justify-center items-center col-xs-12 col-sm-8 q-pa-none">
              <div class="q-pa-xs">
                <!-- 收款 -->
                <q-btn :disable="clientData.isPaid === '已收款' || clientData.state === '已取消'"
                  icon="fa-regular fa-square-check" label="收款" @click="updatePaidStatus()" rounded color="teal" stack />
              </div>
              <div class="q-pa-xs">
                <!-- 出貨 -->
                <q-btn :disable="clientData.isDelivered === '已出貨' || clientData.state === '已取消'"
                  icon="fa-regular fa-square-check" label="出貨" @click="updateDeliveryStatus()" rounded color="cyan"
                  stack />
              </div>
              <div class="q-pa-xs">
                <q-btn :disable="clientData.state === '已取消'" v-if="clientData.state !== '處理中'" color="red"
                  icon="fa-solid fa-trash-can" label="取消" @click="cancelOrder()" rounded stack />
                <q-btn v-else color="red" icon="fa-solid fa-trash" label="刪除" @click="onDelete()" rounded stack />
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
        <div class="col-12">
          <q-table :rows="clientData.productItems" :columns="columns" row-key="name" hide-bottom>
            <template v-slot:top-left>
              <q-tr>
                <q-item-label class="text-info">
                  <q-icon name="receipt_long" class="q-pr-xs text-info" size="1.5em" />
                  {{ clientData.orderNumber }}
                </q-item-label>
                <q-item-label class="text-accent text-shadow" v-if="clientData.payment">
                  <q-icon name="paid" class="q-pr-xs" size="1.5em" />
                  {{ clientData.payment }}付款
                  <template v-if="clientData.payment === '轉帳'">: 後五碼
                    <span class="text-bold">
                      {{ clientData.accountLastFive }}
                    </span>
                  </template>
                </q-item-label>
                <q-item-label class="text-secondary text-shadow" v-if="clientData.delivery">
                  <q-icon name="local_shipping" class="q-pr-xs" size="1.5em" />
                  {{ clientData.delivery }}出貨
                  <template v-if="clientData.delivery === '宅配'">: 貨運單號
                    <span class="text-bold">
                      {{ clientData.deliveryNumber }}
                    </span>
                  </template>
                </q-item-label>
              </q-tr>
            </template>
            <template v-slot:top-right>
              <q-chip outline color="red" icon="fa-solid fa-sack-dollar">
                總金額: {{ totalAmount }}
              </q-chip>
            </template>
          </q-table>
        </div>
        <q-card class="col-12" bordered>
          <q-card-actions>
            <span class="text-bold">訂購人資訊</span>
            <q-space />
            <q-btn color="grey" round flat dense :icon="expanded ? 'fa-solid fa-minus' : 'fa-solid fa-plus'"
              @click="expanded = !expanded" />
          </q-card-actions>
          <q-slide-transition>
            <div v-show="expanded" class="row q-pa-sm">
              <q-separator />
              <div class="col-6">
                <q-field borderless stack-label label="訂購人">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline text-18px" tabindex="0">
                      {{ clientData.client.name }}
                    </div>
                  </template>
                </q-field>
              </div>
              <div class="col-6">
                <q-field borderless stack-label label="電話">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline text-18px" tabindex="0">
                      {{ clientData.client.tel }}
                    </div>
                  </template>
                </q-field>
              </div>
              <div class="col-6">
                <q-field borderless stack-label label="地址">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline text-18px" tabindex="0">
                      {{ clientData.client.address }}
                    </div>
                  </template>
                </q-field>
              </div>
              <div class="col-6">
                <q-field borderless stack-label label="備註">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline text-18px" tabindex="0">
                      {{ clientData.client.remark }}
                    </div>
                  </template>
                </q-field>
              </div>
            </div>
          </q-slide-transition>
        </q-card>

      </div>
    </base-form>
  </base-dialog>
</template>
<script>
import { defineComponent, ref, watch, computed } from 'vue-demi'
import { getData, updateData, deleteData } from '@/api/order'
import { useQuasar } from 'quasar'
import useDialog from '@/hooks/useDialog'
import useMessageDialog from '@/hooks/useMessageDialog'
import useCRUD from '@/hooks/useCRUD'

export default defineComponent({
  emits: ['delete', 'update'],
  setup(props, { emit }) {
    const $q = useQuasar()
    const clientData = ref([])
    const currentId = ref(null)
    const expanded = ref(false)
    const columns = [
      {
        name: 'productTitle',
        label: '商品',
        align: 'left',
        field: 'productTitle'
      },
      {
        label: '數量',
        align: 'left',
        field: 'productQuantity'
      },
      {
        label: '小計',
        align: 'left',
        field: (row) => row.productQuantity * row.productPrice
      }
    ]

    const readFetch = async (id) => {
      const res = await getData(id)
      clientData.value = res
      currentId.value = id
    }

    const updateFetch = async (id, payload) => {
      return await updateData(id, payload)
    }

    const delFetch = async (currentId) => {
      return await deleteData(currentId)
    }

    const onHide = () => {
      expanded.value = false
      data.reset()
    }

    const onDelete = async () => {
      const res = await messageDelete({
        title: '刪除',
        message: '確認刪除訂單？',
        confirmButtonText: '確認',
        cancelButtonText: '取消'
      })
      if (!res) return
      const [delRes] = await callDeleteFetch(currentId.value)
      if (delRes) {
        isShowDialog.value = false
        emit('delete')
      }
    }

    const updatePaidStatus = async () => {
      const res = await messageDelete({
        title: '收款',
        message: '確認已收款？',
        confirmButtonText: '確認',
        cancelButtonText: '取消'
      })
      if (res) {
        const payload = {
          ...clientData.value,
          isPaid: "已收款"
        }
        const id = currentId.value
        const response = await callUpdateFetch(id, { ...payload })

        if (response) {
          await readFetch(id)
          emit('update')
        }
      }
    }

    const updateDeliveryStatus = async () => {
      const res = await messageDelete({
        title: '出貨',
        message: '確認已出貨？',
        confirmButtonText: '確認',
        cancelButtonText: '取消'
      })
      if (res) {
        const payload = {
          ...clientData.value,
          isDelivered: "已出貨"
        }
        const id = currentId.value
        const response = await callUpdateFetch(id, { ...payload })

        if (response) {
          await readFetch(id)
          emit('update')
        }
      }
    }

    const cancelOrder = async () => {
      const res = await messageDelete({
        title: '取消訂單',
        message: '確認取消訂單？',
        confirmButtonText: '確認',
        cancelButtonText: '取消'
      })
      if (res) {
        clientData.value.state = '已取消'
        clientData.value.isPaid = '已取消'
        clientData.value.isDelivered = '已取消'
      }
    }

    const getStateColor = (status) => {
      const colorMap = {
        處理中: 'bg-warning text-black',
        已完成: 'bg-positive text-white',
        已取消: 'bg-negative text-white',
        未收款: 'bg-warning text-black',
        已收款: 'bg-positive text-white',
        未出貨: 'bg-warning text-black',
        已出貨: 'bg-positive text-white',
      }
      return colorMap[status] || colorMap.default
    }

    const getStateIcon = (status) => {
      const iconMap = {
        處理中: 'hourglass_top',
        已完成: 'done_all',
        已取消: 'cancel',
        未收款: 'fa-solid fa-hand-holding-dollar',
        已收款: 'price_check',
        未出貨: 'fa-solid fa-box-archive',
        已出貨: 'fa-solid fa-truck-fast',
      }
      return iconMap[status] || iconMap.default
    }

    // 收款及出貨改為「已完成」時，狀態自動改成「已完成」
    watch(
      () => ({
        isPaid: clientData.value.isPaid,
        isDelivered: clientData.value.isDelivered
      }),
      async (newValues) => {
        const { isPaid, isDelivered } = newValues;

        if (isPaid === '已收款' && isDelivered === '已出貨') {
          clientData.value.state = '已完成';
        } else if (isPaid === '未收款' || isDelivered === '未出貨') {
          clientData.value.state = '處理中';
        }

        const payload = {
          ...clientData.value,
        };
        const id = currentId.value;

        try {
          await updateFetch(id, payload)
        } catch (error) {
          console.error('Failed to update state to backend:', error)
        }
      },
      { deep: true }
    )

    const totalAmount = computed(() => {
      return clientData.value.productItems.reduce((sum, item) => {
        return sum + item.productQuantity * item.productPrice
      }, 0)
    })

    // 是否為小型裝置
    const isSmScreen = computed(() => {
      return !$q.screen.lt.sm
    })

    // use
    const { messageDelete } = useMessageDialog()
    const { form, data, isShowDialog, showDialog, hideDialog } =
      useDialog({
        readFetch: readFetch
      })

    const { callUpdateFetch, callDeleteFetch } = useCRUD({
      updateFetch: updateFetch,
      deleteFetch: delFetch
    })

    return {
      clientData,
      currentId,
      expanded,
      columns,
      totalAmount,
      isSmScreen,
      form,
      data,
      isShowDialog,
      showDialog,
      hideDialog,

      getStateColor,
      getStateIcon,
      updatePaidStatus,
      updateDeliveryStatus,
      cancelOrder,

      onHide,
      onDelete
    }
  }
})
</script>

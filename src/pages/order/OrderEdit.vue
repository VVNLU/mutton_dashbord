<template>
  <base-dialog v-model="isShowDialog" title="訂單詳情" :confirmButtonText="'送出'" :cancelButtonText="'取消'" @save="onSave"
    @hide="onHide">
    <base-form ref="form">
      <div class="row q-col-gutter-x-md">
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
        <div class="col-12">
          <q-table :rows="clientData.contents" :columns="columns" row-key="name" hide-bottom>
            <template v-slot:top-left>
              <q-tr>
                <q-item-label class="text-info">
                  <q-icon name="receipt_long" class="q-pr-xs text-info" size="1.5em" />
                  {{ currentId }}
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
                <q-item-label class="text-secondary text-shadow" v-if="clientData.ship">
                  <q-icon name="local_shipping" class="q-pr-xs" size="1.5em" />
                  {{ clientData.ship }}出貨
                  <template v-if="clientData.ship === '宅配'">: 貨運單號
                    <span class="text-bold">
                      {{ clientData.orderNumber }}
                    </span>
                  </template>
                </q-item-label>
              </q-tr>
            </template>
            <template v-slot:top-right>
              <q-tr class="text-20px text-bold text-red outline rounded q-pa-xs">
                <q-td>總金額:</q-td>
                <q-td>{{ totalAmount }}</q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <div class="q-pt-md col-md-4 col-sm-4 col-xs-6">
          <q-btn-dropdown :color="getStatusColor(clientData.state)" :label="'狀態：' + `${clientData.state}`">
            <q-list>
              <q-item clickable v-close-popup @click="updateState('處理中')">
                <q-item-section>
                  <q-item-label>處理中</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="updateState('已完成')">
                <q-item-section>
                  <q-item-label>已完成</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="updateState('已取消')">
                <q-item-section>
                  <q-item-label>已取消</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div class="q-pt-md col-md-4 col-sm-4 col-xs-6">
          <q-btn-dropdown :color="getStatusColor(clientData.isPaid)" color="teal"
            :label="'付款：' + `${clientData.isPaid}`">
            <q-list>
              <q-item clickable v-close-popup @click="updatePaid('處理中')">
                <q-item-section>
                  <q-item-label>處理中</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="updatePaid('已完成')">
                <q-item-section>
                  <q-item-label>已完成</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div class="q-pt-md col-md-4 col-sm-4 col-xs-6">
          <q-btn-dropdown :color="getStatusColor(clientData.isShipped)" color="indigo"
            :label="'出貨：' + `${clientData.isShipped}`">
            <q-list>
              <q-item clickable v-close-popup @click="updateShipped('處理中')">
                <q-item-section>
                  <q-item-label>處理中</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="updateShipped('已完成')">
                <q-item-section>
                  <q-item-label>已完成</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div class="q-pt-md col-md-4 col-sm-4 col-xs-6">
          <q-btn class="q-mb-md round outline text-red" icon="delete" label="刪除訂單" @click="onDelete()" />
        </div>
      </div>
    </base-form>
  </base-dialog>
</template>
<script>
import { defineComponent, ref, watch, computed } from 'vue-demi'
import { getData, updateData, deleteData } from '@/api/order'
import { initializeDates, updateDates } from '@/utils/dateHandler'
import useDialog from '@/hooks/useDialog'
import useMessageDialog from '@/hooks/useMessageDialog'
import useCRUD from '@/hooks/useCRUD'

export default defineComponent({
  emits: ['save'],
  setup(props, { emit }) {
    // methods
    const clientData = ref([])
    const currentId = ref(null)
    const columns = [
      {
        name: 'name',
        label: '商品',
        align: 'left',
        field: row => row.product_title
      },
      {
        label: '數量',
        align: 'left',
        field: 'product_quantity'
      },
      {
        label: '小計',
        align: 'left',
        field: row => row.product_quantity * row.product_price
      }
    ]

    const readFetch = async (id) => {
      const res = await getData(id)
      clientData.value = initializeDates(res)
      currentId.value = id
    }

    const updateFetch = async (id, payload) => {
      return await updateData(id, payload)
    }

    const delFetch = async (currentId) => {
      return await deleteData(currentId)
    }

    const onSave = async () => {
      const payload = updateDates({
        ...clientData.value
      }, 'edit')
      const id = currentId.value
      await callUpdateFetch(id, { ...payload })

      const [res] = await save()
      if (res) emit('save')
    }

    const onHide = () => {
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
        hideDialog()
        emit('save')
      }
    }

    const getStatusColor = (status) => {
      const colorMap = {
        '處理中': 'warning text-black',
        '已完成': 'positive',
        '已取消': 'negative',
      }
      return colorMap[status] || colorMap.default
    }

    const originalValues = {
      isPaid: '',
      isShipped: ''
    }

    // 狀態修改回「處理中」則付款及出貨恢復初始值
    watch(
      () => clientData.value,
      (newVal) => {
        if (newVal && !originalValues.isPaid && !originalValues.isShipped) {
          originalValues.isPaid = newVal.isPaid
          originalValues.isShipped = newVal.isShipped
        }
      },
      { immediate: true, deep: true }
    )

    // 付款及出貨改為「已完成」時，狀態自動改成「已完成」
    watch(
      () => ({
        isPaid: clientData.value.isPaid,
        isShipped: clientData.value.isShipped
      }),
      (newValues) => {
        const { isPaid, isShipped } = newValues;

        if (isPaid === '已完成' && isShipped === '已完成') {
          clientData.value.state = '已完成'
        } else if (isPaid === '處理中' || isShipped === '處理中') {
          clientData.value.state = '處理中'
        }
      },
      { deep: true }
    )

    const updateState = (newState) => {
      clientData.value.state = newState

      if (newState === '已完成' || newState === '已取消') {
        clientData.value.isPaid = newState
        clientData.value.isShipped = newState
      } else if (newState === '處理中') {
        clientData.value.isPaid = originalValues.isPaid;
        clientData.value.isShipped = originalValues.isShipped;
      }
    }

    const updatePaid = (newPaid) => {
      clientData.value.isPaid = newPaid
    }

    const updateShipped = (newShipped) => {
      clientData.value.isShipped = newShipped
    }

    const totalAmount = computed(() => {
      return clientData.value.contents.reduce((sum, item) => {
        return sum + item.product_quantity * item.product_price;
      }, 0)
    })

    // use
    const { messageDelete } = useMessageDialog()
    const { form,
      data,
      isShowDialog,
      showDialog,
      hideDialog,
      save } = useDialog({
        readFetch: readFetch,
      })

    const {
      callUpdateFetch,
      callDeleteFetch,
    } = useCRUD({
      updateFetch: updateFetch,
      deleteFetch: delFetch,
    })

    return {
      clientData,
      currentId,
      columns,
      totalAmount,
      form,
      data,
      isShowDialog,
      showDialog,
      hideDialog,

      getStatusColor,
      onSave,
      onHide,
      updateState,
      updatePaid,
      updateShipped,
      onDelete
    }
  }
})
</script>

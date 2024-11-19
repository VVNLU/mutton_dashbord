<template>
  <q-page class="q-pa-lg">
    <page-header showPrev> 訂單詳情 </page-header>
    <base-form ref="form">
      <div class="row q-col-gutter-x-md q-col-gutter-y-md">
        <div class="col-md-6 col-sm-6 col-xs-12">
          <q-card class="h-full shadow-7">
            <card-header> 訂購人資料 </card-header>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <text-input v-model="client.name" label="姓名" placeholder="請輸入姓名" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <text-input v-model="client.tel" label="電話" placeholder="請輸入電話" :maxLength="10" />
                </div>
                <div class="col-12">
                  <text-input v-model="client.address" label="地址" placeholder="請輸入地址" />
                </div>
                <div class="col-12">
                  <text-input v-model="client.remark" label="備註" placeholder="請輸入備註" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <q-card class="h-full shadow-7">
            <card-body>
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <option-group v-model="payment" label="交易方式" :options="selectedPaymentMethod" type="radio"
                    class="full-width" />
                </div>
                <div v-if="payment === '轉帳'" class="q-mt-md col-md-6 col-sm-12 col-xs-12">
                  <text-input v-model="accountLastFive" label="帳號後五碼" placeholder="請輸入帳號後五碼" :required="true" />
                </div>
              </div>
            </card-body>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-md-6 col-12">
                  <option-group v-model="ship" label="出貨方式" :options="selectedShippingMethod" type="radio"
                    class="full-width" />
                </div>
                <div v-if="ship === '宅配'" class="q-mt-md col-md-6 col-sm-12 col-xs-12">
                  <text-input v-model="orderNumber" label="貨運單號" placeholder="請輸入貨運單號" :required="true" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
        <div class="col-md-4 col-sm-12 col-xs-12">
          <q-card class="h-full shadow-7">
            <card-header> 商品 </card-header>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-12">
                  <base-button v-for="item in productData" :label="item.title" :outline="true" :rounded="true"
                    @click="addNewData(item)" class="product-btn" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
        <div class="col-md-8 col-sm-12 col-xs-12">
          <q-card class="h-full shadow-7">
            <card-header> 訂單明細 </card-header>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-12">
                  <vxe-server-table ref="dataTable" :data="data">
                    <vxe-column title="項目" min_width="130">
                      <template #default="{ row }">
                        <div>{{ row.product_title }}</div>
                      </template>
                    </vxe-column>
                    <vxe-column title="數量" min_width="130">
                      <template #default="{ row }">
                        <number-input v-model="row.product_quantity" placeholder="請輸入數量" />
                      </template>
                    </vxe-column>
                    <vxe-column title="操作" fixed="right" width="115">
                      <template #default="{ row }">
                        <delete-icon-button class="q-mr-xs q-mb-xs" @click="onDelete(row)" />
                      </template>
                    </vxe-column>
                  </vxe-server-table>
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
      </div>
    </base-form>
  </q-page>
  <div class="row items-center">
    <fixed-footer @save="onSubmit" />
    <confirm-button v-if="payment === '現金' && ship === '面交'" @click="onCheckout" label="結帳" color="red"
      class="q-px-xl" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { addData } from '@/api/order'
import { getList } from '@/api/product'
import {  updateDates } from '@/utils/dateHandler'
import useCRUD from '@/hooks/useCRUD'
import useGoBack from '@/hooks/useGoBack'
import useVxeServerDataTable from '@/hooks/useVxeServerDataTable'
import useMessageDialog from '@/hooks/useMessageDialog'

const productData = ref([])
const client = ref({
  name: "",
  tel: "",
  address: "",
  remark: ""
})
const payment = ref(null)
const ship = ref(null)
const accountLastFive = ref("")
const orderNumber = ref("")

const selectedPaymentMethod = ref([
  { label: '現金', value: '現金' },
  { label: '轉帳', value: '轉帳' },
])

const selectedShippingMethod = ref([
  { label: '面交', value: '面交' },
  { label: '外送', value: '外送' },
  { label: '宅配', value: '宅配' },
])

onMounted(async () => {
  readProductFetch()
})

const addNewData = async (item) => {
  data.value.push({
    product_id: item.id,
    product_title: item.title,
    product_price: item.price,
    product_quantity: 1,
  })
}

const createFetch = async (payload) => {
  return await addData(payload)
}

const readProductFetch = async () => {
  const res = await getList()
  productData.value = res.map((item) => ({
    id: item.id,
    title: item.title,
    price: item.price
  }))
}

const onSubmit = async () => {
  form.value.validate().then(async (success) => {
    if (success) {
      const payload = updateDates({
        state: '處理中',
        isPaid: '處理中',
        isShipped: '處理中',
        client: client.value,
        contents: data.value,
        payment: payment.value,
        accountLastFive: accountLastFive.value,
        ship: ship.value,
        orderNumber: orderNumber.value
      }, 'create')
      const [res] = await callCreateFetch({ ...payload })
      if (res) goBack()
    }
  })
}

const onCheckout = async () => {
  form.value.validate().then(async (success) => {
    if (success) {
      const payload = {
        state: '已完成',
        isPaid: '已完成',
        isShipped: '已完成',
        client: client.value,
        contents: data.value,
        payment: payment.value,
        accountLastFive: accountLastFive.value,
        ship: ship.value,
        orderNumber: orderNumber.value
      }
      const [res] = await callCreateFetch({ ...payload })
      if (res) goBack()
    }
  })
}

const onDelete = async (row) => {
  const res = await messageDelete({
    title: '刪除',
    message: '確認刪除商品？',
    confirmButtonText: '確認',
    cancelButtonText: '取消'
  })

  const index = data.value.findIndex(item => item.id === row.id)
  if (index > -1) {
    data.value.splice(index, 1)
    data.value = [...data.value]
  }
  if (!res) return
}

const { dataTable, data } =
  useVxeServerDataTable({
    sessionStorageKey: 'dashboardMaterialDetailServerDataTable'
  })

const { goBack } = useGoBack()
const { messageDelete } = useMessageDialog()
const {
  form,
  callCreateFetch,
} = useCRUD({
  createFetch: createFetch,
  readListFetch: readProductFetch
})
</script>

<style lang="scss" scoped>
.product-btn {
  margin-right: 10px;
}
</style>

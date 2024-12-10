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
                  <text-input v-model="rows.client.name" label="姓名" placeholder="請輸入姓名"
                    :required="isDeliveryRequired" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <text-input v-model="rows.client.tel" label="電話" placeholder="請輸入電話" :maxLength="10"
                    :required="isDeliveryRequired" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <text-input v-model="rows.client.address" label="地址" placeholder="請輸入地址"
                    :required="isDeliveryRequired" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <text-input v-model="rows.client.remark" label="備註" placeholder="請輸入備註" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <q-card class="h-full shadow-7">
            <card-body>
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-md-6 col-12">
                  <option-group v-model="rows.salesperson" label="銷售員" :options="selectedSalesperson" type="radio"
                    class="full-width" />
                </div>
              </div>
            </card-body>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <option-group v-model="rows.payment" label="交易方式" :options="selectedPaymentMethod" type="radio"
                    class="full-width" />
                </div>
                <div v-if="rows.payment === '轉帳'" class="q-mt-md col-md-6 col-sm-12 col-xs-12">
                  <text-input v-model="rows.accountLastFive" label="帳號後五碼" placeholder="請輸入帳號後五碼" :required="true"
                    :maxLength="5" :minLength="5" />
                </div>
              </div>
            </card-body>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-md-6 col-12">
                  <option-group v-model="rows.delivery" label="出貨方式" :options="selectedDeliveryMethod" type="radio"
                    class="full-width" />
                </div>
                <div v-if="rows.delivery === '宅配'" class="q-mt-md col-md-6 col-sm-12 col-xs-12">
                  <text-input v-model="rows.deliveryNumber" label="貨運單號" placeholder="請輸入貨運單號" :required="true" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <q-card class="h-full shadow-7">
            <card-header> 選擇商品 </card-header>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-12">
                  <base-button v-for="item in productData" :label="item.productTitle" :outline="true" :rounded="true"
                    @click="addNewData(item)" class="product-btn" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <q-card class="h-full shadow-7">
            <card-header> 訂單明細
              <template #action>
                <q-chip outline color="red" icon="fa-solid fa-sack-dollar">
                  總金額: {{ totalAmount }}
                </q-chip>
              </template>
            </card-header>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-12">
                  <q-btn-toggle v-model="switchStyle" no-caps rounded class="q-mb-sm" toggle-color="primary"
                    color="white" text-color="primary" :options="[
                    { label: '條列式', value: 'columnType' },
                    { label: '網格式', value: 'gridType' }
                  ]" />
                  <div v-if="switchStyle === 'gridType'">
                    <editable-grid-table :columns="columns" :rows="rows.productItems">
                      <template #action="{ row }">
                        <delete-icon-button @click="onDelete(row)" />
                      </template>
                    </editable-grid-table>
                  </div>
                  <div v-else>

                    <popup-data-table :columns="columns" :rows="rows.productItems">
                      <template #props="{ row }">
                        <delete-icon-button @click="onDelete(row)" />
                      </template>
                    </popup-data-table>
                  </div>
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
      </div>
    </base-form>
  </q-page>
  <div class="row productItems-center">
    <fixed-footer @save="onSubmit">
      <template #button>
        <confirm-button v-if="rows.payment === '現金' && rows.delivery === '面交'" @click="onCheckout" label="結帳"
          color="red" class="q-px-lg q-mr-md" />
      </template>
    </fixed-footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { addData } from '@/api/order'
import { getList } from '@/api/product'
import useCRUD from '@/hooks/useCRUD'
import useGoBack from '@/hooks/useGoBack'
import useMessageDialog from '@/hooks/useMessageDialog'
import useNotify from '@/hooks/useNotify'

const { notifyAPIError } = useNotify()
const switchStyle = ref('gridType')
const productData = ref([])
const rows = ref({
  client: {
    name: '',
    tel: '',
    address: '',
    remark: ''
  },
  productItems: []
})

watch(rows.value.productItems, (newVal) => {
  newVal.forEach((item) => {
    item.subtotal = item.productQuantity * item.productPrice
  })
},
  { deep: true })

const columns = [
  {
    name: 'productTitle',
    label: '項目',
    field: 'productTitle',
    align: 'center'
  },
  {
    name: 'productQuantity',
    label: '數量',
    field: 'productQuantity',
    align: 'center',
    isPopupEdit: true
  },
  {
    name: 'productPrice',
    label: '售價',
    field: 'productPrice',
    align: 'center'
  },
  {
    name: 'subtotal',
    label: '小計',
    field: (row) => row.productQuantity * row.productPrice,
    align: 'center'
  },
]

const selectedPaymentMethod = ref([
  { label: '現金', value: '現金' },
  { label: '轉帳', value: '轉帳' }
])

const selectedDeliveryMethod = ref([
  { label: '面交', value: '面交' },
  { label: '外送', value: '外送' },
  { label: '宅配', value: '宅配' }
])

const selectedSalesperson = ref([
  { label: '正發', value: '正發' },
  { label: '茮林', value: '茮林' },
  { label: '宥延', value: '宥延' }
])

onMounted(async () => {
  readProductFetch()
})

const addNewData = async (item) => {
  const isDuplicate = rows.value.productItems.some((row) => row.productTitle === item.title)

  if (isDuplicate) {
    notifyAPIError({ message: '已有 ' + `${item.productTitle}` + ' 商品了' })
    return
  }
  rows.value.productItems.push({
    id: item.id,
    productTitle: item.productTitle,
    productPrice: item.productPrice,
    productQuantity: 1
  })
}

const createFetch = async (payload) => {
  return await addData(payload)
}

const readProductFetch = async () => {
  const res = await getList()
  productData.value = res.map((item) => ({
    id: item.id,
    productTitle: item.title,
    productPrice: item.price
  }))
}

const onSubmit = async () => {
  rows.value.state = '處理中'
  rows.value.isPaid = '未收款'
  rows.value.isDelivered = '未出貨'

  form.value.validate().then(async (success) => {
    if (success) {
      const payload =
      {
        ...rows.value,
        client: rows.value.client,
        productItems: rows.value.productItems,
      }
      const [res] = await callCreateFetch({ ...payload })
      if (res) goBack()
    }
  })
}

const onCheckout = async () => {
  rows.value.state = '已完成'
  rows.value.isPaid = '已收款'
  rows.value.isDelivered = '已出貨'

  form.value.validate().then(async (success) => {
    if (success) {
      const payload =
      {
        ...rows.value,
        client: rows.value.client,
        productItems: rows.value.productItems,
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
  if (!res) return

  const index = rows.value.productItems.indexOf(row)
  if (index !== -1) {
    rows.value.productItems.splice(index, 1)
  }
  await callDeleteFetch()
}

const totalAmount = computed(() => {
  return rows.value.productItems.reduce((sum, item) => {
    return sum + item.productQuantity * item.productPrice
  }, 0)
})

// 選外送和宅配時姓名、電話和地址必填
const isDeliveryRequired = computed(() => {
  return rows.value.delivery === '外送' || rows.value.delivery === '宅配'
})

const { goBack } = useGoBack()
const { messageDelete } = useMessageDialog()
const { form, callCreateFetch, callDeleteFetch } = useCRUD({
  createFetch: createFetch,
  readListFetch: readProductFetch
})
</script>

<style lang="scss" scoped>
.product-btn {
  margin: 2px;
}
</style>

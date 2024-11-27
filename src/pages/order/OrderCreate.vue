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
                  <text-input v-model="rows.client.name" label="姓名" placeholder="請輸入姓名" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <text-input v-model="rows.client.tel" label="電話" placeholder="請輸入電話" :maxLength="10" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <text-input v-model="rows.client.address" label="地址" placeholder="請輸入地址" />
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
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <option-group v-model="rows.payment" label="交易方式" :options="selectedPaymentMethod" type="radio"
                    class="full-width" />
                </div>
                <div v-if="rows.payment === '轉帳'" class="q-mt-md col-md-6 col-sm-12 col-xs-12">
                  <text-input v-model="rows.accountLastFive" label="帳號後五碼" placeholder="請輸入帳號後五碼" :required="true" />
                </div>
              </div>
            </card-body>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-md-6 col-12">
                  <option-group v-model="rows.ship" label="出貨方式" :options="selectedShippingMethod" type="radio"
                    class="full-width" />
                </div>
                <div v-if="rows.ship === '宅配'" class="q-mt-md col-md-6 col-sm-12 col-xs-12">
                  <text-input v-model="rows.orderNumber" label="貨運單號" placeholder="請輸入貨運單號" :required="true" />
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
                  <base-button v-for="item in productData" :label="item.title" :outline="true" :rounded="true"
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
                <span class="text-20px text-bold text-red outline rounded q-pa-xs">總金額: {{ totalAmount }}</span>
              </template>
            </card-header>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-12">
                  <toggle-input v-model="switchStyle" :label="switchStyle ? '網格式' : '條列式'" />
                  <div v-if="switchStyle">
                    <grid-table :columns="columns" :rows="rows.contents">
                      <template #action="{ row }">
                        <delete-icon-button @click="onDelete(row)" />
                      </template>
                    </grid-table>
                  </div>
                  <div v-else>
                    <popup-data-table :columns="columns" :rows="rows.contents">
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
  <div class="row items-center">
    <fixed-footer @save="onSubmit">
      <template #button>
        <confirm-button v-if="rows.payment === '現金' && rows.ship === '面交'" @click="onCheckout" label="結帳" color="red"
          class="q-px-lg q-mr-md" />
      </template>
    </fixed-footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { addData } from '@/api/order'
import { getList } from '@/api/product'
import { updateDates } from '@/utils/dateHandler'
import useCRUD from '@/hooks/useCRUD'
import useGoBack from '@/hooks/useGoBack'
import useMessageDialog from '@/hooks/useMessageDialog'
import useNotify from '@/hooks/useNotify'

const { notifyAPIError } = useNotify()
const switchStyle = ref(true)
const productData = ref([])
const rows = ref({
  client: {
    name: '',
    tel: '',
    address: '',
    remark: ''
  },
  contents: []
})

watch(rows.value.contents, (newVal) => {
  newVal.forEach((item) => {
    item.subtotal = item.quantity * item.price
  })
},
  { deep: true })

const columns = [
  {
    name: 'title',
    label: '項目',
    field: 'title',
    align: 'center'
  },
  {
    name: 'quantity',
    label: '數量',
    field: 'quantity',
    align: 'center',
    isPopupEdit: true
  },
  {
    name: 'price',
    label: '售價',
    field: 'price',
    align: 'center',
    isPopupEdit: true
  },
  {
    name: 'subtotal',
    label: '小計',
    field: (row) => row.quantity * row.price,
    align: 'center',
    isPopupEdit: true
  },
]

const selectedPaymentMethod = ref([
  { label: '現金', value: '現金' },
  { label: '轉帳', value: '轉帳' }
])

const selectedShippingMethod = ref([
  { label: '面交', value: '面交' },
  { label: '外送', value: '外送' },
  { label: '宅配', value: '宅配' }
])

onMounted(async () => {
  readProductFetch()
})

const addNewData = async (item) => {
  const isDuplicate = rows.value.contents.some((row) => row.title === item.title)

  if (isDuplicate) {
    notifyAPIError({ message: '已有 ' + `${item.title}` + ' 商品了' })
    return
  }
  rows.value.contents.push({
    id: item.id,
    title: item.title,
    price: item.price,
    quantity: 1
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
  rows.value.state = '處理中'
  rows.value.isPaid = '未付款'
  rows.value.isShipped = '未出貨'

  form.value.validate().then(async (success) => {
    if (success) {
      const payload = updateDates(
        {
          ...rows.value,
          client: rows.value.client,
          contents: rows.value.contents,
        },
        'create'
      )
      const [res] = await callCreateFetch({ ...payload })
      if (res) goBack()
    }
  })
}

const onCheckout = async () => {
  rows.value.state = '已完成'
  rows.value.isPaid = '已完成'
  rows.value.isShipped = '已完成'

  form.value.validate().then(async (success) => {
    if (success) {
      const payload = updateDates(
        {
          ...rows.value,
          client: rows.value.client,
          contents: rows.value.contents,
        },
        'create'
      )
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

  const index = rows.value.contents.indexOf(row)
  if (index !== -1) {
    rows.value.contents.splice(index, 1)
  }
  await callDeleteFetch()
}

const totalAmount = computed(() => {
  return rows.value.contents.reduce((sum, item) => {
    return sum + item.quantity * item.price
  }, 0)
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

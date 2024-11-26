<template>
  <q-page class="q-pa-lg">
    <page-header showPrev> 原物料紀錄詳情 </page-header>
    <base-form ref="form">
      <div class="row q-col-gutter-x-md q-col-gutter-y-md">
        <div class="col-md-6 col-sm-6 col-xs-12">
          <q-card class="h-full shadow-7">
            <card-header> 日期及備註 </card-header>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <date-input v-model="rows.date" class="w-full" label="日期 *" placeholder="請選擇日期"
                    :rules="[$rules.required('日期必填')]" />
                </div>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <text-input v-model="rows.remark" class="w-full" label="備註" placeholder="請輸入備註" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <q-card class="h-full shadow-7">
            <card-header> 原物料選擇 </card-header>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-12">
                  <base-button v-for="item in materialCategoryData" :label="item.title" :outline="true" :rounded="true"
                    @click="addNewData(item)" class="classification-btn" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
        <div class="col-12">
          <q-card class="h-full shadow-7">
            <card-header> 原物料明細 </card-header>
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
  <fixed-footer @save="onSubmit" />
</template>

<script setup>
import { defineProps, ref, toRefs, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getData, addData, updateData } from '@/api/materialRecord'
import { getList } from '@/api/materialCategory'
import { updateDates } from '@/utils/dateHandler'
import { initializeDates } from '@/utils/dateHandler'
import useCRUD from '@/hooks/useCRUD'
import useGoBack from '@/hooks/useGoBack'
import useMessageDialog from '@/hooks/useMessageDialog'
import useNotify from '@/hooks/useNotify'

const props = defineProps({
  mode: { type: String, required: true }
})

const { mode } = toRefs(props)
const { notifyAPIError } = useNotify()
const route = useRoute()
const rows = ref({
  contents: []
})
const materialCategoryData = ref([])
const switchStyle = ref(true)
const id = route.params.id || null

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
    name: 'unit',
    label: '單位',
    field: 'unit',
    align: 'center'
  },
  {
    name: 'total',
    label: '總額',
    field: 'total',
    align: 'center',
    isPopupEdit: true
  }
]

onMounted(async () => {
  readListMaterialCategoryFetch()

  if (id) {
    refreshReadData(id)
  }
})

const addNewData = async (item) => {
  const isDuplicate = rows.value.contents.some((row) => row.id === item.id)

  if (isDuplicate) {
    notifyAPIError({ message: '已有 ' + `${item.title}` + ' 原物料了' })
    return
  }

  rows.value.contents.push({
    id: item.id,
    title: item.title,
    quantity: 0,
    unit: item.unit,
    total: 0
  })
}

const readFetch = async (id) => {
  return await getData(id)
}

const createFetch = async (payload) => {
  return await addData(payload)
}

const updateFetch = async (id, payload) => {
  return await updateData(id, payload)
}

const readListMaterialCategoryFetch = async () => {
  const res = await getList()
  materialCategoryData.value = res.map((item) => ({
    id: item.id,
    title: item.title,
    unit: item.unit
  }))
}

const refreshReadData = async (id) => {
  const [res] = await callReadFetch(id)
  if (res) {
    rows.value = initializeDates(res)
    if (!rows.value.contents) {
      rows.value.contents = []
    }
  }
}

const onSubmit = async () => {
  rows.value.remark = rows.value.remark?.trim() || '無'

  form.value.validate().then(async (success) => {
    if (success) {
      const payload = updateDates(
        {
          ...rows.value,
          contents: rows.value.contents
        },
        mode.value
      )
      const urlObj = {
        create: () => {
          return callCreateFetch({ ...payload })
        },
        edit: () => {
          return callUpdateFetch(id, { ...payload })
        }
      }
      const [res] =
        mode.value === 'create' ? await urlObj.create() : await urlObj.edit()
      if (res) goBack()
    }
  })
}

const onDelete = async (row) => {
  const res = await messageDelete({
    title: '刪除',
    message: '確認刪除原物料？',
    confirmButtonText: '確認',
    cancelButtonText: '取消'
  })
  if (!res) return

  const index = rows.value.indexOf(row)
  if (index !== -1) {
    rows.value.splice(index, 1)
  }
  await callDeleteFetch()
}

const { goBack } = useGoBack()
const { messageDelete } = useMessageDialog()
const {
  form,
  callReadFetch,
  callCreateFetch,
  callUpdateFetch,
  callDeleteFetch
} = useCRUD({
  readFetch: readFetch,
  createFetch: createFetch,
  updateFetch: updateFetch,
  readListFetch: readListMaterialCategoryFetch
})
</script>

<style lang="scss" scoped>
.classification-btn {
  margin-right: 10px;
}
</style>

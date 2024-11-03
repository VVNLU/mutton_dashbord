<template>
  <q-page class="q-pa-lg">
    <page-header showPrev> 原物料紀錄詳情 </page-header>
    <base-form ref="form">
      <div class="row q-col-gutter-x-md q-col-gutter-y-md">
        <div class="col-md-6 col-sm-6 col-xs-12">
          <q-card class="h-full shadow-7">
            <card-header> 製作日 </card-header>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <date-input v-model="date" class="w-full" label="日期 *" placeholder="請選擇日期"
                    :rules="[$rules.required('日期必填')]" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <q-card class="h-full shadow-7">
            <card-header> 原物料 </card-header>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-12">
                  <base-button v-for="item in materialClassificationData" :label="item.name" :outline="true"
                    :rounded="true" @click="addNewData(item)" class="classification-btn" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
        <div class="col-12">
          <q-card class="h-full shadow-7">
            <card-header> 原物料紀錄 </card-header>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-12">
                  <vxe-server-table ref="dataTable" :data="data">
                    <vxe-column title="項目" min_width="130">
                      <template #default="{ row }">
                        <div>{{ row.title }}</div>
                      </template>
                    </vxe-column>
                    <vxe-column title="數量" min_width="130">
                      <template #default="{ row }">
                        <number-input v-model="row.quantity" placeholder="請輸入數量" />
                      </template>
                    </vxe-column>
                    <vxe-column title="單位" min_width="130">
                      <template #default="{ row }">
                        <div>{{ row.unit }}</div>
                      </template>
                    </vxe-column>
                    <vxe-column title="總額" min_width="130">
                      <template #default="{ row }">
                        <number-input v-model="row.total" placeholder="請輸入總額" />
                      </template>
                    </vxe-column>
                    <vxe-column title="操作" fixed="right" width="115">
                      <template #default="{ rowIndex }">
                        <delete-icon-button class="q-mr-xs q-mb-xs" @click="onDelete(rowIndex)" />
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
  <fixed-footer @save="onSubmit" />
</template>

<script setup>
import { defineProps, ref, toRefs, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getData, addData, updateData, removeData } from '@/api/material'
import { getList } from '@/api/materialClassification'
import useCRUD from '@/hooks/useCRUD'
import useGoBack from '@/hooks/useGoBack'
import useVxeServerDataTable from '@/hooks/useVxeServerDataTable'
import useMessageDialog from '@/hooks/useMessageDialog'

const props = defineProps({
  mode: { type: String, required: true }
})

const { mode } = toRefs(props)
const route = useRoute()
const materialClassificationData = ref([])
const date = ref([])
const id = route.params.id || null

onMounted(async () => {
  readListMaterialClassificationFetch()

  if (id) {
    refreshReadData(id)
  }
})

const addNewData = async (item) => {
  data.value.push({
    title: item.name,
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

const delFetch = async (id, index) => {
  return await removeData(id, index)
}

const readListMaterialClassificationFetch = async () => {
  const res = await getList()
  materialClassificationData.value = res.map((item) => ({
    name: item.name,
    unit: item.unit
  }))
}

const refreshReadData = async (id) => {
  const [res] = await callReadFetch(id)
  data.value = res.contents
  date.value = res.date
}

const onSubmit = async () => {
  form.value.validate().then(async (success) => {
    if (success) {
      const payload = {
        date: date.value,
        contents: data.value
      }
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

const onDelete = async (rowIndex) => {
  const res = await messageDelete({
    title: '刪除',
    message: '確認刪除原物料？',
    confirmButtonText: '確認',
    cancelButtonText: '取消'
  })
  if (!res) return

  // 判斷資料是否為已存在
  const [getDataRes] = await callReadFetch(id)
  if (rowIndex <= getDataRes.contents.length - 1) {
    const delRes = await callDeleteFetch(id, rowIndex)
    if (delRes) {
      await refreshReadData(id)
    }
  } else {
    data.value.splice(rowIndex, 1)
  }
}

const { dataTable, data } =
  useVxeServerDataTable({
    sessionStorageKey: 'dashboardMaterialDetailServerDataTable'
  })

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
  deleteFetch: delFetch,
  readListFetch: readListMaterialClassificationFetch
})
</script>

<style lang="scss" scoped>
.classification-btn {
  margin-right: 10px;
}
</style>

<template>
  <q-page class="q-pa-lg">
    <page-header showPrev> 商品詳情 </page-header>
    <base-form ref="form">
      <div class="row q-col-gutter-x-md q-col-gutter-y-md">
        <div class="col-md-6 col-sm-12 col-xs-12">
          <q-card class="h-full shadow-7">
            <card-header> 商品資訊 </card-header>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-md-6 col-sm-4 col-xs-12">
                  <text-input v-model="data.title" label="商品名稱" placeholder="請輸入商品名稱" :required="true" />
                </div>
                <div class="col-md-6 col-sm-4 col-xs-12">
                  <text-input v-model="data.depiction" label="商品敘述" placeholder="請輸入商品敘述" />
                </div>
                <div class="col-md-6 col-sm-4 col-xs-12">
                  <number-input v-model="data.price" label="售價" placeholder="請輸入商品售價" :required="true" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
        <div class="col-md-6 col-sm-12 col-xs-12">
          <q-card class="h-full shadow-7">
            <card-header> 商品原物料
              <template #action>
                <add-button @click="showDialog({})" />
              </template>
            </card-header>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-12">
                  <vxe-server-table ref="dataTable" :data="data.contents">
                    <vxe-column title="項目" min_width="130">
                      <template #default="{ row }">
                        <div>{{ row.name }}</div>
                      </template>
                    </vxe-column>
                    <vxe-column title="數量" min_width="130">
                      <template #default="{ row }">
                        <number-input v-model="row.quantity" placeholder="請輸入數量" />
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

    <product-dialog ref="dialog" v-model:detailData="data.contents" @save="handleSave" />

  </q-page>
  <fixed-footer @save="onSubmit" />
</template>

<script setup>
import { defineProps, ref, toRefs, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getData, addData, updateData } from '@/api/product'
import { initializeDates, updateDates } from '@/utils/dateHandler'
import useCRUD from '@/hooks/useCRUD'
import useGoBack from '@/hooks/useGoBack'
import useVxeServerDataTable from '@/hooks/useVxeServerDataTable'
import useMessageDialog from '@/hooks/useMessageDialog'
import ProductDialog from './ProductDialog.vue'

const props = defineProps({
  mode: { type: String, required: true }
})

const { mode } = toRefs(props)
const route = useRoute()
const id = route.params.id || null
const dialog = ref()

onMounted(async () => {
  if (id) {
    refreshReadData(id)
  }
})

const handleSave = (addData) => {
  data.value.contents = addData
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

const refreshReadData = async (id) => {
  const [res] = await callReadFetch(id)
  data.value = initializeDates(res)
  data.value.contents = Array.isArray(data.value.contents) ? data.value.contents : [data.value.contents]
}

const onSubmit = async () => {
  form.value.validate().then(async (success) => {
    if (success) {
      const payload = updateDates({ ...data.value, contents: data.value.contents }, mode.value)
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

  const index = data.value.contents.findIndex(item => item.uniqueItem === row.uniqueItem)
  if (index > -1) {
    data.value.contents.splice(index, 1)
    data.value.contents = [...data.value.contents]
  }
}

const showDialog = () => {
  dialog.value.showDialog({ data: data.value.contents })
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
} = useCRUD({
  readFetch: readFetch,
  createFetch: createFetch,
  updateFetch: updateFetch,
})

watch(
  () => data.value.contents,
  (newContents) => {
    if (dialog.value) {
      dialog.value.$emit('update:detailData', newContents)
    }
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.classification-btn {
  margin-right: 10px;
}
</style>

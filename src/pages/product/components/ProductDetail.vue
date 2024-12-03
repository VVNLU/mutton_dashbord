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
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <text-input v-model="rows.title" label="商品名稱" placeholder="請輸入商品名稱" :required="true" />
                </div>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <text-input v-model="rows.depiction" label="商品敘述" placeholder="請輸入商品敘述" />
                </div>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <number-input v-model="rows.price" label="售價" placeholder="請輸入商品售價" :required="true" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
        <div class="col-md-6 col-sm-12 col-xs-12">
          <q-card class="h-full shadow-7">
            <card-header>
              商品原物料
              <template #action>
                <add-button @click="showDialog({})" />
              </template>
            </card-header>
            <card-body>
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-12">
                  <q-btn-toggle v-model="switchStyle" no-caps rounded class="q-mb-sm" toggle-color="primary"
                    color="white" text-color="primary" :options="[
                    { label: '條列式', value: 'columnType' },
                    { label: '網格式', value: 'gridType' }
                  ]" />
                  <data-table v-if="switchStyle === 'gridType'" grid :columns="columns" :rows="rows.contents" />
                  <data-table v-else :columns="columns" :rows="rows.contents" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
      </div>
    </base-form>

    <product-dialog ref="dialog" v-model:detailData="rows.contents" @save="handleSave" />
  </q-page>
  <fixed-footer @save="onSubmit" />
</template>

<script setup>
import { defineProps, ref, toRefs, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getData, addData, updateData } from '@/api/product'
import useCRUD from '@/hooks/useCRUD'
import useGoBack from '@/hooks/useGoBack'
import ProductDialog from './ProductDialog.vue'

const props = defineProps({
  mode: { type: String, required: true }
})

const { mode } = toRefs(props)
const route = useRoute()
const id = route.params.id || null
const dialog = ref()
const rows = ref([])
const switchStyle = ref('gridType')

const columns = [
  {
    name: 'material_title',
    label: '項目',
    field: 'material_title',
    align: 'left'
  },
  {
    name: 'material_quantity',
    label: '數量',
    field: 'material_quantity',
    align: 'left',
    isPopupEdit: true
  },
]

onMounted(async () => {
  if (id) {
    refreshReadData(id)
  }
})

const handleSave = (addData) => {
  rows.value.contents = addData
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

  rows.value = res
  rows.value.contents = Array.isArray(rows.value.contents)
    ? rows.value.contents
    : [rows.value.contents]
}

const onSubmit = async () => {
  form.value.validate().then(async (success) => {
    if (success) {
      const payload =
      {
        ...rows.value,
        contents: rows.value.contents
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

const showDialog = () => {
  dialog.value.showDialog({ rows: rows.value.contents })
}

const { goBack } = useGoBack()
const { form, callReadFetch, callCreateFetch, callUpdateFetch } = useCRUD({
  readFetch: readFetch,
  createFetch: createFetch,
  updateFetch: updateFetch
})

watch(
  () => rows.value.contents,
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

<template>
  <q-page class="q-pa-lg">
    <page-header showPrev>
      輪播圖詳情
      <template #action>
        <toggle-input v-model="formData.is_enable" class="q-mr-xs" :label="formData.is_enable ? '啟用' : '不啟用'" />
        <toggle-input v-model="formData.is_link_blank" class="q-mr-xs"
          :label="formData.is_link_blank ? '另開視窗' : '不另開視窗'" />
      </template>
    </page-header>
    <base-form ref="form">
      <div class="row q-col-gutter-x-md q-col-gutter-y-md">
        <div class="col-xs-12 col-sm-12 col-md-6">
          <q-card class="h-full shadow-7">
            <card-header>
              輪播圖資訊
            </card-header>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-12 col-md-6">
                  <text-input v-model="formData.title" class="w-full" label="標題" placeholder="請輸入標題" />
                </div>
                <div class="col-12 col-md-6">
                  <number-input v-model="formData.sequence" class="w-full" label="排序 *" placeholder="請輸入排序" />
                </div>
                <div class="col-12 col-md-6">
                  <date-input v-model="formData.publish_date" class="w-full" label="上架日期 *" placeholder="請選擇上架日期"
                    :rules="[$rules.required('上架日期必填')]" />
                </div>
                <div class="col-12 col-md-6">
                  <date-input v-model="formData.closed_date" class="w-full" label="下架日期" placeholder="請選擇上架日期"
                    hint="預設為永遠" :rules="[$rules.dayjIsSameOrAfter(formData.publish_date, '必須比上架時間晚', 'YYYY/MM/DD')]" />
                </div>
                <div class="col-12 col-md-6">
                  <text-input v-model="formData.summary" class="w-full" label="簡述" placeholder="請輸入簡述" />
                </div>
                <div class="col-12 col-md-6">
                  <url-input v-model="formData.link" class="w-full" label="連結" placeholder="請輸入連結" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6">
          <q-card class="h-full shadow-7">
            <card-header>
              上傳圖片
            </card-header>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-md ">
                <div class="col-12">
                  <image-input v-model="formData.imageObj" class="w-full" label="輪播圖圖片" :aspect="2000 / 500"
                    :rules="[$rules.required('圖片必填')]" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
      </div>
    </base-form>
  </q-page>
  <fixed-footer @save="onSubmit" :confirmButtonText="'送出'" :cancelButtonText="'取消'" />
</template>

<script setup>
import { defineProps, ref, toRefs, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import { getData, addData, updateData } from '@/api/carousel'
import Carousel from '@/class/Carousel'
import useCRUD from '@/hooks/useCRUD'
import useGoBack from '@/hooks/useGoBack'

const props = defineProps({
  mode: { type: String, required: true },
})

const { mode } = toRefs(props)
const route = useRoute()
const formData = ref(new Carousel())
const id = route.params.id || null

onMounted(async () => {
  if (id) {
    const [res] = await callReadFetch(id)
    formData.value = res
    if (formData.value.imageUrl) {
      formData.value.imageObj = { ...formData.value.imageObj, url: formData.value.imageUrl, title: formData.value.image_title, alt: formData.value.image_alt }
    }
  }
})

const readFetch = async (id) => {
  return await getData(id)
}

const createFetch = async (payload) => {
  return await addData(payload)
}

const updateFetch = async (id, payload) => {
  return await updateData(id, payload)
}

const onSubmit = async () => {
  form.value.validate().then(async (success) => {
    if (success) {
      const payload = { ...formData.value }
      const { title, alt } = formData.value.imageObj
      const urlObj = {
        create: () => { return callCreateFetch({ ...payload }) },
        edit: () => { return callUpdateFetch(id, { ...payload }) }
      }
      payload.image_title = title
      payload.image_alt = alt
      const [res] = mode.value === 'create' ? await urlObj.create() : await urlObj.edit()
      if (res) goBack()
    }
  })
}

const { goBack } = useGoBack()
const { form, callReadFetch, callCreateFetch, callUpdateFetch } = useCRUD({
  readFetch: readFetch,
  createFetch: createFetch,
  updateFetch: updateFetch,
})
</script>
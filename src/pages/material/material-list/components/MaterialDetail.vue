<template>
  <q-page class="q-pa-lg">
    <page-header showPrev>
      原物料詳情
    </page-header>
    <base-form ref="form">
      <div class="row q-col-gutter-x-md q-col-gutter-y-md">
        <div class="col-12">
          <q-card class="h-full shadow-7">
            <card-header>
              原物料資訊
            </card-header>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-md-4 col-sm-6 col-xs-12">
                  <date-input v-model="formData.publish_date" class="w-full" label="日期 *" placeholder="請選擇日期"
                    :rules="[$rules.required('日期必填')]" />
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
import { defineProps, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router'
import { getData, addData, updateData } from '@/api/material'
import Material from '@/class/Material'
import useCRUD from '@/hooks/useCRUD'
import useGoBack from '@/hooks/useGoBack'

const props = defineProps({
  mode: { type: String, required: true },
})

const { mode } = toRefs(props)
const route = useRoute()
const formData = ref(new Material())
const id = route.params.id || null

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
      const payload = formData.value
      const urlObj = {
        create: () => { return callCreateFetch({ ...payload }) },
        edit: () => { return callUpdateFetch(id, { ...payload }) }
      }
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

<style lang="scss" scoped></style>
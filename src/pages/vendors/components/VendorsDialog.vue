<template>
  <base-dialog
    v-model="isShowDialog"
    title="進銷存明細"
    :confirmButtonText="'送出'"
    :cancelButtonText="'取消'"
    @save="onSave"
    @hide="onHide"
  >
    <base-form ref="form">
      <div class="row q-col-gutter-x-md">
        <div class="row q-col-gutter-x-md">
          <div class="col-xs-12 col-sm-6 col-md-6">
            <text-input
              v-model="data.state.title"
              class="full-width"
              label="公司名稱 *"
              placeholder="請輸入公司名稱"
              :modelValue="null"
              :required="true"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6">
            <text-input
              v-model="data.state.name"
              class="full-width"
              label="聯絡人 *"
              placeholder="請輸入聯絡人"
              :modelValue="null"
              :required="true"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6">
            <text-input
              v-model="data.state.tel"
              class="full-width"
              label="聯絡電話 *"
              placeholder="請輸入聯絡電話"
              :modelValue="null"
              :required="true"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6">
            <text-input
              v-model="data.state.address"
              class="full-width"
              label="公司地址"
              placeholder="請輸入公司地址"
              :modelValue="null"
              :required="false"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6">
            <text-input
              v-model="data.state.supplies"
              class="full-width"
              label="供應品項 *"
              placeholder="請輸入供應品項"
              :modelValue="null"
              :required="true"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6">
            <text-input
              v-model="data.state.remark"
              class="full-width"
              label="備註"
              placeholder="請輸入備註"
              :modelValue="null"
              :required="false"
            />
          </div>
        </div>
      </div>
    </base-form>
  </base-dialog>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue-demi'
import { addData, getData, updateData } from '@/api/vendors'
import Vendors from '@/class/Vendors'
import useDialog from '@/hooks/useDialog'

export default defineComponent({
  emits: ['save'],
  setup(props, { emit }) {
    const readFetch = async (id) => {
      return await getData(id)
    }

    const createFetch = async (payload) => {
      return await addData(payload)
    }

    const updateFetch = async (id, payload) => {
      return await updateData(id, payload)
    }

    const onSave = async () => {
      const [res] = await save()
      if (res) emit('save')
    }

    const onHide = () => {
      data.reset()
    }

    // use
    const { form, data, isShowDialog, showDialog, save } = useDialog({
      formData: new Vendors(),
      createFetch: createFetch,
      readFetch: readFetch,
      updateFetch: updateFetch
    })

    return {
      form,
      data,
      isShowDialog,
      showDialog,
      onSave,
      onHide
    }
  }
})
</script>

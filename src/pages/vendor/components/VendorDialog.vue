<template>
  <base-dialog v-model="isShowDialog" title="供應商明細" :confirmButtonText="'送出'" :cancelButtonText="'取消'" @save="onSave"
    @hide="onHide">
    <base-form ref="form">
      <div class="row q-col-gutter-x-md">
        <div class="row q-col-gutter-x-md">
          <div class="col-xs-12 col-sm-6 col-md-6 ">
            <text-input v-model="data.state.title" class="full-width" label="公司名稱 *" placeholder="請輸入公司名稱"
              :required="true" />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6">
            <text-input v-model="data.state.contact" class="full-width" label="聯絡人 *" placeholder="請輸入聯絡人"
              :required="true" />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6">
            <text-input v-model="data.state.tel" class="full-width" label="聯絡電話 *" placeholder="請輸入聯絡電話"
              :required="true" :showNumberBox="true" />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6">
            <text-input v-model="data.state.address" class="full-width" label="公司地址" placeholder="請輸入公司地址"
              :required="false" />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6">
            <text-input v-model="data.state.remark" class="full-width" label="備註" placeholder="請輸入備註"
              :required="false" />
          </div>
        </div>
      </div>
    </base-form>
  </base-dialog>
</template>

<script>
import { defineComponent } from 'vue-demi'
import { addData, getData, updateData } from '@/api/vendor'
import Vendor from '@/class/Vendor'
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
      formData: new Vendor(),
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

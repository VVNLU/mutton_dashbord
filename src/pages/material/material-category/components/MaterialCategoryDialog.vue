<template>
  <base-dialog
    v-model="isShowDialog"
    title="分類詳情"
    :confirmButtonText="'送出'"
    :cancelButtonText="'取消'"
    @save="onSave"
    @hide="onHide"
  >
    <base-form ref="form">
      <div class="row q-col-gutter-x-md">
        <div class="col-xs-12 col-sm-6 col-md-6">
          <text-input
            v-model="data.state.title"
            class="full-width"
            label="分類名稱"
            placeholder="請輸入分類名稱"
            :rules="[$rules.required('分類名稱必填')]"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6">
          <text-input
            v-model="data.state.unit"
            class="full-width"
            label="單位"
            placeholder="請輸入分類單位"
            :rules="[$rules.required('分類單位必填')]"
          />
        </div>
      </div>
    </base-form>
  </base-dialog>
</template>

<script>
import { defineComponent } from 'vue-demi'
import Material from '@/class/MaterialCategory'
import useDialog from '@/hooks/useDialog'
import { getData, addData, updateData } from '@/api/materialCategory'
import { initializeDates, updateDates } from '@/utils/dateHandler'

export default defineComponent({
  emits: ['save'],
  setup(props, { emit }) {
    // methods
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
      data.state = updateDates(
        { ...data.state },
        mode.value === 'create' ? 'create' : 'edit'
      )
      const [res] = await save()
      if (res) {
        emit('save')
        data.state = initializeDates(new Vendor()) // 重置資料
      }
    }

    const onHide = () => {
      data.reset()
    }

    // use
    const { form, data, isShowDialog, showDialog, save, mode } = useDialog({
      formData: initializeDates(new Material()), // 初始化日期
      readFetch: readFetch,
      createFetch: createFetch,
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

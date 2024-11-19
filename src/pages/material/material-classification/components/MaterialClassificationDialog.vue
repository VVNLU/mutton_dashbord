<template>
  <base-dialog v-model="isShowDialog" title="分類詳情" :confirmButtonText="'送出'" :cancelButtonText="'取消'" @save="onSave"
    @hide="onHide">
    <base-form ref="form">
      <div class="row q-col-gutter-x-md">
        <div class="col-12">
          <text-input v-model="data.state.name" class="full-width" label="分類名稱" placeholder="請輸入分類名稱"
            :rules="[$rules.required('分類名稱必填')]" />
        </div>
        <div class="col-12">
          <text-input v-model="data.state.unit" class="full-width" label="單位" placeholder="請輸入分類單位"
            :rules="[$rules.required('分類單位必填')]" />
        </div>
        <div class="col-12">
          <number-input v-model="data.state.sequence" class="full-width" label="排序" placeholder="請輸入排序" />
        </div>
        <div class="col-12">
          <toggle-input v-model="data.state.is_enable" :label="data.state.is_enable ? '啟用' : '不啟用'" />
        </div>
      </div>
    </base-form>
  </base-dialog>
</template>

<script>
import { defineComponent } from 'vue-demi'
import Material from '@/class/MaterialClassification'
import useDialog from '@/hooks/useDialog'
import { getData, addData, updateData } from '@/api/materialClassification'
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
      data.state = updateDates(data.state, mode.value === 'create'?'create':'edit')
      const [res] = await save()
      if (res) emit('save')
    }

    const onHide = () => {
      data.reset()
    }

    // use
    const { form, data, isShowDialog, showDialog, save,mode } = useDialog({
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
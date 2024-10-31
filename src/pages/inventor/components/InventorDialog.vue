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
        <div class="col-12">
          <date-input v-model="data.state.date" class="full-width" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6">
          <number-input
            v-model="data.state.restock"
            class="full-width"
            label="進貨量"
            placeholder="請輸入進貨量"
            :modelValue="null"
            :required="false"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6">
          <number-input
            v-model="data.state.chongqing_market"
            class="full-width"
            label="銷貨量-重慶市場"
            placeholder="請輸入銷貨量"
            :modelValue="null"
            :required="false"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6">
          <number-input
            v-model="data.state.shiba_market"
            class="full-width"
            label="銷貨量-市八市場"
            placeholder="請輸入銷貨量"
            :modelValue="null"
            :required="false"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6">
          <number-input
            v-model="data.state.delivery"
            class="full-width"
            label="銷貨量-外送"
            placeholder="請輸入銷貨量"
            :modelValue="null"
            :required="false"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6">
          <number-input
            v-model="data.state.pick_up"
            class="full-width"
            label="銷貨量-自取"
            placeholder="請輸入銷貨量"
            :modelValue="null"
            :required="false"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6">
          <number-input
            v-model="data.state.gift"
            class="full-width"
            label="銷貨量-公關"
            placeholder="請輸入銷貨量"
            :modelValue="null"
            :required="false"
          />
        </div>
        <div class="col-12">
          <text-input
            v-model="data.state.remark"
            class="full-width"
            label="備註"
            placeholder="請輸入備註"
          />
        </div>
      </div>
    </base-form>
  </base-dialog>
</template>

<script>
import { defineComponent } from 'vue-demi'
import Inventor from '@/class/Inventor'
import useDialog from '@/hooks/useDialog'
import { getData, addData, updateData } from '@/api/inventor'

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
      const [res] = await save()
      if (res) emit('save')
    }

    const onHide = () => {
      data.reset()
    }

    // use
    const { form, data, isShowDialog, showDialog, save } = useDialog({
      formData: new Inventor(),
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

<!-- <script setup>
import Inventor from '@/class/Inventor.js'
import useDialog from '@/hooks/useDialog'

const emit = defineEmits(['save'])

const onSave = async () => {
  const [res] = await save()
  if (res) emit('save')
}

const onHide = async () => {
  data.reset()
}

const { form, data, isShowDialog, showDialog, save } = useDialog({
  formData: new Inventor()
})
</script> -->

<template>
  <base-dialog v-model="isShowDialog" title="原物料詳情" :confirmButtonText="'送出'" :cancelButtonText="'取消'" @save="onSave"
    @hide="onHide" :isReading="isReading">
    <base-form ref="form">
      <div class="row q-col-gutter-x-md q-col-gutter-y-md">
        <div class="col-12">
          <q-card class="h-full shadow-7">
            <card-header> 選擇供應商 </card-header>
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-12">
                  <q-btn v-for="item in vendorData" :key="item.vendor_id" :label="item.title" outline rounded
                    :text-color="selectedVendorId.includes(item.vendor_id) ? 'white' : 'primary'"
                    :class="[selectedVendorId.includes(item.vendor_id) ? 'bg-primary' : '', 'q-ma-xs']"
                    @click="toggleVendorSelection(item.vendor_id)" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
        <div class="col-12">
          <q-card class="shadow-7">
            <card-body>
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-xs-12 col-sm-6 col-md-6">
                  <text-input v-model="data.state.title" class="full-width" label="分類名稱" placeholder="請輸入分類名稱"
                    :rules="[$rules.required('分類名稱必填')]" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6">
                  <text-input v-model="data.state.unit" class="full-width" label="單位" placeholder="請輸入分類單位(ex: 克、斤、箱)"
                    :rules="[$rules.required('分類單位必填')]" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
      </div>
    </base-form>
  </base-dialog>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue-demi'
import Material from '@/class/MaterialCategory'
import useDialog from '@/hooks/useDialog'
import { getData, addData, updateData } from '@/api/materialCategory'
import { getList } from '@/api/vendor'
import { initializeDates, updateDates } from '@/utils/dateHandler'

export default defineComponent({
  emits: ['save'],
  setup(props, { emit }) {
    const isReading = ref(false)
    const vendorData = ref([])
    const selectedVendorId = ref([])

    onMounted(async () => {
      isReading.value = true
      await readListVendorDataFetch()
      isReading.value = false
    })

    // methods
    const readFetch = async (id) => {
      const res = await getData(id)
      data.state = initializeDates(res)
      selectedVendorId.value = res.vendorIds
    }

    const createFetch = async (payload) => {
      return await addData(payload)
    }

    const updateFetch = async (id, payload) => {
      return await updateData(id, payload)
    }

    const readListVendorDataFetch = async () => {
      const res = await getList()
      vendorData.value = res.map((item) => ({
        vendor_id: item.id,
        title: item.title
      }))
    }

    const toggleVendorSelection = (vendorId) => {
      const index = selectedVendorId.value.indexOf(vendorId)
      if (index === -1) {
        // 新增
        selectedVendorId.value.push(vendorId)
      } else {
        // 移除
        selectedVendorId.value.splice(index, 1)
      }
    }

    const onSave = async () => {
      data.state = updateDates(
        { ...data.state, vendorIds: selectedVendorId.value },
        mode.value === 'create' ? 'create' : 'edit'
      )
      const [res] = await save()
      if (res) {
        emit('save')
        selectedVendorId.value = []
        data.state = initializeDates(new Material()) // 重置資料
      }
    }

    const onHide = () => {
      data.reset()
    }

    // use
    const {
      form,
      data,
      isShowDialog,
      showDialog,
      save,
      mode
    } = useDialog({
      formData: initializeDates(new Material()), // 初始化日期
      readFetch: readFetch,
      createFetch: createFetch,
      updateFetch: updateFetch,
      readListFetch: readListVendorDataFetch
    })

    return {
      form,
      data,
      isShowDialog,
      showDialog,

      isReading,
      vendorData,
      selectedVendorId,

      toggleVendorSelection,
      onSave,
      onHide
    }
  }
})
</script>

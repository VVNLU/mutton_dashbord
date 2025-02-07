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
                  <q-btn v-for="item in vendorData" :key="item.vendorId" :label="item.vendorTitle" outline rounded
                    :text-color="data.state.vendors.some(vendor => vendor.id === item.vendorId) ? 'white' : 'primary'"
                    :class="[data.state.vendors.some(vendor => vendor.id === item.vendorId) ? 'bg-primary' : '', 'q-ma-xs']"
                    @click="toggleVendorSelection(item)" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
        <div class="col-12">
          <q-card class="shadow-7">
            <card-header>原物料資訊 </card-header>
            <card-body>
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-xs-12 col-sm-4 col-md-4">
                  <text-input v-model="data.state.title" class="full-width" label="原料名稱" placeholder="請輸入原料名稱"
                    :rules="[$rules.required('原料名稱必填')]" />
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4">
                  <text-input v-model="data.state.unit" class="full-width" label="最小單位" placeholder="請輸入最小單位(ex: 克、斤、箱)"
                    :rules="[$rules.required('最小單位必填')]" />
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4">
                  <number-input v-model="data.state.quantity" class="full-width" label="庫存" placeholder="請輸入庫存" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
        <div class="col-12">
          <q-card class="shadow-7">
            <card-header>單位設定
              <template #action>
                <add-button @click="addNewData()" />
              </template>
            </card-header>
            <card-body>
              <q-card flat bordered v-for="(item, index) in data.state.packages" :key="index"
                class="q-mb-xs full-width">
                <div class="q-pa-xs row items-center full-width">
                  <q-input dense label="單位名稱" v-model="item.unit" class="col-sm-4 col-xs-3" />
                  <span class="q-ma-xs col-1">＝</span>
                  <number-input label="比例" v-model="item.size" class="col-sm-4 col-xs-3" :outlined="false"
                    :dense="true" />
                  <q-chip>{{ data.state.unit }}</q-chip>
                  <delete-icon-button class="col-1" @click="onDelete(item)" />
                </div>
              </q-card>
              <div>
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
import { getData, addData, updateData } from '@/api/materialCategory'
import { getList } from '@/api/vendor'
import MaterialCategory from '@/class/MaterialCategory'
import useDialog from '@/hooks/useDialog'
import useNotify from '@/hooks/useNotify'
import useMessageDialog from '@/hooks/useMessageDialog'
import useCRUD from '@/hooks/useCRUD'

export default defineComponent({
  emits: ['save'],
  setup(props, { emit }) {
    const { notifyAPIError } = useNotify()

    const isReading = ref(false)
    const vendorData = ref([])

    onMounted(async () => {
      isReading.value = true
      await readListVendorDataFetch()
      isReading.value = false
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

    const readListVendorDataFetch = async () => {
      const res = await getList()
      vendorData.value = res.map((item) => ({
        vendorId: item.id,
        vendorTitle: item.title,
        vendorTel: item.tel
      }))
    }

    const addNewData = async () => {
      if (!data.state.unit) {
        return notifyAPIError({ message: '單位未設置，請先填寫最小單位' })
      }
      data.state.packages.push({
        unit: '',
        size: null,
      })
    }

    const toggleVendorSelection = (item) => {
      const index = data.state.vendors.findIndex(vendor => vendor.id === item.vendorId)
      if (index === -1) {
        // 新增
        data.state.vendors.push({ id: item.vendorId })
      } else {
        // 移除
        data.state.vendors.splice(index, 1)
      }
    }

    const onSave = async () => {
      const [res, error] = await save()
      if (res) emit('save')
    }

    const onDelete = async (item) => {
      const res = await messageDelete({
        title: '刪除',
        message: '確認刪除單位設定？',
        confirmButtonText: '確認',
        cancelButtonText: '取消'
      })
      if (!res) return

      const index = data.state.packages.indexOf(item)
      if (index !== -1) {
        data.state.packages.splice(index, 1)
      }
      await callDeleteFetch()
    }

    const onHide = () => {
      data.reset()
    }

    // use
    const { messageDelete } = useMessageDialog()
    const { callDeleteFetch } = useCRUD({})
    const {
      form,
      data,
      isShowDialog,
      showDialog,
      save,
    } = useDialog({
      formData: new MaterialCategory(),
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

      addNewData,
      toggleVendorSelection,
      onSave,
      onDelete,
      onHide
    }
  }
})
</script>

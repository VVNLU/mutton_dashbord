<template>
  <base-dialog v-model="isShowDialog" title="選取原物料" :confirmButtonText="'送出'" :cancelButtonText="'取消'" @save="onSave"
    @hide="onHide" :isReading="isReading">
    <base-form ref="form">
      <div class="row q-col-gutter-x-md q-col-gutter-y-md">
        <div class="col-12">
          <q-card class="h-full shadow-7">
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-12">
                  <base-button v-for="item in materialCategoryData" :label="item.title" :outline="true" :rounded="true"
                    @click="addNewData(item)" class="q-ma-xs" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
        <div class="col-12">
          <q-card class="shadow-7">
            <card-body>
              <q-btn-toggle v-model="switchStyle" no-caps rounded class="q-mb-sm" toggle-color="primary" color="white"
                text-color="primary" :options="[
    { label: '條列式', value: 'columnType' },
    { label: '網格式', value: 'gridType' }
  ]" />
              <div v-if="switchStyle === 'gridType'">
                <grid-table :columns="columns" :rows="rows">
                  <template #action="{ row }">
                    <delete-icon-button @click="onDelete(row)" />
                  </template>
                </grid-table>
              </div>
              <div v-else>
                <popup-data-table :columns="columns" :rows="rows">
                  <template #props="{ row }">
                    <delete-icon-button @click="onDelete(row)" />
                  </template>
                </popup-data-table>
              </div>
            </card-body>
          </q-card>
        </div>
      </div>
    </base-form>
  </base-dialog>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue-demi'
import { getList } from '@/api/materialCategory'
import useDialog from '@/hooks/useDialog'
import useMessageDialog from '@/hooks/useMessageDialog'
import useNotify from '@/hooks/useNotify'
import useCRUD from '@/hooks/useCRUD'

export default defineComponent({
  props: {
    detailData: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:detailData', 'save'],
  setup(props, { emit }) {
    const { notifyAPIError } = useNotify()

    const materialCategoryData = ref([])
    const rows = ref([])
    const switchStyle = ref('gridType')
    const isReading = ref(false)

    const columns = [
      {
        name: 'title',
        label: '項目',
        field: 'title',
        align: 'center'
      },
      {
        name: 'quantity',
        label: '數量',
        field: 'quantity',
        align: 'center',
        isPopupEdit: true
      },
    ]

    onMounted(async () => {
      isReading.value = true
      await readListMaterialCategoryFetch()
      isReading.value = false

      rows.value = [...props.detailData]
    })

    watch(
      () => props.detailData,
      (newVal) => {
        rows.value = [...newVal]
      }
    )

    const addNewData = async (item) => {
      const isDuplicate = rows.value.some((row) => row.material_id === item.id)

      if (isDuplicate) {
        notifyAPIError({ message: '已有 ' + `${item.title}` + ' 原物料了' })
        return
      }

      rows.value = [...rows.value, {
        material_id: item.id,
        title: item.title,
        quantity: 0,
      }]
    }

    const readListMaterialCategoryFetch = async () => {
      const res = await getList()
      materialCategoryData.value = res.map((item) => ({
        id: item.id,
        title: item.title
      }))
    }

    const onSave = async () => {
      const [res] = await save()
      if (res) {
        emit('save', rows.value)
      }
    }

    const onDelete = async (row) => {
      const res = await messageDelete({
        title: '刪除',
        message: '確認刪除原物料？',
        confirmButtonText: '確認',
        cancelButtonText: '取消'
      })
      if (!res) return

      const index = rows.value.indexOf(row)
      if (index !== -1) {
        rows.value.splice(index, 1)
      }
      await callDeleteFetch()
    }

    const onHide = () => {
      rows.value = [...props.detailData]
    }

    // use
    const { messageDelete } = useMessageDialog()

    const {
      form,
      isShowDialog,
      showDialog,
      save
    } = useDialog({
      readListFetch: readListMaterialCategoryFetch
    })

    const {
      callDeleteFetch
    } = useCRUD({})

    return {
      materialCategoryData,
      rows,
      columns,
      switchStyle,
      isReading,

      form,
      isShowDialog,
      showDialog,
      onSave,
      onDelete,
      onHide,

      addNewData
    }
  }
})
</script>
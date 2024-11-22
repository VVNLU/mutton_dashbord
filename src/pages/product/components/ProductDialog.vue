<template>
  <base-dialog v-model="isShowDialog" title="選取原物料" :confirmButtonText="'送出'" :cancelButtonText="'取消'" @save="onSave"
    @hide="onHide">
    <base-form ref="form">
      <div class="row q-col-gutter-x-md q-col-gutter-y-md">
        <div class="col-12">
          <q-card class="h-full shadow-7">
            <card-body class="q-pt-none">
              <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                <div class="col-12">
                  <base-button v-for="item in materialCategoryData" :label="item.name" :outline="true" :rounded="true"
                    @click="addNewData(item)" class="classification-btn" />
                </div>
              </div>
            </card-body>
          </q-card>
        </div>
        <div class="col-12">
          <q-card class="shadow-7">
            <vxe-server-table ref="dataTable" :data="data">
              <vxe-column title="項目" min_width="100">
                <template #default="{ row }">
                  <div>{{ row.name }}</div>
                </template>
              </vxe-column>
              <vxe-column title="數量" min_width="150">
                <template #default="{ row }">
                  <number-input v-model="row.quantity" placeholder="請輸入數量" label="數量" />
                </template>
              </vxe-column>
              <vxe-column title="操作" fixed="right" width="120">
                <template #default="{ row }">
                  <delete-icon-button class="q-mr-xs q-mb-xs" @click="onDelete(row)" />
                </template>
              </vxe-column>
            </vxe-server-table>
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
import useVxeServerDataTable from '@/hooks/useVxeServerDataTable'

export default defineComponent({
  props: {
    detailData: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:detailData', 'save'],
  setup(props, { emit }) {
    const materialCategoryData = ref([])

    onMounted(async () => {
      await readListMaterialCategoryFetch()

      data.value = [...props.detailData]
    })

    watch(
      () => props.detailData,
      (newVal) => {
        data.value = [...newVal]
      }
    )

    const addNewData = async (item) => {
      data.value.push({
        id: item.id,
        name: item.name,
        quantity: null,
        uniqueItem: Date.now() + Math.random() // 判斷項目重複時要刪除哪一個
      })
    }

    const readListMaterialCategoryFetch = async () => {
      const res = await getList()
      materialCategoryData.value = res.map((item) => ({
        id: item.id,
        name: item.name
      }))
    }

    const onSave = async () => {
      const [res] = await save()
      if (res) emit('save', data.value)
    }

    const onDelete = async (row) => {
      const res = await messageDelete({
        title: '刪除',
        message: '確認刪除原物料？',
        confirmButtonText: '確認',
        cancelButtonText: '取消'
      })
      if (!res) return
      const index = data.value.findIndex(item => item.uniqueItem === row.uniqueItem)
      data.value.splice(index, 1)
    }

    const onHide = () => {
      data.value = [...props.detailData]
    }

    // use
    const { messageDelete } = useMessageDialog()
    const { dataTable, data } =
      useVxeServerDataTable({
        sessionStorageKey: 'dashboardProductDialogServerDataTable'
      })

    const { form, isShowDialog, showDialog, save
    } = useDialog({
      readListFetch: readListMaterialCategoryFetch
    })

    return {
      materialCategoryData,

      dataTable,
      data,
      form,
      isShowDialog,
      showDialog,
      onSave,
      onDelete,
      onHide,

      addNewData,
    }
  }
})
</script>

<style lang="scss" scoped>
.classification-btn {
  margin-right: 10px;
}
</style>

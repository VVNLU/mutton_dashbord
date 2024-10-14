<template>
  <base-dialog v-model="isShowDialog" title="進銷存明細" :confirmButtonText="'送出'" :cancelButtonText="'取消'" @save="onSave"
    @hide="onHide">
    <base-form ref="form">
      <div class="row q-col-gutter-x-md">
        <div class="row q-col-gutter-x-md">
          <div v-for="{ name, is_enable, sequence } in sortedTableFields" :key="sequence"
            class="col-xs-12 col-sm-6 col-md-6" v-show="is_enable">
            <text-input v-model="data.state.info" class="full-width" :label="name" :placeholder="`請輸入${name}`"
              :modelValue="null" :required="true" />
          </div>
        </div>
      </div>
    </base-form>
  </base-dialog>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue-demi'
import { getList } from '@/api/vendorsClassification'
import { addData, getData, updateData } from '@/api/vendors'
import Vendors from '@/class/Vendors'
import useDialog from '@/hooks/useDialog'

export default defineComponent({
  emits: ['save'],
  setup(props, { emit }) {
    const tableFields = ref([])
    const formData = ref(new Vendors())

    onMounted(() => {
      readClassificationListFetch({})
    })

    // methods
    const readClassificationListFetch = async (payload) => {
      return await getList(payload)
        .then((res) => {
          tableFields.value = res
        })
    }

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
      const vendorName = tableFields.value.map(item => item.name)
      if (vendorName) {
        formData.value = vendorName
      }
      // const [res] = await save()
      // if (res) emit('save')
    }

    const onHide = () => {
      data.reset()
    }

    // computed
    const sortedTableFields = computed(() => {
      return tableFields.value.filter(field => field.is_enable).sort((a, b) => a.sequence - b.sequence)
    })


    // use
    const { form, data, isShowDialog, showDialog, save } = useDialog({
      readListFetch: readClassificationListFetch,
      createFetch: createFetch,
      readFetch: readFetch,
      updateFetch: updateFetch,
    })

    return {
      sortedTableFields,
      form,
      data,
      isShowDialog,
      showDialog,
      onSave,
      onHide,
    }
  },
})
</script>

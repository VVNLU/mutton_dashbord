import { useAsyncState } from '@vueuse/core'
import { useApp } from '@/stores/app.js'
import { ref, computed } from 'vue'

export default function useCRUD({
  createFetch,
  createSuccess = '新增成功',
  createFail = '新增失敗',
  isShowCreateSuccess = true,
  isShowCreateFail = true,

  readFetch,
  readSuccess = '讀取成功',
  readFail = '讀取失敗',
  isShowReadSuccess = true,
  isShowReadFail = true,

  updateFetch,
  updateSuccess = '更新成功',
  updateFail = '更新失敗',
  isShowUpdateSuccess = true,
  isShowUpdateFail = true,

  deleteFetch,
  deleteSuccess = '刪除成功',
  deleteFail = '刪除失敗',
  isShowDeleteSuccess = true,
  isShowDeleteFail = true,

  readListFetch,
  readListSuccess = '讀取列表成功',
  readListFail = '讀取列表失敗',
  isShowReadListSuccess = true,
  isShowReadListFail = true,
}) {
  const storeApp = useApp()
  const reqCreate = useAsyncState(createFetch, {}, { immediate: false })
  const reqRead = useAsyncState(readFetch, {}, { immediate: false })
  const reqUpdate = useAsyncState(updateFetch, {}, { immediate: false })
  const reqDelete = useAsyncState(deleteFetch, {}, { immediate: false })
  const reqReadList = useAsyncState(readListFetch, {}, { immediate: false })

  const form = ref()

  const isLoading = computed(
    () =>
      reqCreate.isLoading.value ||
      reqRead.isLoading.value ||
      reqUpdate.isLoading.value ||
      reqDelete.isLoading.value ||
      reqReadList.isLoading.value
  )
  const isCreate = computed(() => reqCreate.isLoading.value)
  const isReading = computed(() => reqRead.isLoading.value)
  const isUpdate = computed(() => reqUpdate.isLoading.value)
  const isDelete = computed(() => reqDelete.isLoading.value)
  const isReadList = computed(() => reqReadList.isLoading.value)

  return {
    form,
    isLoading,
    isCreate,
    isReading,
    isUpdate,
    isDelete,
    isReadList,
  }
}

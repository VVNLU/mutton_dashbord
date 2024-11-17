import { useAsyncState } from '@vueuse/core'
import { useApp } from '@/stores/app.js'
import { ref, computed } from 'vue'
import useNotify from './useNotify'

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
  isShowReadListFail = true
}) {
  const { notify, notifyAPIError } = useNotify()
  const storeApp = useApp()
  const reqCreate = useAsyncState(createFetch, {}, { immediate: false })
  const reqRead = useAsyncState(readFetch, {}, { immediate: false })
  const reqUpdate = useAsyncState(updateFetch, {}, { immediate: false })
  const reqDelete = useAsyncState(deleteFetch, {}, { immediate: false })
  const reqReadList = useAsyncState(readListFetch, {}, { immediate: false })

  const form = ref()

  const callCreateFetch = async (id = null, payload) => {
    storeApp.isLoading = true
    storeApp.isCreate = true
    const res = await reqCreate.execute(0, id, payload)

    const errorMsg = reqCreate.error.value

    if (errorMsg) {
      storeApp.isLoading = false
      storeApp.isCreate = false
      const message = JSON.stringify(errorMsg)

      isShowCreateFail && notifyAPIError({ message })
      return [null, errorMsg]
    } else {
      isShowCreateSuccess &&
        notify({ message: createSuccess, type: 'positive' })
      storeApp.isLoading = false
      storeApp.isCreate = false
      return [res || true, null]
    }
  }

  const callReadFetch = async (id = null, payload = null) => {
    storeApp.isLoading = true
    storeApp.isReading = true
    const res = await reqRead.execute(0, id, payload)

    const errorMsg = reqRead.error.value

    if (errorMsg) {
      storeApp.isLoading = false
      storeApp.isReading = false
      const message = JSON.stringify(errorMsg)
      isShowReadFail && notifyAPIError({ message })
      return [null, errorMsg]
    } else {
      storeApp.isLoading = false
      storeApp.isReading = false
      return [res, null]
    }
  }

  const callUpdateFetch = async (id, payload = null) => {
    storeApp.isLoading = true
    storeApp.isUpdate = true

    const res = await reqUpdate.execute(0, id, payload)

    const errorMsg = reqUpdate.error.value

    if (errorMsg) {
      storeApp.isLoading = false
      storeApp.isUpdate = false
      const message = JSON.stringify(errorMsg)
      isShowUpdateFail && notifyAPIError({ message })
      return [null, errorMsg]
    } else {
      isShowUpdateSuccess &&
        notify({ message: updateSuccess, type: 'positive' })
      storeApp.isLoading = false
      storeApp.isUpdate = false
      return [res || true, null]
    }
  }

  const callDeleteFetch = async (id, payload = null) => {
    storeApp.isLoading = true
    storeApp.isDelete = true
    const res = await reqDelete.execute(0, id, payload)

    const errorMsg = reqDelete.error.value

    if (errorMsg) {
      storeApp.isLoading = false
      storeApp.isDelete = false
      const message = JSON.stringify(errorMsg)
      isShowDeleteFail && notifyAPIError({ message })
      return [null, errorMsg]
    } else {
      isShowDeleteSuccess &&
        notify({ message: deleteSuccess, type: 'positive' })
      storeApp.isLoading = false
      storeApp.isDelete = false
      return [res || true, null]
    }
  }

  const callReadListFetch = async (id = null, payload = null) => {
    storeApp.isReadingList = true
    const res = await reqReadList.execute(0, id, payload)

    const errorMsg = reqReadList.error.value

    if (errorMsg) {
      storeApp.isReadingList = false
      const message = JSON.stringify(errorMsg)
      isShowReadListFail && notifyAPIError({ message })
      return [null, errorMsg]
    } else {
      storeApp.isReadingList = false
      return [res, null]
    }
  }

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
  const isReadingList = computed(() => reqReadList.isLoading.value)

  return {
    form,
    isLoading,
    isCreate,
    isReading,
    isUpdate,
    isDelete,
    isReadingList,
    callCreateFetch,
    callReadFetch,
    callUpdateFetch,
    callDeleteFetch,
    callReadListFetch
  }
}

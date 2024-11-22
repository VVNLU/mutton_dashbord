import { reactive, ref, onMounted } from 'vue-demi'
import useSessionStorage from './useSessionStorage'
import mapKeys from 'lodash-es/mapKeys'

export default function useVxeServerDataTable({
  searchParams = {}, // 搜尋參數的預設值
  sortParams = [], // 排序參數陣列 [{field:欄位, order:升降序}]
  unSessionStorageParams = [], // 不需要儲存於 sessionStorage 的參數 [{field:string}]
  sessionStorageKey = 'dashboardVxeServerDataTable',
  callback = () => { },
}) {
  // use
  const { setSessionStorage, getSessionStorage } = useSessionStorage()

  // data
  let sessionStorage = getSessionStorage(sessionStorageKey)
  const dataTable = ref([]) // 表格資料的參考物件
  const search = reactive({})
  const data = ref([]) // 資料內容
  const total = ref(0)
  const sort = ref([])
  const unSessionStorageParamsField = unSessionStorageParams.map((item) => item.field) // 不需要儲存在 sessionStorage 的欄位名列表

  // 變更頁碼
  const onChangePage = (page) => {
    search.page = page // 更新 search.page
    setSessionStorage(sessionStorageKey, { search, sort: sort.value }) // 將頁碼儲存到 sessionStorage
    if (callback && typeof (callback) === 'function') {
      callback()  // 再執行 callback
    }
  }

  // 每頁資料數變更
  const onChangePageSize = (pageSize) => {
    search.page_size = pageSize // 更新 search.page_size
    setSessionStorage(sessionStorageKey, { search, sort: sort.value })
    if (callback && typeof (callback) === 'function') {
      callback()
    }
  }

  // 篩選條件變更
  const onChangeFilter = () => {
    search.page = 1 // 每次篩選後將頁碼重置為 1
    setSessionStorage(sessionStorageKey, { search, sort: sort.value })
    if (callback && typeof (callback) === 'function') {
      callback()
    }
  }

  // 排序變更
  const OnChangeSort = async ({ sortList }) => {
    search.page = 1
    if (sortList.length > 0) {
      search.orderby = sortList.map((item) => `${item.field}:${item.order}`).join(',')
      sort.value = sortList
    } else {
      search.orderby = sortParams.map((item) => `${item.field}:${item.order}`).join(',')
      sort.value = sortParams
    }
    setSessionStorage(sessionStorageKey, { search, sort: sort.value })
    if (callback && typeof (callback) === 'function') {
      callback()
    }
  }

  // 重置所有條件
  const onReset = async () => {
    for (const [key, value] of Object.entries(searchParams)) { // 將 searchParams 物件轉換為一個陣列
      search[key] = value
    }
    search.page = 1
    search.page_size = 10
    search.orderby = sortParams.map((item) => `${item.field}:${item.order}`).join(',')
    sort.value = sortParams
    setSessionStorage(sessionStorageKey, { search, sort: sort.value })

    if (callback && typeof (callback) === 'function') {
      await callback()
      dataTable.value && (sessionStorage.sort.forEach((item) => { dataTable.value.sort(item) }))
    }
  }

  onMounted(async () => {
    // sessionStorage 中無資料，初始化預設值
    if (!sessionStorage) {
      const sessionStorageObj = {
        search: {
          page: 1,
          page_size: 10,
          orderby: sortParams.map((item) => `${item.field}:${item.order}`).join(','),
        },
        sort: sortParams,
      }
      setSessionStorage(sessionStorageKey, sessionStorageObj)
      sessionStorage = getSessionStorage(sessionStorageKey)
    }

    mapKeys(sessionStorage.search, (_, key) => { // 取出 sessionStorage.search
      search[key] = sessionStorage.search[key] // 根據 key 取得對應的值
    })

    sort.value = sessionStorage.sort

    for (const [key, value] of Object.entries(searchParams)) {
      (!sessionStorage.search[key] && !unSessionStorageParamsField.includes(key)) && (search[key] = value) // 符合兩個條件時，執行 (search[key] = value)
    }

    setSessionStorage(sessionStorageKey, { search, sort: sort.value }) // 確保第一輪處理後的同步狀態被永久保存

    for (const [key, value] of Object.entries(searchParams)) {
      (unSessionStorageParamsField.includes(key)) && (search[key] = value)
    }

    if (callback && typeof (callback) === 'function') {
      await callback()

      if (dataTable.value && Array.isArray(dataTable.value)) {
        sessionStorage.sort.forEach((item) => {
          const { field, order } = item

          // 確保 field 和 order 存在
          if (field && order) {
            dataTable.value.sort((a, b) => {
              if (order === 'asc') {
                return a[field] > b[field] ? 1 : -1
              } else if (order === 'desc') {
                return a[field] < b[field] ? 1 : -1
              }
              return 0 // 如果未指定順序
            })
          }
        })
      }
    }
  })

  return {
    dataTable,
    search,
    data,
    total,
    onChangePage,
    onChangePageSize,
    onChangeFilter,
    OnChangeSort,
    onReset,
  }
}

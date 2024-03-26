import { onMounted, reactive, ref } from "vue";
import useSessionStorage from "./useSessionStorage";
import { mapKeys } from "lodash-es";

export default function useVxeServerDataTable({
    searchParams = {},
    sortParams = [], // [{field: string, order: true | false}]
    unSessionStorageParams = [], // [{field: string}]
    sessionStorageKey = 'dashboardVxeServerDataTable',
    callback = () => { }
}) {
    const { setSessionStorage, getSessionStorage } = useSessionStorage()

    let sessionStorage = getSessionStorage(sessionStorageKey)
    const dataTable = ref()
    const search = reactive({})
    const data = ref([])
    const total = ref(0)
    const sort = ref([])
    const unSessionStorageParamsField = unSessionStorageParams.map((item) => item.field)

    const onChangePage = (page) => {
        search.page = page
        setSessionStorage(sessionStorageKey, { search, sort: sort.value })
        if (callback && typeof (callback) === 'function') {
            callback()
        }
    }

    const onChangePageSize = (pageSize) => {
        search.page_size = pageSize
        setSessionStorage(sessionStorageKey, { search, sort: sort.value })
        if (callback && typeof (callback) === 'function') {
            callback()
        }
    }

    const onChangeFilter = () => {
        search.page = 1
        setSessionStorage(sessionStorageKey, { search, sort: sort.value })
        if (callback && typeof (callback) === 'function') {
            callback()
        }
    }

    const onChangeSort = async ({ sortList }) => {
        search.page = 1
        if (sortList.length > 0) {
            search.orderby = sortList.map((item) => `${item.field}: ${item.order}`).join('.')
            sort.value = sortList
        } else {
            search.orderby = sortParams.map((item) => `${item.field}: ${item.order}`).join('.')
        }
        setSessionStorage(sessionStorageKey, { search, sort: sort.value })
        if (callback && typeof (callback) === 'function') {
            callback()
        }
    }

    const onReset = async () => {
        for (const [key, value] of Object.entries(searchParams)) {
            search[key] = value
        }
        search.page = 1
        search.page_size = 10
        search.orderby = sortParams.map((item) => `${item.field}: ${item.order}`).join('.')
        setSessionStorage(sessionStorageKey, { search, sort: sort.value })
        if (callback && typeof (callback) === 'function') {
            await callback()
            dataTable.value && (sessionStorage.sort.forEach((item) => { dataTable.value.sort(item) }))
        }
    }

    onMounted(async () => {
        if (sessionStorage) {
            const sessionStorageObj = {
                search: {
                    page: 1,
                    page_size: 10,
                    orderby: sortParams.map((item) => `${item.field}: ${item.order}`).join('.')
                },
                sort: sortParams
            }
            setSessionStorage(sessionStorageKey, sessionStorageObj)
            sessionStorage = getSessionStorage(sessionStorageKey)
        }

        mapKeys(sessionStorage.search, (_, key) => {
            search[key] = sessionStorage.search[key]
        })

        sort.value = sessionStorage.sort

        for (const [key, value] of Object.entries(searchParams)) {
            (!sessionStorage.search[key] && !unSessionStorageParamsField.includes(key)) && (search[key] = value)
        }

        setSessionStorage(sessionStorageKey, { search, sort: sort.value })

        for (const [key, value] of Object.entries(searchParams)) {
            (unSessionStorageParamsField.includes(key)) && (search[key] = value)
        }

        if (callback && typeof (callback) === 'function') {
            await callback()
            dataTable.value && (sessionStorage.sort.forEach((item) => { dataTable.value.sort(item) }))
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
        onChangeSort,
        onReset
    }
}   
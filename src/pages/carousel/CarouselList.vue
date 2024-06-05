<template>
  <q-page class="q-pa-lg">
    <page-header>
      {{ $route.meta.title }}
      <template #action>
        <add-button to="/carousel/create" />
      </template>
    </page-header>

    <q-card class="shadow-7">
      <card-body>
        <carousel-list-search-block v-model="search" class="q-mb-sm" @changeFilter="onChangeFilter" @reset="onReset" />
        <vxe-server-table ref="dataTable" :data="data" :total="total" :current="search.page" @sort-change="OnChangeSort"
          @update:current="onChangePage">
          <image-column field="imageUrl" width="180" title="輪播圖照片" />
          <vxe-column v-for="{ field, title, min_width, sort } in tableFields" :key="field" :field="field"
            :title="title" :sortable="sort" :min-width="min_width" />
          <vxe-column title="另開視窗設定" width="150">
            <template #default="{ row }">
              <toggle-input v-model="row.is_link_blank" :label="row.is_link_blank ? '另開視窗' : '不另開視窗'"
                @update:modelValue="onBlank(row)" />
            </template>
          </vxe-column>
          <vxe-column title="啟用設定" width="120">
            <template #default="{ row }">
              <toggle-input v-model="row.is_enable" :label="row.is_enable ? '啟用' : '不啟用'"
                @update:modelValue="onEnable(row)" />
            </template>
          </vxe-column>
          <vxe-column title="操作" fixed="right" width="115">
            <template #default="{ row }">
              <div class="flex-center row">
                <edit-icon-button class="q-mr-xs q-mb-xs" :to="'/carousel/edit/' + row.id" />
                <delete-icon-button class="q-mr-xs q-mb-xs" @click="onDelete(row)" />
              </div>
            </template>
          </vxe-column>
        </vxe-server-table>
      </card-body>
    </q-card>
  </q-page>
</template>

<script setup>
import CarouselListSearchBlock from './components/CarouselListSearchBlock.vue'
import { reactive, ref } from 'vue'
import { getList, updateData, deleteData } from '@/api/carousel'
import useCRUD from '@/hooks/useCRUD'
import useMessageDialog from '@/hooks/useMessageDialog'
import useVxeServerDataTable from '@/hooks/useVxeServerDataTable'

const filter = reactive({
  keyword: null,
  publish_date_range: null,
  closed_date_range: null,
  start_publish_date: null,
  end_publish_date: null,
  start_closed_date: null,
  end_closed_date: null,
})

const tableFields = ref([
  { title: '圖片標題', field: 'title', min_width: '180', sort: true },
  { title: '上架日期', field: 'publish_date', min_width: '120', sort: true },
  { title: '下架日期', field: 'closed_date', min_width: '120', sort: true },
  { title: '連結', field: 'link', min_width: '200', sort: false },
  { title: '排序', field: 'sequence', min_width: '80', sort: true },
])

const readListFetch = async (payload) => {
  return await getList(payload)
    .then((res) => {
      data.value = res
      total.value = res.length
    })
}

const updateFetch = async (id, payload) => {
  return await updateData(id, payload)
}

const delFetch = async (id) => {
  return await deleteData(id)
}

const onEnable = async (row) => {
  const payload = { is_enable: row.is_enable }
  const urlObj = {
    edit: () => {
      return callUpdateFetch(row.id, { ...payload })
    },
  }
  const [res] = await urlObj.edit()
  if (res) refreshFetch()
}

const onBlank = async (row) => {
  const payload = { is_link_blank: row.is_link_blank }
  const urlObj = {
    edit: () => {
      return callUpdateFetch(row.id, { ...payload })
    },
  }
  const [res] = await urlObj.edit()
  if (res) refreshFetch()
}

const onDelete = async (row) => {
  const res = await messageDelete({ title: '刪除', message: '確認刪除輪播圖？', confirmButtonText: '確認', cancelButtonText: '取消' })
  if (!res) return
  const [delRes] = await callDeleteFetch(row.id)
  if (delRes) {
    search.page = 1
    refreshFetch()
  }
}

const refreshFetch = async () => {
  const filter = { ...search }
  filter.start_publish_date = filter.publish_date_range?.from ? filter.publish_date_range.from : null
  filter.end_publish_date = filter.publish_date_range?.to ? filter.publish_date_range.to : null
  filter.start_closed_date = filter.closed_date_range?.from ? filter.closed_date_range.from : null
  filter.end_closed_date = filter.closed_date_range?.to ? filter.closed_date_range.to : null
  await getDataList({ ...filter })
}

const { dataTable, search, data, total, onChangePage, onChangeFilter, OnChangeSort, onReset } = useVxeServerDataTable({
  searchParams: filter,
  sortParams: [{
    field: 'sequence',
    order: 'asc',
  }],
  sessionStorageKey: 'dashboardCarouselServerDataTable',
  callback: refreshFetch,
})

const { messageDelete } = useMessageDialog()
const { callUpdateFetch, callDeleteFetch, callReadListFetch: getDataList } = useCRUD({
  updateFetch: updateFetch,
  deleteFetch: delFetch,
  readListFetch: readListFetch,
})

</script>
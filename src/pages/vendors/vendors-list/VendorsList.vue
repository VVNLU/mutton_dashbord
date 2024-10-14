<template>
  <q-page class="q-pa-lg">
    <page-header>
      {{ $route.meta.title }}
      <template #action>
        <add-button @click="showDialog({})" />
      </template>
    </page-header>
    <q-card class="shadow-7">
      <card-body>
        <vendors-list-search-block v-model="search" @changeFilter="onChangeFilter" @reset="onReset" />
        <vxe-server-table ref="dataTable" :data="data" :total="total" :current="search.page" @sort-change="OnChangeSort"
          @update:current="onChangePage">
          <vxe-column v-for="{ field, name } in sortedTableFields" :key="field" :field="field" :title="name"
            min-width="120" />
          <vxe-column title="操作" fixed="right" width="120">
            <template #default="{ row }">
              <div class="flex-center row">
                <edit-icon-button class="q-mr-xs q-mb-xs"
                  @click="showDialog({ id: row.id, mode: 'edit', callRead: true })" />
                <delete-icon-button class="q-mr-xs q-mb-xs" @click="onDelete(row)" />
              </div>
            </template>
          </vxe-column>
        </vxe-server-table>
      </card-body>
    </q-card>

    <vendors-dialog ref="dialog" @save="refreshFetch" />
  </q-page>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
// import { getList, updateData, deleteData } from '@/api/vendors'
import { getList } from '@/api/vendorsClassification'
import VendorsListSearchBlock from './components/VendorsListSearchBlock.vue'
import VendorsDialog from './components/VendorsDialog.vue'
import useVxeServerDataTable from '@/hooks/useVxeServerDataTable'
import useMessageDialog from '@/hooks/useMessageDialog'
import useCRUD from '@/hooks/useCRUD'

const filter = reactive({
  keyword: null,
})

const tableFields = ref([])
const dialog = ref()

const readListFetch = async (payload) => {
  return await getList(payload)
    .then((res) => {
      tableFields.value = res
    })
}

const updateFetch = async (id, payload) => {
  return await updateData(id, payload)
}

const delFetch = async (id) => {
  return await deleteData(id)
}

const refreshFetch = async () => {
  await callReadListFetch({ ...search })
}

const onDelete = async (row) => {
  const res = await messageDelete({ title: '刪除', message: '確認刪除供應商？', confirmButtonText: '確認', cancelButtonText: '取消' })
  if (!res) return
  const [delRes] = await callDeleteFetch(row.id)
  if (delRes) {
    onChangeFilter()
  }
}

const showDialog = ({ id, mode, callRead }) => {
  dialog.value.showDialog({ id, mode, callRead })
}

const sortedTableFields = computed(() => {
  return tableFields.value.filter(field => field.is_enable).sort((a, b) => a.sequence - b.sequence)
})

const { dataTable, search, data, total, onChangePage, onChangeFilter, OnChangeSort, onReset } = useVxeServerDataTable({
  searchParams: filter,
  sortParams: [{ field: 'date', order: 'asc', }, { field: 'id', order: 'desc' }],
  sessionStorageKey: 'dashboardVendorsServerDataTable',
  callback: refreshFetch,
})

const { callReadListFetch, callDeleteFetch } = useCRUD({
  updateFetch: updateFetch,
  readListFetch: readListFetch,
  deleteFetch: delFetch,
})

const { messageDelete } = useMessageDialog()
</script>
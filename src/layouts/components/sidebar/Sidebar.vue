<template>
    <q-drawer v-model="sidebarOpened" show-if-above bordered :width="260" class="bg-grey-3 shadow-7 text-blue-grey-7">
        <q-item-label header class="text-center text-h6 header-title">羊肉盧後台管理</q-item-label>
        <q-scroll-area class="h-[calc(95%_-_50px)]" style="border-right: 1px solid #ddd;">
            <q-list>
                <sidebar-item v-for="(routeItem, routeIndex) in routes" :key="routeIndex" :item="routeItem"
                    :base-path="routeItem.path" />
            </q-list>
        </q-scroll-area>
        <q-separator />
    </q-drawer>
</template>

<script setup>
import SidebarItem from './SidebarItem.vue'
import { computed } from 'vue'
import { useApp } from '@/stores/app'
import { usePermission } from '@/stores/permission'

const store = useApp()
const storePermission = usePermission()
const sidebarOpened = computed({
    get() {
        return store.sidebar.opened
    },
    set() {
        store.toggleSidebar()
    },
})

const routes = computed(() => {
    return storePermission.routes
})

</script>
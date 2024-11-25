<template>
  <q-tabs class="bg-primary text-white shadow-2">
    <q-btn flat dense round icon="fa-solid fa-house" @click="dashboard" />
    <q-space />
    <template v-for="(routeItem, routeIndex) in asyncRoutes" :key="routeIndex">
      <!-- group 有多個元素，則使用下拉選單 -->
      <template v-if="routeItem.group && routeItem.group.length > 1">
        <q-btn-dropdown auto-close stretch flat :label="isXs ? '' : routeItem.meta.title" :icon="routeItem.meta.icon">
          <q-list>
            <q-item v-for="(child, childIndex) in routeItem.children" :key="childIndex" clickable
              @click="navigateTo(child.path)">
              <q-item-section>{{ child.meta.title }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </template>
      <!-- group 只有一個，直接渲染標籤 -->
      <template v-else>
        <q-route-tab :icon="routeItem.meta.icon" :label="isXs ? '' : routeItem.meta.title" :to="routeItem.path" exact />
      </template>
    </template>
    <q-space />
    <q-btn flat dense round icon="logout" @click="logout" />
  </q-tabs>
</template>

<script setup>
import { asyncRoutes } from '@/router'
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import useLogout from '@/hooks/useLogout.js'

const router = useRouter()
const { resetStore } = useLogout()

const isXs = ref(false)

const navigateTo = (path) => {
  router.push(path)
}

const updateIsXs = () => {
  isXs.value = window.innerWidth <= 600 // 600px 為 Quasar 的 xs 預設分界
}

const dashboard = () => {
  router.push('/')
}

const logout = () => {
  resetStore()
  router.push('/login')
}

onMounted(() => {
  updateIsXs()
  window.addEventListener('resize', updateIsXs)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsXs)
})
</script>

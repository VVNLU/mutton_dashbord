<template>
  <div class="fixed-container">
    <q-tabs shrink class="bg-primary text-white shadow-2">
      <q-btn flat icon="fa-solid fa-house" @click="dashboard" dense />
      <q-space />
      <template v-for="(routeItem, routeIndex) in asyncRoutes" :key="routeIndex">
        <!-- group 有多個元素，則使用下拉選單 -->
        <template v-if="routeItem.group && routeItem.group.length > 1">
          <q-btn-dropdown auto-close stretch flat>
            <template v-slot:label>
              <div>
                <div class="row justify-around items-center no-wrap">
                  <q-icon :name="routeItem.meta.icon" />
                </div>
                <div v-show="!isXs" class="row items-center no-wrap">
                  {{ routeItem.meta.title }}
                </div>
              </div>
            </template>
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
          <q-route-tab :icon="routeItem.meta.icon" :label="isXs ? '' : routeItem.meta.title" :to="routeItem.path"
            exact />
        </template>
      </template>
      <q-space />
      <q-btn flat icon="logout" @click="logout" dense />
    </q-tabs>
  </div>
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

<style scoped>
.fixed-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  height: var(--header-tabs-height, 50px)
}
</style>
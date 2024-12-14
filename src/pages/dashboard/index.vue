<template>
  <q-page class="q-pa-lg">
    <div class="row justify-center">
      <div v-for="(item, index) in list" :key="index" class="q-ma-md">
        <div class="row items-center justify-center">
          <q-icon name="fa-solid fa-grip-lines-vertical" size="md" :color="item.color" />
          <h5 class="q-ml-sm">{{ item.label }}</h5>
        </div>
        <div v-if="hasTitle(index)">
          <q-btn v-for="(label, labelIndex) in getButtonLabels(index)" :key="labelIndex" :label="label"
            :color="item.color" @click="navigateToRoute(index, labelIndex)" size="lg" class="q-my-sm btn-style" push />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { asyncRoutes } from '@/router'
import { useRouter } from 'vue-router'

const router = useRouter()

const list = [
  { label: '聯絡', color: 'purple' },
  { label: '原料', color: 'secondary' },
  { label: '商品', color: 'indigo' },
  { label: '訂單', color: 'amber' },
  { label: '庫存', color: 'lime-9' },
  { label: '報表', color: 'info' },
]

const hasTitle = (index) => {
  return asyncRoutes[index]?.meta?.title
}

const getButtonLabels = (index) => {
  if (asyncRoutes[index]?.group) {
    return asyncRoutes[index]?.children?.map(
      (child) => child.meta?.title
    )
  }
  return [asyncRoutes[index]?.meta?.title]
}

const navigateToRoute = (index, labelIndex) => {
  const targetPath = asyncRoutes[index]?.group
    ? asyncRoutes[index]?.children?.[labelIndex]?.path
    : asyncRoutes[index]?.path;
  return router.push(targetPath);
}
</script>

<style scoped>
.btn-style {
  display: block;
  width: 100%;
}
</style>
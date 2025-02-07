<template>
  <div v-if="!item.hidden && item.children && !onlyOneChild?.noShowingChildren">
    <template v-if="onlyOneChild && !item.alwaysShow">
      <sidebar-link
        :key="onlyOneChild.path"
        :to="resolvePath(onlyOneChild.path)"
        :title="onlyOneChild.meta.title"
        :icon="onlyOneChild.meta.icon"
        @click="onclick(onlyOneChild)"
      />
    </template>
    <!-- sidebar 第一層標題 -->
    <q-expansion-item
      v-else
      v-model="open"
      :key="item.groupName"
      :group="item.groupName"
      :icon="item.meta.icon"
      :label="item.meta.title"
      :header-class="headerClassActive"
      :expand-icon-class="expandIconClassActive"
      class="first-sidebar text-white text-bold text-subtitle1"
    >
      <q-list
        v-for="(childItem, childIndex) in visibleChildren"
        :key="childIndex"
        class="q-pl-lg bg-light-blue-10"
      >
        <sidebar-item
          v-if="childItem.children && childItem.children.length > 0"
          :is-nest="true"
          :item="childItem"
          :base-path="resolvePath(childItem.path)"
        />
        <sidebar-link
          v-else
          :key="childItem.path"
          :to="resolvePath(childItem.path)"
          :title="childItem.meta.title"
          :icon="childItem.meta.icon"
          @click="onclick(childItem)"
        />
      </q-list>
    </q-expansion-item>
  </div>
</template>

<script setup>
import SidebarLink from './SidebarLink.vue'
import path from 'path'
import { ref, toRefs, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import useEventBus from '@/hooks/useEventBus'

const props = defineProps({
  item: { type: Object },
  activeHeaderClass: { type: String },
  activeExpandIconClass: { type: String },
  isNest: { type: Boolean, default: false },
  basePath: { type: String }
})

const route = useRoute()
const { item, activeHeaderClass, activeExpandIconClass, basePath } =
  toRefs(props)
const open = ref(false)
const active = ref(false)
const headerClassDefault = ref('bg-primary text-white')
const expandIconClassDefault = ref('text-white')
const headerClassActive = ref('')
const expandIconClassActive = ref('')

const { emit: busEmit, bus } = useEventBus()

const visibleChildren = computed(() => {
  const children = item.value.children.filter((item) => !item.hidden)
  return children
})

const onlyOneChild = computed(() => {
  if (!item.value.children) {
    return item.value
  }
  let oneChild
  const showingChildren = item.value.children.filter((item) => {
    if (!item.hidden) {
      oneChild = item
    }
    return !item.hidden
  })
  if (item.value.meta.slug === 'link') return oneChild
  if (item.value.meta.slug === 'dropdown' && showingChildren.length !== 0) {
    return false
  }
  if (item.value.meta.slug === 'dropdown' && showingChildren.length === 0) {
    return { ...item.value, path: '', noShowingChildren: true }
  }
  return oneChild
})

onMounted(async () => {
  onclick(buildActiveItem(route.path))
})

const onclick = (nodeData) => {
  busEmit('activeItem', nodeData)
  const currentItem = bus.value.get('activeItem')
  if (currentItem) {
    changeActiveHeaderStyle(currentItem[0])
  }
}

const activeItem = (currentItem) => {
  active.value = item.value.to === currentItem.to
  open.value = item.value.group
    ? item.value.group.filter(
        (groupItem) =>
          selectMatchSidebarItem([currentItem.group], groupItem).length > 0
      ).length > 0
    : false
}

const buildActiveItem = (path) => {
  if (!path || path === '/') {
    path = '/dashboard'
  }
  const group = !path.substr(0, path.lastIndexOf('/'))
    ? path
    : path.substr(0, path.lastIndexOf('/'))
  return { to: path, group: group }
}

const changeActiveHeaderStyle = (currentItem) => {
  activeItem(currentItem)
  const isGroup =
    currentItem.group &&
    item.value.group &&
    item.value.group.filter(
      (groupItem) =>
        selectMatchSidebarItem([currentItem.group], groupItem).length > 0
    ).length > 0
  if (!isGroup) {
    headerClassActive.value = ''
    expandIconClassActive.value = ''
    return
  }
  headerClassActive.value = activeHeaderClass.value
    ? activeHeaderClass.value
    : headerClassDefault.value
  expandIconClassActive.value = activeExpandIconClass.value
    ? activeExpandIconClass.value
    : expandIconClassDefault.value
}

// 解析絕對路徑
const resolvePath = (routePath) => {
  return path.resolve(basePath.value, routePath)
}

const selectMatchSidebarItem = (lists, keyWord) => {
  const resArr = []
  lists.filter((item) => {
    const uri = item.toLowerCase().split('/')
    const keyWordUri = keyWord.toLowerCase().split('/')[1]
    uri.filter((uriItem) => {
      if (uriItem === keyWordUri) {
        resArr.push(item)
      }
      return uri
    })
    return lists
  })
  return resArr
}

watch(
  () => route,
  (newValue) => {
    onclick(buildActiveItem(newValue.path))
  },
  { deep: true }
)
</script>

<style scoped>
.first-sidebar {
  text-shadow: 2px 2px 1px rgba(0, 0, 0, 0.5);
}
</style>

<template>
  <q-layout view="lHh Lpr lFf">
    <HeaderTabs />
    <q-page-container class="content-container">
      <router-view v-slot="{ Component, route }">
        <transition name="slide-fade">
          <div :key="route">
            <component :is="Component" :key="route" />
          </div>
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import HeaderTabs from './components/HeaderTabs.vue'
</script>

<style lang="scss" scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.content-container {
  padding-top: var(--header-tabs-height, 60px);
}
</style>

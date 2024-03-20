<template>
    <q-layout view="lHh Lpr lFf">
        <Header />
        <Sidebar />
        <q-page-container class="bg-orange-1 !pb-16">
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
import Header from './components/Header.vue'
import Sidebar from './components/sidebar/Sidebar.vue'
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
</style>
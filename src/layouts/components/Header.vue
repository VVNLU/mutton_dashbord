<template>
    <q-header elevated class="bg-brown-5  text-blue-grey7">
        <q-toolbar>
            <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggle" />
            <q-space />
            <q-btn flat dense round icon="logout" @click="logout" />
        </q-toolbar>
    </q-header>
</template>

<script setup>
import { useApp } from '@/stores/app'
import useLogout from '@/hooks/useLogout.js'

const storeApp = useApp()

const toggle = () => {
    storeApp.toggleSidebar()
}

const logout = () => {
    resetStore()
}

const { resetStore } = useLogout()
</script>
<template>
  <q-item v-ripple :to="to" clickable class="text-white">
    <q-item-section avatar>
      <q-icon class="sidebar-icon" :name="icon" size="1.6rem" />
    </q-item-section>
    <q-item-section>
      <q-item-label class="sidebar-label text-bold text-subtitle1">{{
        title
      }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  to: { type: String, required: true },
  icon: { type: String },
  title: { type: String, default: '' }
})
</script>

<style scoped>
.sidebar-label,
.sidebar-icon {
  text-shadow: 2px 2px 1px rgba(0, 0, 0, 0.5);
}
</style>

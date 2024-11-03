<template>
  <q-btn
    no-caps
    class="shadow-1"
    :label="label"
    :outline="outline"
    :rounded="rounded"
    :color="color"
    :icon="icon"
    :size="size"
    :loading="isLoading"
  />
</template>

<script setup>
import { computed, defineProps } from 'vue'
import { useApp } from '@/stores/app'

const storeApp = useApp()

const props = defineProps({
  label: { type: String },
  outline: { type: Boolean, default: false },
  rounded: { type: Boolean, default: false },
  color: { type: String, default: 'primary' },
  icon: { type: String },
  size: { type: String, default: 'md' },
  useLoading: { type: Boolean, default: true }
})

const isLoading = computed(() => {
  return (
    props.useLoading &&
    (storeApp.isCreate || storeApp.isUpdate || storeApp.isDelete)
  )
})
</script>

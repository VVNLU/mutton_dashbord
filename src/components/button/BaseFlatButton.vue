<template>
  <q-btn no-caps :label="label" :color="color" :flat="flat" :size="size" :loading="isLoading">
    <template #loading>
      <q-spinner-hourglass size="0.75em" />
    </template>
  </q-btn>
</template>

<script setup>
import { computed, defineProps } from 'vue';
import { useApp } from '@/stores/app'

const props = defineProps({
  label: { type: String },
  color: { type: String, default: 'primary' },
  flat: { type: Boolean, default: true },
  size: { type: String, default: 'md' },
  useLoading: { type: Boolean, default: false }
})

const storeApp = useApp()

const isLoading = computed(() => {
  return props.useLoading && (storeApp.isCreate || storeApp.isUpdate || storeApp.usDelete)
})
</script>
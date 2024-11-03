<template>
  <div class="fixed-footer">
    <div class="row items-center justify-between q-px-lg q-py-md">
      <div>
        <confirm-button
          v-if="showSave"
          :color="confirmButtonColor"
          :label="confirmButtonText"
          @click="onSave"
          class="q-mr-md q-px-xl q-mb-xs"
        />
        <slot name="button" />
        <cancel-button
          v-if="showCancel"
          :color="cancelButtonColor"
          :label="cancelButtonText"
          @click="onCancel"
          class="q-px-xl q-mb-xs text-black"
        />
      </div>
    </div>
    <div
      class="q-layout__shadow absolute-full overflow-hidden no-pointer-events"
    />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import useGoBack from '@/hooks/useGoBack'

const props = defineProps({
  cancelButtonColor: { type: String, default: 'white' },
  cancelButtonText: { type: String, default: '取消' },
  confirmButtonColor: { type: String, default: 'primary' },
  confirmButtonText: { type: String, default: '確定' },
  goBackRoute: { type: String, default: '' },
  autoBack: { type: Boolean, default: true },
  showCancel: { type: Boolean, default: true },
  showSave: { type: Boolean, default: true }
})
const emit = defineEmits(['cancel', 'save'])

const { goBack } = useGoBack({
  autoBack: props.autoBack,
  fallBack: props.goBackRoute
})
const onCancel = () => {
  emit('cancel')
  goBack()
}

const onSave = () => {
  emit('save')
}
</script>

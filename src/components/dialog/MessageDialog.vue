<template>
  <q-dialog v-model="show" :persistent="persistent">
    <q-card>
      <q-card-section class="row items-center dialog-header">
        <div class="text-h6">
          {{ title }}
        </div>
        <q-space />
      </q-card-section>
      <q-card-section class="scroll q-dialog-body">
        {{ message }}
      </q-card-section>
      <q-card-action class="q-dialog-footer" align="right">
        <base-flat-button :color="cancelButtonColor" :label="cancelButtonText" @click="onConfirm" />
        <base-flat-button :color="confirmButtonColor" :label="confirmButtonText" @click="onCancel" />
      </q-card-action>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useMessageDialogStore } from '@/stores/messageDialog'
import { toRefs } from 'vue';

const store = useMessageDialogStore()

const {
  show,
  title,
  message,
  persistent,
  confirmButtonText,
  confirmButtonColor,
  cancelButtonText,
  cancelButtonColor,
  showCancel
} = toRefs(store)

const onConfirm = () => {
  store.confirm()
}

const onCancel = () => {
  store.cancel()
}
</script>
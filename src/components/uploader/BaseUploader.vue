<template>
  <div>
    <q-uploader
      ref="uploader"
      color="white"
      text-color="black"
      flat
      :accept="accept"
      :multiple="multiple"
      :max-file-size="maxFileSize"
      :disable="disable"
      @added="onAdded"
      @rejected="onRejected"
    >
      <template #header="scope">
        <q-btn class="h-full w-full p-2.5rem" @click="scope.pickFiles">
          <q-uploader-add-trigger />
          <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
          <div>
            <img v-if="imgSrc" class="w-full" :src="imgSrc" alt="" />
            <div v-else class="flex-center row column">
              <svg-icon
                color="gray"
                icon="cloud-arrow-up"
                class="cursor-pointer"
                size="56"
              />
              <div class="q-uploader__title">將檔案拖放到此處或點擊上傳</div>
            </div>
          </div>
        </q-btn>
      </template>
    </q-uploader>
    <div class="q-field__bottom">
      <slot name="upload-bottom" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  accept: { type: String },
  imgSrc: { type: String },
  maxFileSize: { type: Number },
  multiple: { type: Boolean },
  disable: { type: Boolean, default: false }
})
const emit = defineEmits(['rejected', 'added'])

const uploader = ref()

const removeQueuedFiles = () => {
  uploader.value.removeQueuedFiles()
}
const onAdded = (files) => {
  emit('added', files)
}
const onRejected = (rejectedEntries) => {
  emit('rejected', rejectedEntries)
}
</script>

<style lang="scss" scoped>
.q-uploader {
  @apply cursor-pointer max-h-none w-full;

  border: dashed 2px #d3d3d4;

  &:hover {
    border: 2px dashed $primary;
  }

  &:deep(.q-uploader__list) {
    display: none;
  }
}
</style>

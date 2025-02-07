<template>
  <span>
    <q-img
      v-show="!useSkeleton || (!isReading && useSkeleton)"
      loading="lazy"
      spinner-color="white"
      :src="observeSrc"
      :ratio="ratio"
      :alt="alt"
      :fit="fit"
      :height="height"
      :width="width"
      :position="position"
      :class="preview && 'cursor-pointer'"
      @click="onPreview"
    >
      <template #error>
        <div class="bg-dark flex flex-center text-white absolute-full">
          載入失敗
        </div>
      </template>
    </q-img>
    <skeleton-square v-if="isReading && useSkeleton" />
    <image-preview-dialog ref="dialog" />
  </span>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { asyncComputed } from '@vueuse/core'
import { getAuthData } from '@/utils/auth'
import { fetchBlobData, fetchBlobDataAsDataUrl } from '@/utils/blob'

const props = defineProps({
  src: { type: String },
  ratio: { type: Number, default: 1 },
  alt: { type: String },
  fit: { type: String, default: 'cover' },
  height: { type: String, default: '100%' },
  width: { type: String, default: '100%' },
  position: { type: String },
  preview: { type: Boolean, default: true },
  useAuthorization: { type: Boolean, default: false },
  headers: { type: Object },
  fileReaderMethod: { type: String, default: 'text' },
  useSkeleton: { type: Boolean, default: false }
})

const dialog = ref()
const isReading = ref(false)

const observeSrc = asyncComputed(async () => {
  if (props.useAuthorization) {
    isReading.value = true
    const src = props.src
    const options = {
      headers: props.headers || { Authorization: `Bearer ${getAuthData()}` }
    }
    const fetchObj = {
      text: () => {
        return fetchBlobData(src, options)
      },
      dataUrl: () => {
        return fetchBlobDataAsDataUrl(src, options)
      }
    }
    const data = await fetchObj[props.fileReaderMethod]()
    isReading.value = false
    return data
  } else {
    return props.src
  }
})

const onPreview = () => {
  if (props.preview) {
    dialog.value.showDialog({ data: { image: { url: observeSrc.value } } })
  }
}
</script>

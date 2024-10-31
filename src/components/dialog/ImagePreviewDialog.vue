<template>
  <base-dialog v-model="isShowDialog" title="預覽圖片" :show-save="false">
    <base-image class="w-full" :src="preview(data)" :preview="false" />
  </base-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import useImgStorage from '@/hooks/useImgStorage'
import useDialog from '@/hooks/useDialog'

const { getImageSrc } = useImgStorage()
const { isShowDialog } = useDialog({})

const data = ref()

const preview = computed(() => (data) => {
  const { blobURL, url, base64, filename } = data.image || {}
  if (blobURL) return blobURL
  if (url) return url
  if (base64) return base64
  return getImageSrc({ filename, size: '200x' })
})

const showDialog = async ({ data: imageData }) => {
  data.value = imageData
  isShowDialog.value = !isShowDialog.value
}
</script>

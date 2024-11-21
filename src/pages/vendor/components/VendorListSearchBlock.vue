<template>
  <list-search-block
    v-model="sourceData"
    @changeFilter="onChangeFilter"
    @reset="onReset"
  />
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import { defineProps } from 'vue'

const props = defineProps({
  modelValue: { type: [Object, String] }
})
const emit = defineEmits(['changeFilter', 'reset'])

const sourceData = useVModel(props, 'modelValue', emit)
console.log('sourceData',sourceData.value)

const onChangeFilter = () => {
  emit('changeFilter')
}

const onReset = () => {
  emit('reset')
}
</script>

<style lang="scss" scoped></style>

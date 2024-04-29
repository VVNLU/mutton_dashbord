<template>
  <div class="row q-col-gutter-x-md q-col-gutter-y-xs">
    <slot name="default" />
    <div v-if="showInputSearch" :class="inputSearchCol">
      <search-input v-model="sourceData.keyword" class="w-full" dense @update:modelValue="onChangeFilter" />
    </div>
    <div v-if="showResetButton" :class="resetButtonCol">
      <base-button class="w-full" @click="onReset" text-color="black" :label="'清除'" color="white" />
    </div>
  </div>
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import { defineProps } from 'vue';

const props = defineProps({
  modelValue: { type: [Object, String] },
  showInputSearch: { type: Boolean, default: true },
  showResetButton: { type: Boolean, default: true },
  inputSearchCol: { type: String, default: 'col-md-3 col-sm-4 col-xs-12' },
  resetButtonCol: { type: String, default: 'col-lg-1 col-md-3 col-sm-2 col-xs-12' },
})
const emit = defineEmits(['reset', 'changeFilter'])

const sourceData = useVModel(props, 'modelValue', emit)

const onChangeFilter = () => {
  emit('changeFilter')
}

const onReset = () => {
  emit('reset')
}
</script>
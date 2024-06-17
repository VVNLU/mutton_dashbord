<template>
  <list-search-block v-model="sourceData" @changeFilter="onChangeFilter" @reset="onReset">
    <div class="col-md-3 col-sm-6 col-xs-12">
      <date-input v-model="sourceData.publish_date_range" class="w-full" dense placeholder="請選擇日期"
        @update:modelValue="onChangeFilter" />
    </div>
  </list-search-block>
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import { defineProps } from 'vue';

const props = defineProps({
  modelValue: { type: [Object, String] }
})
const emit = defineEmits(['changeFilter', 'reset'])

const sourceData = useVModel(props, 'modelValue', emit)

const onChangeFilter = () => {
  emit('changeFilter')
}

const onReset = () => {
  emit('reset')
}
</script>

<style lang="scss" scoped></style>
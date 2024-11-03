<template>
  <q-select
    :options="options"
    :clearable="clearable"
    :outline="outline"
    :use-input="useInput"
    :map-options="mapOptions"
    :emit-value="emitValue"
    :fill-input="fillInput"
    :input-Debounce="inputDebounce"
    :transition-show="transitionShow"
    :transition-hide="transitionHide"
    :option-label="optionLabelFn"
    :option-value="optionValueFn"
    :hide-selected="hideSelected"
    @filter="filterFn"
    @clear="clearFn"
  >
    <template v-if="$slots.default" #default>
      <slot name="default" />
    </template>
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
    <template v-if="$slots.before" #before>
      <slot name="before" />
    </template>
    <template v-if="$slots.after" #after>
      <slot name="after" />
    </template>
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <template v-if="$slots.error" #error>
      <slot name="error" />
    </template>
    <template v-if="$slots.hint" #hint>
      <slot name="hint" />
    </template>
    <template v-if="$slots.counter" #counter>
      <slot name="counter" />
    </template>
    <template v-if="$slots.loading" #loading>
      <slot name="loading" />
    </template>
    <template v-if="$slots.selected" #selected>
      <slot name="selected" />
    </template>
    <template v-if="$slots.beforeOptions" #before-options>
      <slot name="before-options" />
    </template>
    <template v-if="$slots.afterOptions" #after-options>
      <slot name="after-options" />
    </template>
    <template #no-option>
      <q-item-select class="text-grey"> 無此結果 </q-item-select>
    </template>
    <template v-if="$slots.selectedItem" #selected-item>
      <slot name="selected-item" />
    </template>
    <template v-if="$slots.option" #option>
      <slot name="option" />
    </template>
  </q-select>
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import { computed, defineProps, ref } from 'vue'
import { selectMatchItem } from '@/utils/filter'

const props = defineProps({
  modelValue: { type: [String, Number, null, Object] },
  options: {
    type: Array,
    default() {
      return []
    }
  },
  clearable: { type: Boolean, default: true },
  outline: { type: Boolean, default: true },
  useInput: { type: Boolean, default: true },
  mapOptions: { type: Boolean, default: true },
  emitValue: { type: Boolean, default: false },
  fillInput: { type: Boolean, default: true },
  inputDebounce: { type: Number, default: 0 },
  transitionShow: { type: String, default: 'scale' },
  transitionHide: { type: String, default: 'scale' },
  optionLabel: { type: String, default: 'name' },
  optionValue: { type: String, default: 'id' }
})
const emit = defineEmits(['update:modelValue'])

const filterOptions = ref(props.options)
const observeValue = useVModel(props, 'modelValue', emit)

const hideSelected = computed(() => {
  return props.useInput
})

const filterFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase()
    const needleOptions = selectMatchItem(
      props.options.map((item) => item[props.optionLabel]),
      needle
    )
    filterOptions.value = props.options.filter((item) =>
      needleOptions.includes(item[props.options])
    )
  })
}
const clearFn = (val) => {
  observeValue.value = null
}
const optionValueFn = (item) => {
  return item[props.optionValue] ? item[props.optionValue] : item
}
const optionLabelFn = (item_) => {
  return item[props.optionLabel] ? item[props.optionLabel] : item
}
</script>

<template>
  <text-input
    v-model="observeValue"
    type="number"
    :label="label"
    :rules="ruleList"
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
  </text-input>
</template>

<script setup>
import { defineProps, computed, toRefs } from 'vue'
import { vuelidate } from '@/plugins/vuelidate'

const props = defineProps({
  label: { type: String },
  modelValue: { type: [String, Number] },
  rules: {
    type: Array,
    default() {
      return []
    }
  },
  required: { type: Boolean, default: true },
  min: { type: Number },
  max: { type: Number }
})
const emit = defineEmits(['update:modelValue'])

const { label, rules, required, min, max } = toRefs(props)

const observeValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    if (value === '' || value === null) {
      emit('update:modelValue', 0)
      return
    }
    emit('update:modelValue', +value)
  }
})

const ruleList = computed(() => {
  const rule = []
  required.value && rule.push(vuelidate.required(`${label.value}必填`))
  min.value &&
    rule.push(
      vuelidate.minValue(min.value, `${label.value}必須大於${min.value}`)
    )
  max.value &&
    rule.push(
      vuelidate.minValue(max.value, `${label.value}必須小於${max.value}`)
    )
  return rule.concat(rules.value)
})

const clearFn = (val) => {
  emit('update:modelValue', 0)
}
</script>

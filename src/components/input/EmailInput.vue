<template>
  <text-input v-model="observeValue" type="mail" :label="label" :rules="ruleList">
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
import { computed, defineProps, toRefs } from 'vue';
import { useVModel } from '@vueuse/core'
import { vuelidate } from '@/plugins/vuelidate'


const props = defineProps({
  label: { type: String, },
  modelValue: { type: [String, Number], default: 0 },
  rules: { type: Array, default() { return [] } },
})
const emit = defineEmits(['update:modelValue'])

const { rules } = toRefs(props)
const observeValue = useVModel(props, 'modelValue', emit)

const ruleList = computed(() => {
  const rule = [
    vuelidate.email('必須是email格式')
  ]
  return rule.concat(rules.value)
})
</script>
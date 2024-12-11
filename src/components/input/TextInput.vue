<template>
  <div :inert="isCalculatorVisible">
    <q-input ref="input" :label="label" v-model="observeValue" :clearable="clearable" :outlined="outlined"
      :placeholder="placeholder" :rules="ruleList" @click="openCalculator" :dense="dense">
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
      <template v-if="$slots.center" #center>
        <slot name="center" />
      </template>
      <template v-if="$slots.loading" #loading>
        <slot name="loading" />
      </template>
    </q-input>

    <q-dialog v-model="isCalculatorVisible" no-backdrop-dismiss persistent @click.stop>
      <div class="number-box" tabindex="0">
        <number-box @enter="handleResult" />
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import { computed, ref, toRefs, defineProps } from 'vue'
import { vuelidate } from '@/plugins/vuelidate'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  label: { type: String },
  modelValue: { type: [String, Number, Object, null] },
  rules: {
    type: Array,
    default() {
      return []
    }
  },
  clearable: { type: Boolean, default: true },
  outlined: { type: Boolean, default: true },
  placeholder: { type: String, default: '請輸入' },
  maxLength: { type: Number, default: 255 },
  minLength: { type: Number },
  required: { type: Boolean, default: false },
  dense: { type: Boolean, default: false },
  showNumberBox: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const { rules, maxLength, minLength, required, label, showNumberBox } = toRefs(props)
const input = ref()
const observeValue = useVModel(props, 'modelValue', emit)
const isCalculatorVisible = ref(false)

const ruleList = computed(() => {
  const rule = []
  required.value && rule.push(vuelidate.required(`${label.value}必填`))
  rule.push(
    vuelidate.maxLength(maxLength.value, `長度不可超過${maxLength.value}字`)
  )
  if (minLength.value !== undefined) {
    rule.push(
      vuelidate.minLength(minLength.value, `長度不可少於${minLength.value}字`)
    )
  }
  return rule.concat(rules.value)
})

const openCalculator = () => {
  if (showNumberBox.value) {
    isCalculatorVisible.value = true
  }
}

const handleResult = (value) => {
  emit('update:modelValue', value)
  isCalculatorVisible.value = false
}
</script>

<style scoped>
.number-box {
  width: 100%;
  max-width: 400px;
  height: auto;
  max-height: 80vh;
  overflow: hidden;
}
</style>

<template>
  <div :inert="isCalculatorVisible">
    <q-input v-model="observeValue" type="number" :label="label" :rules="ruleList" @clear="clearFn"
      @click="openCalculator" :outlined="outlined" :dense="dense" class="q-pa-none" clearable>
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
    </q-input>

    <q-dialog v-model="isCalculatorVisible" no-backdrop-dismiss persistent @click.stop>
      <div class="calculator" tabindex="0">
        <!-- <calculator @enter="handleResult" /> -->
        <number-box @enter="handleResult" />
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import { defineProps, computed, toRefs, ref } from 'vue'
import { vuelidate } from '@/plugins/vuelidate'
import { useVModel } from '@vueuse/core'

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
  max: { type: Number },
  outlined: { type: Boolean, default: true },
  dense: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

const { label, rules, required, min, max } = toRefs(props)

const observeValue = useVModel(props, 'modelValue', emit)
const isCalculatorVisible = ref(false)

const openCalculator = () => {
  if (!isCalculatorVisible.value) {
    isCalculatorVisible.value = true
    setTimeout(() => {
      const calculator = document.querySelector('.calculator-class')
      calculator?.focus()
    }, 0)
  }
}

const closeCalculator = () => {
  isCalculatorVisible.value = false
}

const handleResult = (result) => {
  emit('update:modelValue', result)
  closeCalculator()
}

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
  observeValue.value = 0
}
</script>

<style scoped>
.calculator {
  width: 100%;
  max-width: 400px;
  height: auto;
  max-height: 80vh;
  overflow: hidden;
}
</style>

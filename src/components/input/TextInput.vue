<template>
    <q-input class="q-pb-lg" ref="input" :label="label" v-model="observeValue" :clearable="clearable"
        :outlined="outlined" :placeholder="placeholder" :rules="ruleList">
        <template v-if="$slots.append" #append>
            <slot name="append" />
        </template>
    </q-input>
</template>

<script setup>
import { computed, ref, toRefs, defineProps, defineEmits } from 'vue'
import { vuelidate } from '@/plugins/vuelidate'

const props = defineProps({
    label: { type: String },
    modelValue: { type: [String, Number, Object, null] },
    rules: { type: Array, default() { return [] } },
    clearable: { type: Boolean, default: true },
    outlined: { type: Boolean, default: true },
    placeholder: { type: String, default: '請輸入' },
    maxLength: { type: Number, default: 255 },
})
const emit = defineEmits(['update:modelValue'])

const { rules, maxLength } = toRefs(props)
const observeValue = ref('')
const input = ref()

const ruleList = computed(() => {
    const rule = []
    rule.push(vuelidate.maxLength(maxLength.value, `長度不可超過${maxLength.value}字`))
    return rule.concat(rules.value)
})

</script>
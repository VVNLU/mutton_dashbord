<template>
    <q-input class="q-pb-lg" ref="input" :label="label" v-model="observeValue" :clearable="clearable"
        :outlined="outlined" :placeholder="placeholder" :rules="ruleList">
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
</template>

<script setup>
import { computed, ref, toRefs, defineProps } from 'vue'
import { vuelidate } from '@/plugins/vuelidate'
import { useVModel } from '@vueuse/core'

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
const input = ref()
const observeValue = useVModel(props, 'modelValue', emit)

const ruleList = computed(() => {
    const rule = []
    rule.push(vuelidate.maxLength(maxLength.value, `長度不可超過${maxLength.value}字`))
    return rule.concat(rules.value)
})

</script>
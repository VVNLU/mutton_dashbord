<template>
    <div class="row page-header items-center justify-between q-mb-md">
        <div class="flex items-center">
            <SvgIcon v-if="showPrev" icon="arrow-left" class="cursor-pointer" size="24" @click="onPrev" />
            <h1 class="flex-center row page-title" :class="showPrev && 'cursor-pointer'" @click="onPrev">
                <slot />
            </h1>
        </div>
        <div v-if="$slot.action">
            <slot name="action" />
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router';

const props = defineProps({
    showPrev: { type: Boolean, default: false },
    goBackRoute: { type: String, default: '' }
})
const emit = defineEmits(['click:prev'])

const router = useRouter()
const onPrev = () => {
    if (props.showPrev) {
        emit('click:prev')
        if (props.goBackRoute) {
            return router.push(props.goBackRoute)
        }
        if (window.history.length === 2 && !window.history.back) {
            return router.replace('/')
        }
        router.go(-1)
    }
}
</script>

<style lang="scss" scoped>
.page-header {
    @apply min-h10;

    .page-title {
        @apply font-700 my-0 text-2xl
    }
}
</style>
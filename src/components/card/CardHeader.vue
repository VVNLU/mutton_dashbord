<template>
  <q-card-section>
    <slot name="header">
      <div class="row items-center justify-between">
        <div class="flex items-center">
          <div class="text-h6 card-title">
            <slot />
          </div>
        </div>
        <div v-if="$slots.action">
          <slot name="action" />
        </div>
      </div>
    </slot>
  </q-card-section>
</template>

<script setup></script>

<style lang="scss" scoped>
.card-title {
  @apply px-11px relative;

  &::before {
    @apply content-[""];
    @apply top-1/2 left-0 absolute;
    @apply transform -translate-y-1/2;
    @apply h-28px w-3px;
    @apply bg-primary;
  }
}
</style>

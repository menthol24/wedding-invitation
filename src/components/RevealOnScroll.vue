<script setup lang="ts">
import { useReveal } from '@/composables/useReveal'

withDefaults(
  defineProps<{
    /** 한 번 보이면 다시 숨기지 않음 */
    once?: boolean
  }>(),
  { once: true },
)

// InvitationSection 과 동일한 "떠오르며 페이드인" 연출을 공통으로 사용
const { el, revealed } = useReveal({ threshold: 0.15, once: true })
</script>

<template>
  <div ref="el" class="reveal" :class="{ 'is-revealed': revealed }">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.reveal {
  opacity: 0;
  transform: translateY(14px);
  transition:
    opacity 900ms cubic-bezier(0.22, 0.61, 0.36, 1),
    transform 900ms cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: opacity, transform;

  &.is-revealed {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    transition: none;
    opacity: 1;
    transform: none;
  }
}
</style>

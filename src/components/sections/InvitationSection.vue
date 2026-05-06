<script setup lang="ts">
import { useReveal } from '@/composables/useReveal'

defineProps<{
  headline: string
  paragraphs: string[][]
}>()

const { el, revealed } = useReveal({ threshold: 0.2 })
</script>

<template>
  <section ref="el" class="invite section-pad section-pad--wide" :class="{ 'is-revealed': revealed }">
    <div class="bg-circle" aria-hidden="true" />
    <h2 class="title">{{ headline }}</h2>
    <div class="body">
      <template v-for="(block, bi) in paragraphs" :key="bi">
        <p v-for="(line, li) in block" :key="`${bi}-${li}`" class="line">{{ line }}</p>
        <br v-if="bi < paragraphs.length - 1" />
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.invite {
  position: relative;
  text-align: center;
  overflow: hidden;
  height: 400px;
  margin-top: 100px !important;
  margin-bottom: 100px !important;

  // 섹션 전체가 한 번에 떠오르며 페이드인
  opacity: 0;
  transform: translateY(14px);
  transition:
    opacity 720ms cubic-bezier(0.22, 0.61, 0.36, 1),
    transform 720ms cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: opacity, transform;

  &.is-revealed {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: clamp(280px, 78vw, 380px);
  aspect-ratio: 1 / 1;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: rgba(248, 217, 222, 0.4);
  filter: blur(11px);
  pointer-events: none;
  z-index: 0;
}

.title,
.body {
  position: relative;
  z-index: 1;
}

.title {
  margin: 0 0 40px;
  font-family: $font-display;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-section-heading);
  letter-spacing: 0.01em;
  word-spacing: 0.02em !important;
}

.body {
  max-width: 23rem;
  margin: 0 auto;
}

.line {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.62;
  letter-spacing: -0.01em;
  color: var(--color-body);
  white-space: pre-line;

}

@media (prefers-reduced-motion: reduce) {
  .invite {
    transition: none;
    opacity: 1;
    transform: none;
  }
}
</style>

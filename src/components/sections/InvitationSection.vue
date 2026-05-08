<script setup lang="ts">
import { useReveal } from '@/composables/useReveal'

defineProps<{
  headline: string
  paragraphs: string[][]
}>()

const { el, revealed } = useReveal({ threshold: 0.2 })
</script>

<template>
  <section ref="el" class="invite section-pad section-pad--wide">
    <div class="card" :class="{ 'is-revealed': revealed }">
      <h2 class="heading">{{ headline }}</h2>
      <div class="body">
        <template v-for="(block, bi) in paragraphs" :key="bi">
          <p v-for="(line, li) in block" :key="`${bi}-${li}`" class="line">{{ line }}</p>
          <br v-if="bi < paragraphs.length - 1" />
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.invite {
  position: relative;
  text-align: center;
  overflow: hidden;
  min-height: 500px;
  background: var(--color-bg-medium);
}

.heading,
.body {
  position: relative;
  z-index: 1;
}

.heading {
  margin: 0 0 40px;
  font-size: $fs-lg;
  font-weight: 500;
  color: var(--color-section-heading);

  word-spacing: 0.02em !important;
}

.body {
  max-width: 23rem;
  margin: 0 auto;
}

.line {
  margin: 0;
  font-size: $fs-base;
  line-height: $lh-relaxed;
  letter-spacing: $ls-base;
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

.card {
  background: var(--color-surface);
  border-radius: 18px;
  padding: 18px 18px 26px;
  box-shadow: var(--shadow-soft);
  text-align: center;
  align-content: center;
  min-height: 300px;

  // 섹션 전체가 한 번에 떠오르며 페이드인
  opacity: 0;
  transform: translateY(14px);
  transition:
      opacity 2000ms cubic-bezier(0.22, 0.61, 0.36, 1),
      transform 2000ms cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: opacity, transform;

  &.is-revealed {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

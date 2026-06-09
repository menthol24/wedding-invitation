<script setup lang="ts">
import { useReveal } from '@/composables/useReveal'

defineProps<{
  headline: string
  paragraphs: string[][]
  envelopeUrl?: string
  envelopeAlt?: string
}>()

const { el, revealed } = useReveal({ threshold: 0.2 })
</script>

<template>
  <section ref="el" class="invite section-pad section-pad--wide">
    <div class="card" :class="{ 'is-revealed': revealed }">
      <!-- 봉투 이미지: 흰 편지지 영역 위에 문구가 올라감 -->
      <img
        v-if="envelopeUrl"
        :src="envelopeUrl"
        :alt="envelopeAlt || ''"
        class="envelope"
        loading="lazy"
        decoding="async"
      />
      <div class="paper">
        <h2 class="heading">{{ headline }}</h2>
        <div class="body">
          <template v-for="(block, bi) in paragraphs" :key="bi">
            <p v-for="(line, li) in block" :key="`${bi}-${li}`" class="line">{{ line }}</p>
          </template>
        </div>
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
  min-height: 600px;
  // 위쪽은 베이지(현재 섹션 색), 아래로 갈수록 다음 섹션(IntroductionSection)의
  // 흰색으로 자연스럽게 이어지는 세로 그라데이션
  background: linear-gradient(
    to bottom,
    var(--color-bg-medium) 0%,
    var(--color-bg-medium) 60%,
    var(--color-surface) 100%
  );
}

.heading {
  margin-top: 40px;
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
  margin-bottom: 8px;
  font-size: $fs-base;
  letter-spacing: $lh-relaxed;
  color: var(--color-body);

}

@media (prefers-reduced-motion: reduce) {
  .invite {
    transition: none;
    opacity: 1;
    transform: none;
  }
}

.card {
  position: relative;
  // 봉투 이미지(700x736)와 동일한 종횡비로 영역 확보
  aspect-ratio: 700 / 736;
  max-width: 26rem;
  margin: 0 auto;
  text-align: center;

  // 섹션 전체가 한 번에 떠오르며 페이드인
  opacity: 0;
  transform: translateY(14px);
  transition:
      opacity 2500ms cubic-bezier(0.22, 0.61, 0.36, 1),
      transform 2500ms cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: opacity, transform;

  &.is-revealed {
    opacity: 1;
    transform: translateY(0);
  }
}

// 봉투 배경 이미지
.envelope {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
}

// 흰 편지지 노출 영역에 맞춘 텍스트 박스
// (봉투 이미지 기준 가로 14~86%, 세로 13~68% 영역)
.paper {
  position: absolute;
  left: 15%;
  right: 15%;
  top: 14%;
  // 텍스트는 편지지 윗부분에 자연스럽게 위치
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

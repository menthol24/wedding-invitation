<script setup lang="ts">
import { useReveal } from '@/composables/useReveal'

export type LetterImage = {
  imageUrl: string
  alt?: string
}

defineProps<{
  title?: string
  imageUrl: string
  imageAlt?: string
  brideLetter: LetterImage
  groomLetter: LetterImage
}>()

const { el, revealed } = useReveal({ threshold: 0.2 })
</script>

<template>
  <section class="letter section-pad section-pad--wide" aria-labelledby="letter-heading">
    <h2 v-if="title" id="letter-heading" class="title">{{ title }}</h2>

    <div ref="el" class="stage" :class="{ 'is-revealed': revealed }">
      <figure class="photo">
        <img :src="imageUrl" :alt="imageAlt ?? ''" loading="lazy" decoding="async" />
      </figure>

      <!-- 신부 손글씨 — 사진 좌상단 영역에 자연스럽게 얹힘 -->
      <img
        class="handwriting handwriting--bride"
        :src="brideLetter.imageUrl"
        :alt="brideLetter.alt ?? ''"
        loading="lazy"
        decoding="async"
      />

      <!-- 신랑 손글씨 — 사진 우하단 영역에 자연스럽게 얹힘 -->
      <img
        class="handwriting handwriting--groom"
        :src="groomLetter.imageUrl"
        :alt="groomLetter.alt ?? ''"
        loading="lazy"
        decoding="async"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.letter {
  padding: 150px 0px !important;
}

.stage {
  position: relative;
  width: 100%;
}

.photo {
  margin: 0;
  width: 100%;

  img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }
}

// 손글씨 — 투명 PNG, 사진 위에 겹쳐서 자연스럽게
.handwriting {
  position: absolute;
  width: 60%;
  height: auto;
  pointer-events: none;
  user-select: none;
  // 종이/잉크 느낌 — 사진과 어우러지도록 약간의 그림자
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.10));

  // 스크롤 reveal — 좌/우에서 미끄러져 들어오며 페이드인
  opacity: 0;
  transition:
    opacity 1400ms cubic-bezier(0.22, 0.61, 0.36, 1),
    transform 1400ms cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: opacity, transform;
}

// 신부 — 좌상단 영역, 왼쪽에서 슬라이드 인
.handwriting--bride {
  top: -18%;
  left: 2%;
  transform: translateX(-24px);
}

// 신랑 — 우하단 영역, 오른쪽에서 슬라이드 인 (살짝 늦게)
.handwriting--groom {
  bottom: -15%;
  right: 0%;
  transform: translateX(22px);
  transition-delay: 300ms;
}

.stage.is-revealed .handwriting {
  opacity: 1;
  transform: translateX(0);
}

@media (prefers-reduced-motion: reduce) {
  .handwriting {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>

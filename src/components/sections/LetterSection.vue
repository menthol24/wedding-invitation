<script setup lang="ts">
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
</script>

<template>
  <section class="letter section-pad section-pad--wide" aria-labelledby="letter-heading">
    <h2 v-if="title" id="letter-heading" class="title">{{ title }}</h2>

    <div class="stage">
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
  width: 50%;
  height: auto;
  pointer-events: none;
  user-select: none;
  // 종이/잉크 느낌 — 사진과 어우러지도록 약간의 그림자
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.10));
}

// 신부 — 좌상단 영역
.handwriting--bride {
  top: -20%;
  left: 4%;
}

// 신랑 — 우하단 영역
.handwriting--groom {
  bottom: -10%;
  right: 4%;
}
</style>

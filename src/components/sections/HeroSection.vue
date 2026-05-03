<script setup lang="ts">
defineProps<{
  imageUrl: string
  titleLines: string[]
}>()
</script>

<template>
  <section class="hero" aria-label="웰컴 영역">
    <div class="hero__photo">
      <img :src="imageUrl" alt="" width="430" height="780" decoding="async" fetchpriority="high" />
      <div class="hero__veil" aria-hidden="true" />
      <div class="hero__copy">
        <p v-for="(line, i) in titleLines" :key="i" class="hero__line">{{ line }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.hero {
  position: relative;
  width: 100%;
}

.hero__photo {
  position: relative;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 9 / 16;
  max-height: min(92vh, 760px);
  margin-bottom: -1px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 24%;
    display: block;
  }
}

.hero__veil {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      180deg,
      rgba(32, 28, 26, 0.08) 0%,
      rgba(32, 28, 26, 0.02) 40%,
      rgba(250, 249, 247, 0.25) 86%,
      var(--color-bg) 100%
    );
  pointer-events: none;
}

.hero__veil::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -40px;
  height: 80px;
  background: linear-gradient(
    180deg,
    rgba(250, 249, 247, 0) 0%,
    var(--color-bg) 55%,
    var(--color-bg) 100%
  );
}

.hero__copy {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  text-align: center;
  padding: 56px 24px 52px;
  pointer-events: none;
}

.hero__line {
  display: inline-block;
  margin: 0;
  font-family: $font-hero-script;
  font-size: clamp(2.35rem, 9vw, 3.1rem);
  font-weight: 400;
  letter-spacing: 0.04em;
  line-height: 1.3;
  color: var(--color-hero-gold);

  white-space: nowrap;

  opacity: 0;
  clip-path: inset(0 100% 0 0);
  animation: handwritingReveal 1.8s ease forwards;

  &:nth-child(2) {
    animation-delay: 1.1s;
  }
}

@keyframes handwritingReveal {
  0% {
    opacity: 0;
    clip-path: inset(0 100% 0 0);
  }

  1% {
    opacity: 1;
  }

  100% {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }
}
</style>

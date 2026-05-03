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
  background: linear-gradient(
    180deg,
    rgba(32, 28, 26, 0.12) 0%,
    rgba(32, 28, 26, 0.02) 40%,
    rgba(250, 247, 242, 0.45) 100%
  );
  pointer-events: none;
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
  margin: 0;
  font-family: $font-hero-script;
  font-size: clamp(2.35rem, 9vw, 3.1rem);
  font-weight: 400;
  letter-spacing: 0.04em;
  line-height: 1.15;
  color: var(--color-hero-gold);
  text-shadow:
    0 1px 2px rgba(255, 255, 255, 0.35),
    0 2px 18px rgba(28, 22, 18, 0.35);

  &:not(:last-child) {
    margin-bottom: 0.02em;
  }
}
</style>

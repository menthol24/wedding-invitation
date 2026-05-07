<script setup lang="ts">
export interface TimelinePiece {
  year?: string
  text: string
  photoUrl: string
  alt?: string
}

defineProps<{
  title: string
  items: TimelinePiece[]
}>()
</script>

<template>
  <section class="tl section-pad section-pad--wide" aria-labelledby="tl-heading">
    <h2 id="tl-heading" class="title">{{ title }}</h2>

    <div class="axis">
      <div v-for="(it, idx) in items" :key="idx" class="row" :class="{ 'row--flip': idx % 2 === 1 }">
        <figure class="fig">
          <img :src="it.photoUrl" :alt="it.alt ?? ''" loading="lazy" decoding="async" />
        </figure>
        <div class="content">
          <p v-if="it.year" class="year">{{ it.year }}</p>
          <p class="text">{{ it.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.title {
  margin: 0 0 48px;
  text-align: center;
  font-size: 1.38rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--color-section-heading);
}

.axis {
  position: relative;
  padding-inline: clamp(8px, 3vw, 18px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 40px;
    left: 50%;
    width: 1px;
    background: rgb(69 69 69 / 15%);
    transform: translateX(-0.5px);
  }
}

// axis 양옆에 사진/텍스트가 1:1 로 분리되는 레이아웃
.row {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 28px 1fr; // 좌 | axis 닷 영역 | 우
  align-items: center;
  column-gap: 0;
  margin-bottom: 46px;

  &:last-child {
    margin-bottom: 0;
  }

  // axis 위 닷
  &::before {
    content: '';
    grid-column: 2;
    justify-self: center;
    align-self: center;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    border: 2px solid var(--color-surface);
    background: var(--color-section-heading);
    box-shadow: 0 0 0 3px rgba(169, 120, 134, 0.12);
    z-index: 1;
    pointer-events: none;
  }
}

// 기본(짝수 row) — 사진 왼쪽, 텍스트 오른쪽
.row .fig {
  grid-column: 1;
  grid-row: 1;
  justify-self: end;
  padding-right: 12px;
}

.row .content {
  grid-column: 3;
  grid-row: 1;
  justify-self: start;
  padding-left: 10px;
  text-align: left;
}

// row--flip (홀수 row) — 텍스트 왼쪽, 사진 오른쪽
.row--flip .fig {
  grid-column: 3;
  justify-self: start;
  padding-right: 0;
  padding-left: 10px;
}

.row--flip .content {
  grid-column: 1;
  justify-self: end;
  padding-left: 0;
  padding-right: 12px;
  text-align: right;
}

.fig {
  margin: 0;
  width: 100%;
  max-width: 160px;

  img {
    display: block;
    width: 100%;
    border-radius: var(--radius-photo);
    aspect-ratio: 1 / 1;
    object-fit: cover;
    box-shadow: 0 4px 14px rgba(42, 36, 34, 0.06);
  }
}

.content {
  width: 100%;
}

.year {
  margin: 0 0 8px;
  font-family: $font-display;
  font-size: 0.98rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--color-section-heading);
}

.text {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.45;
  color: var(--color-body-muted);
  letter-spacing: 0.01em;
}
</style>

<script setup lang="ts">
export type TmiItem = {
  id: string
  icon: string
  label: string
  lines: string[]
  imageUrl?: string
  imageAlt?: string
}

defineProps<{
  title?: string
  intro?: string
  items: TmiItem[]
}>()
</script>

<template>
  <section class="tmi section-pad" aria-labelledby="tmi-heading">
    <h2 id="tmi-heading" class="title">{{ title ?? 'TMI' }}</h2>

    <p v-if="intro" class="intro">{{ intro }}</p>

    <div class="list">
      <div v-for="item in items" :key="item.id" class="block">
        <h3 class="sub">{{ item.icon }} {{ item.label }}</h3>
        <p
          v-for="(ln, i) in item.lines"
          :key="i"
          class="para"
          v-html="ln"
        ></p>

        <!-- 사진이 있는 항목(예: 결혼반지)만 이미지/플레이스홀더 표시 -->
        <figure v-if="'imageUrl' in item" class="figure">
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.imageAlt || ''"
            loading="lazy"
            decoding="async"
          />
          <div v-else class="placeholder" aria-hidden="true">
            <span class="placeholder__icon">{{ item.icon }}</span>
            <span class="placeholder__text">사진 준비 중</span>
          </div>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.intro {
  // 공통 .title 의 하단 36px 여백을 일부 상쇄해 제목과 간격을 맞춤
  margin: -20px 0 36px;
  text-align: center;
  font-size: $fs-base;
  line-height: $lh-relaxed;
  color: var(--color-body-muted);
}

// LOCATION 섹션의 교통안내(.block/.sub/.para)와 동일한 규격
.block {
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
}

.sub {
  margin: 0 0 10px;
  font-size: $fs-base;
  font-weight: 600;
  color: var(--color-section-item-heading);
  border-bottom: 0.5px solid var(--color-body-very-light-grey);
  line-height: 2;
}

.para {
  margin: 0 0 2px;
  font-size: $fs-base;
  line-height: $lh-base;
  color: var(--color-body-muted);

  &:last-child {
    margin-bottom: 0;
  }

  // v-html 형광펜 강조 — VENUE GUIDE 와 동일 톤
  :deep(mark.hl) {
    background: rgba(255, 221, 119, 0.58);
    color: inherit;
    font-weight: 600;
    padding: 1px 3px;
    border-radius: 2px;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }
}

.figure {
  margin: 14px 0 0;

  img {
    width: 100%;
    display: block;
    border-radius: var(--radius-photo);
    object-fit: cover;
    aspect-ratio: 4 / 3;
    border: 1px solid var(--color-border);
  }
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-photo);
  border: 1px dashed var(--color-accent);
  background: var(--color-accent-soft);
  color: var(--color-body-light-grey);
}

.placeholder__icon {
  font-size: 1.6rem;
  opacity: 0.7;
}

.placeholder__text {
  font-size: $fs-xs;
  letter-spacing: $ls-wide;
}
</style>

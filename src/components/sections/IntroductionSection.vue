<script setup lang="ts">
defineProps<{
  groom: {
    roleLabel: string
    givenName: string
    parentsLine: string
    photoUrl?: string
    alt?: string
  }
  bride: {
    roleLabel: string
    givenName: string
    parentsLine: string
    photoUrl?: string
    alt?: string
  }
  introducePhoto: string
}>()
</script>

<template>
  <section class="intro section-pad section-pad--wide" aria-labelledby="intro-heading">
    <article class="card">
      <div class="text">
        <div class="groom-name">
          <div class="parents">{{ groom.parentsLine }}</div>
          <div class="name-line">
            <span class="role">{{ groom.roleLabel }}</span>
            <span class="given">{{ groom.givenName }}</span>
          </div>
        </div>
        <div class="rule" aria-hidden="true" />
      </div>
    </article>

    <article class="card card--reverse">
      <div class="text">
        <div class="bride-name">
          <div class="parents">{{ bride.parentsLine }}</div>
          <div class="name-line">
            <span class="role">{{ bride.roleLabel }}</span>
            <span class="given">{{ bride.givenName }}</span>
          </div>
        </div>
        <div class="rule" aria-hidden="true" />
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

// 신랑·신부 프로필 사진 — 정사각형 2개를 한 줄에 나란히
.photos {
  margin-bottom: 28px;
  img {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    display: block;
    border-radius: var(--radius-photo);
    border: 1px solid var(--color-border);
  }
}

.card {
  padding: 10px;
  background: var(--color-surface);

  &:last-child {
    margin-bottom: 0;
  }
}

.text--end {
  text-align: right;
}

.name-line {
  margin: 0;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px 8px;

  &--end {
    justify-content: flex-end;
  }
}

.role {
  font-size: $fs-base;
  font-weight: 600;
  letter-spacing: $ls-wider;
  color: var(--color-section-heading);
}

// 신랑 카드(첫 번째)는 청록, 신부 카드(.card--reverse)는 진한 분홍
.card:not(.card--reverse) .role {
  color: var(--color-role-groom);
}

.card--reverse .role {
  color: var(--color-role-bride);
}

.given {
  font-family: $font-body;
  font-size: $fs-md;
  font-weight: 500;
  letter-spacing: $ls-wide;
  color: var(--color-body);
}

.rule {
  height: 1px;
  background: rgba(72, 58, 54, 0.12);
  margin: 12px 0 14px;
  max-width: 100%;

  &--end {
    width: 95%;
    margin-left: auto;
    margin-right: 0;
  }
}

.parents {
  margin: 0;
  font-size: $fs-base;
  color: var(--color-body-muted);
}

@media (max-width: 360px) {
  .card {
    text-align: center;
  }

  .text--end {
    text-align: center;
  }

  .name-line--end {
    justify-content: center;
  }

  .rule--end {
    margin-left: auto;
    margin-right: auto;
  }
}

.groom-name, .bride-name {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>

<script setup lang="ts">
defineProps<{
  groom: {
    roleLabel: string
    givenName: string
    parentsLine: string
  }
  bride: {
    roleLabel: string
    givenName: string
    parentsLine: string
  }
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
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.14em;
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
  font-family: $font-display;
  font-size: 1.18rem;
  font-weight: 500;
  letter-spacing: 0.05em;
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
  font-size: 0.86rem;
  line-height: 1.78;
  letter-spacing: 0.02em;
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

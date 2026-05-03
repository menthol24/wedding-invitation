<script setup lang="ts">
defineProps<{
  groom: {
    roleLabel: string
    givenName: string
    parentsLine: string
    photoUrl: string
    alt: string
  }
  bride: {
    roleLabel: string
    givenName: string
    parentsLine: string
    photoUrl: string
    alt: string
  }
}>()
</script>

<template>
  <section class="couple section-pad section-pad--wide" aria-labelledby="couple-heading">
    <h2 id="couple-heading" class="heading">두 사람 이야기</h2>

    <article class="card">
      <div class="text">
        <h3 class="name-line">
          <span class="role">{{ groom.roleLabel }}</span>
          <span class="given">{{ groom.givenName }}</span>
        </h3>
        <div class="rule" aria-hidden="true" />
        <p class="parents">{{ groom.parentsLine }}</p>
      </div>
      <figure class="photo-wrap">
        <img :src="groom.photoUrl" :alt="groom.alt" width="640" height="800" decoding="async" />
      </figure>
    </article>

    <article class="card card--reverse">
      <figure class="photo-wrap">
        <img :src="bride.photoUrl" :alt="bride.alt" width="640" height="800" decoding="async" />
      </figure>
      <div class="text text--end">
        <h3 class="name-line name-line--end">
          <span class="role">{{ bride.roleLabel }}</span>
          <span class="given">{{ bride.givenName }}</span>
        </h3>
        <div class="rule rule--end" aria-hidden="true" />
        <p class="parents">{{ bride.parentsLine }}</p>
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.heading {
  margin: 0 0 44px;
  text-align: center;
  font-family: $font-display;
  font-size: 1.38rem;
  font-weight: 500;
  letter-spacing: 0.07em;
  color: var(--color-section-heading);
}

.card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: center;
  padding: 22px;
  margin-bottom: 28px;
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow-lift);
  border: 1px solid var(--color-border);

  &:last-child {
    margin-bottom: 0;
  }
}

.card--reverse {
  direction: rtl;
}

.card--reverse .text,
.card--reverse .photo-wrap {
  direction: ltr;
}

.text {
  padding: 4px 2px;
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
    width: 85%;
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

.photo-wrap {
  margin: 0;
}

.photo-wrap img {
  width: 100%;
  height: clamp(148px, 38vw, 198px);
  object-fit: cover;
  border-radius: var(--radius-photo);
  box-shadow: var(--shadow-soft);
}

@media (max-width: 360px) {
  .card {
    grid-template-columns: 1fr;
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

  .card--reverse {
    direction: ltr;
  }

  .card--reverse .photo-wrap {
    order: -1;
  }
}
</style>

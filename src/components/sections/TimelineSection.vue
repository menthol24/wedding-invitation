<script setup lang="ts">
export interface TimelinePiece {
  year?: string
  text: string
  photoUrl: string
  alt?: string
}

defineProps<{ items: TimelinePiece[] }>()
</script>

<template>
  <section class="tl section-pad section-pad--wide" aria-labelledby="tl-heading">
    <h2 id="tl-heading" class="heading">우리의 시간</h2>

    <div class="axis">
      <div v-for="(it, idx) in items" :key="idx" class="row" :class="{ 'row--flip': idx % 2 === 1 }">
        <div class="card card--leading">
          <figure class="fig">
            <img :src="it.photoUrl" :alt="it.alt ?? ''" loading="lazy" decoding="async" />
          </figure>
          <div class="content">
            <p v-if="it.year" class="year">{{ it.year }}</p>
            <p class="text">{{ it.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.heading {
  margin: 0 0 48px;
  text-align: center;
  font-family: $font-display;
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
    background: rgba(169, 120, 134, 0.15);
    transform: translateX(-0.5px);
  }
}

.row {
  position: relative;
  display: grid;
  margin-bottom: 46px;

  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    content: '';
    position: absolute;
    top: clamp(118px, 30vw, 142px);
    left: 50%;
    transform: translate(-50%, -50%);
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

.card {
  width: calc(50% - 14px);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.row:not(.row--flip) .card {
  justify-self: start;
}

.row--flip .card {
  justify-self: end;
  grid-column: 1;
}

.fig {
  margin: 0 0 10px;

  img {
    display: block;
    width: 100%;
    border-radius: var(--radius-photo);
    aspect-ratio: 1 / 1;
    object-fit: cover;
    box-shadow: 0 4px 14px rgba(42, 36, 34, 0.06);
  }
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
  line-height: 1.2;
  color: var(--color-body-muted);
  letter-spacing: 0.01em;
}

@media (max-width: 380px) {
  .axis::before {
    left: calc(22px + env(safe-area-inset-left, 0));
    transform: none;
  }

  .row::before {
    left: calc(22px + env(safe-area-inset-left, 0));
  }

  .card {
    width: calc(100% - 62px - env(safe-area-inset-left, 0));
    margin-inline-start: 52px;
  }

  .row--flip .card {
    justify-self: start;
  }
}
</style>

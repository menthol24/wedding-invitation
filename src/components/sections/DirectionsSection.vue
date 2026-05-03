<script setup lang="ts">
import NaverMapEmbed from '@/components/map/NaverMapEmbed.vue'

defineProps<{
  venueTitle: string
  hallLine: string
  phone: string
  address: string
  map: {
    lat: number
    lng: number
    zoom: number
  }
  navigationLinks: { label: string; href: string }[]
}>()

const naverClientId = String(import.meta.env.VITE_NAVER_MAP_CLIENT_ID ?? '')
</script>

<template>
  <section class="dir section-pad section-pad--wide" aria-labelledby="dir-heading">
    <h2 id="dir-heading" class="title">오시는 길</h2>

    <div class="info">
      <div class="venue-row">
        <span class="venue-name">{{ venueTitle }}</span>
        <a
          class="tel-icon"
          :href="`tel:${phone.replace(/\D/g, '')}`"
          aria-label="전화 걸기"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V21c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
              fill="currentColor"
            />
          </svg>
        </a>
      </div>
      <p class="hall">{{ hallLine }}</p>
      <p class="phone-line">
        <a class="phone" :href="`tel:${phone.replace(/\D/g, '')}`">{{ phone }}</a>
      </p>
      <p class="addr">{{ address }}</p>
    </div>

    <div class="map-shell">
      <NaverMapEmbed :ncp-client-id="naverClientId" :lat="map.lat" :lng="map.lng" :zoom="map.zoom" />
    </div>

    <div class="apps">
      <a
        v-for="lnk in navigationLinks"
        :key="lnk.label"
        class="app-btn"
        :href="lnk.href"
        rel="noopener noreferrer"
      >
        {{ lnk.label }}
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.title {
  margin: 0 0 40px;
  text-align: center;
  font-family: $font-display;
  font-size: 1.38rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--color-section-heading);
}

.info {
  text-align: center;
  margin-bottom: 32px;
}

.venue-row {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.venue-name {
  margin: 0;
  font-size: 1.08rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-body);
}

.tel-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  color: var(--color-section-heading);
  background: rgba(212, 163, 163, 0.12);
  border: 1px solid rgba(212, 163, 163, 0.25);
  transition:
    background 0.15s ease,
    transform 0.15s ease;

  &:hover {
    background: rgba(212, 163, 163, 0.2);
  }

  &:active {
    transform: scale(0.96);
  }
}

.hall {
  margin: 12px 0 12px;
  font-size: 0.88rem;
  color: var(--color-body-muted);
  letter-spacing: 0.03em;
}

.phone-line {
  margin: 0 0 14px;
}

.phone {
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--color-body-muted);
  text-decoration: none;
  border-bottom: 1px solid rgba(72, 58, 54, 0.12);
  padding-bottom: 2px;

  &:hover {
    color: var(--color-section-heading);
    border-bottom-color: rgba(196, 149, 149, 0.45);
  }
}

.addr {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.85;
  color: var(--color-body-muted);
  letter-spacing: 0.01em;
  max-width: 19rem;
  margin-inline: auto;
}

.map-shell {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-bg-soft);
  box-shadow: var(--shadow-lift);
  aspect-ratio: 4 / 3;
}

.map-shell :deep(.wrapper) {
  min-height: 100%;
  height: 100%;
}

.apps {
  display: flex;
  gap: 8px;
  margin-top: 28px;

  .app-btn {
    flex: 1;
    text-align: center;
    text-decoration: none;
    padding: 12px 6px;
    border-radius: 4px;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.03em;
    color: var(--color-body);
    border: 1px solid rgba(72, 58, 54, 0.1);
    background: var(--color-surface);
    transition:
      border-color 180ms ease,
      background-color 180ms ease;

    &:hover {
      border-color: rgba(196, 149, 149, 0.35);
      background: #fffdfb;
    }

    &:active {
      transform: translateY(1px);
    }
  }
}
</style>

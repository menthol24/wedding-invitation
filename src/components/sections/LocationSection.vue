<script setup lang="ts">
import NaverMapEmbed from '@/components/map/NaverMapEmbed.vue'
import tmapIcon from '@/assets/images/icons/tmap.svg'
import kakaomapIcon from '@/assets/images/icons/kakaomap.svg'
import navermapIcon from '@/assets/images/icons/navermap.jpg'

export type TransportBlock = { subtitle: string; lines: string[] }

defineProps<{
  title?: string
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
  transportBlocks?: readonly TransportBlock[]
}>()

const naverClientId = String(import.meta.env.VITE_NAVER_MAP_CLIENT_ID ?? '')

// 버튼 라벨 → 아이콘 매핑
const navIconMap: Record<string, string> = {
  '티맵': tmapIcon,
  '카카오맵': kakaomapIcon,
  '네이버지도': navermapIcon,
}

function iconFor(label: string): string | undefined {
  return navIconMap[label]
}
</script>

<template>
  <section class="location section-pad section-pad--wide" aria-labelledby="location-heading">
    <h2 v-if="title" id="location-heading" class="title">{{ title }}</h2>

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
        <img
          v-if="iconFor(lnk.label)"
          :src="iconFor(lnk.label)"
          :alt="''"
          class="app-btn__icon"
          aria-hidden="true"
          decoding="async"
        />
        <span class="app-btn__label">{{ lnk.label }}</span>
      </a>
    </div>

    <div v-if="transportBlocks && transportBlocks.length" class="transport">
      <div v-for="(b, i) in transportBlocks" :key="i" class="block">
        <h3 class="sub">{{ b.subtitle }}</h3>
        <p v-for="(ln, li) in b.lines" :key="li" class="para">{{ ln }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

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
  margin-bottom: 10px;
}

.venue-name {
  margin: 0;
  font-size: $fs-md;
  font-weight: 600;

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
  transition: background 0.15s ease, transform 0.15s ease;

  &:hover {
    background: rgba(212, 163, 163, 0.2);
  }

  &:active {
    transform: scale(0.96);
  }
}

.addr {
  margin: 0;
  font-size: $fs-base;
  line-height: $lh-relaxed;
  color: var(--color-body-muted);
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    text-align: center;
    text-decoration: none;
    padding: 12px 6px;
    border-radius: 4px;
    font-size: $fs-xs;
    font-weight: 500;
    color: var(--color-body);
    border: 1px solid rgba(72, 58, 54, 0.1);
    background: var(--color-surface);
    transition: border-color 180ms ease, background-color 180ms ease;

    &:hover {
      border-color: rgba(196, 149, 149, 0.35);
      background: #fffdfb;
    }

    &:active {
      transform: translateY(1px);
    }
  }

  .app-btn__icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .app-btn__label {
    line-height: $lh-flat;
  }
}

// 교통 안내 — 지도/길찾기 아래에 이어 붙는 영역
.transport {
  margin-top: 36px;
}

.block {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.sub {
  margin: 0 0 10px;
  font-size: $fs-base;
  font-weight: 600;
  color: var(--color-section-item-heading);

}

.para {
  margin: 0 0 2px;
  font-size: $fs-base;
  line-height: $lh-base;
  color: var(--color-body-muted);


  &:last-child {
    margin-bottom: 0;
  }
}
</style>

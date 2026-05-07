<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import FloatingActions from '@/components/FloatingActions.vue'
import PosterSection from '@/components/sections/PosterSection.vue'
import InvitationSection from '@/components/sections/InvitationSection.vue'
import IntroSection from '@/components/sections/IntroSection.vue'
import ProfileSection from '@/components/sections/ProfileSection.vue'
import CalendarCountdownSection from '@/components/sections/CalendarCountdownSection.vue'
import GallerySection from '@/components/sections/GallerySection.vue'
import DirectionsSection from '@/components/sections/DirectionsSection.vue'
import TransportInfoSection from '@/components/sections/TransportInfoSection.vue'
import VenueGuideTabsSection from '@/components/sections/VenueGuideTabsSection.vue'
import TimelineSection from '@/components/sections/TimelineSection.vue'
import GuestBookSection from '@/components/sections/GuestBookSection.vue'
import AccountsSection from '@/components/sections/AccountsSection.vue'

import {
  WEDDING_EVENT_ISO,
  weddingPoster,
  ceremonyInfo,
  invitationSection,
  couplesSection,
  profileSection,
  countdownSection,
  gallerySection,
  directionsSection,
  transportInfo,
  venueGuideTabs,
  timelineSection,
  guestbookIntro,
  accountsSection,
} from '@/mocks/wedding.mock'

const isLoading = ref(true)

// 로딩 중에는 body 스크롤을 잠가 두 화면이 동시에 스크롤되는 어색함을 방지
watchEffect(() => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = isLoading.value ? 'hidden' : ''
})

function handleLoadingDone() {
  isLoading.value = false
}
</script>

<template>
  <LoadingScreen
    :preload-images="[weddingPoster.imageUrl]"
    :min-duration="2800"
    :max-duration="6000"
    groom-name="Koo One"
    bride-name="Yoo Minsun"
    @done="handleLoadingDone"
  />

  <div class="app" :class="{ 'app--ready': !isLoading }">
    <main class="canvas">
      <PosterSection
        :image-url="weddingPoster.imageUrl"
        :title-lines="weddingPoster.titleLines"
        :groom-name="couplesSection.groom.givenName"
        :bride-name="couplesSection.bride.givenName"
        :play="!isLoading"
        :date-label="ceremonyInfo.dateLabel"
        :venue-name="ceremonyInfo.venueName"
      />

      <div class="content">
        <InvitationSection
          :headline="invitationSection.headline"
          :paragraphs="invitationSection.paragraphs"
        />

        <IntroSection
          :groom="couplesSection.groom"
          :bride="couplesSection.bride"
        />

        <ProfileSection
          :title="profileSection.title"
          :cards="profileSection.cards"
        />

        <TimelineSection
            :title="timelineSection.title"
            :items="timelineSection.items" />

        <CalendarCountdownSection
          :wedding-iso="WEDDING_EVENT_ISO"
          :title-lines="countdownSection.titleLines"
          :calendar-year="countdownSection.calendarYear"
          :calendar-month-index="countdownSection.calendarMonthIndex"
          :highlighted-day="countdownSection.highlightedDay"
          :ceremony-time-short="countdownSection.ceremonyTimeShort"
          :countdown-headline="countdownSection.countdownHeadline"
          :meet-since-iso="countdownSection.meetSinceIso"
          :dday-headline="countdownSection.ddayHeadline"
        />

        <GallerySection
          :title="gallerySection.title"
          :items="gallerySection.items"
        />

        <DirectionsSection v-bind="directionsSection" />

        <TransportInfoSection :blocks="transportInfo.blocks" />

        <VenueGuideTabsSection :tabs="venueGuideTabs" />

        <GuestBookSection
          :title="guestbookIntro.title"
          :empty-message-lines="guestbookIntro.emptyMessageLines"
        />

        <AccountsSection v-bind="accountsSection" />

        <footer class="foot">
          <p class="foot__message">앞으로도 행복하게 살겠습니다!</p>
          <p class="foot__signoff">구원, 민선 드림</p>
        </footer>
      </div>
    </main>

    <FloatingActions />
  </div>
</template>

<style lang="scss">
@use '@/styles/variables' as *;

.app {
  min-height: 100vh;
  /** 데스크톱에서 양 옆 라이트 그레이 */
  background-color: var(--color-bg-soft);

  // 로딩 종료 시 본문이 부드럽게 등장
  opacity: 0;
  transition: opacity 0.7s ease;

  &--ready {
    opacity: 1;
  }
}

// 모바일(캔버스 max-width 이하)에서는 좌우 회색 배경/보더가 보이지 않도록 꽉 채움
@media (max-width: 480px) {
  .app {
    background-color: #ffffff;
  }

  .canvas {
    max-width: none;
    width: 100%;
    border-left: none;
    border-right: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app {
    transition: none;
    opacity: 1;
  }
}

.canvas {
  max-width: var(--page-max);
  margin: 0 auto;
  min-height: 100vh;
  background: #ffffff;
  border-left: 1px solid rgba(72, 58, 54, 0.05);
  border-right: 1px solid rgba(72, 58, 54, 0.05);
}

.canvas .content {
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
}

.canvas .section-pad {
  padding-top: clamp(78px, 20vw, 118px);
  padding-bottom: clamp(76px, 17vw, 112px);
  padding-inline: 18px;
  align-content: center;
}

// 모든 섹션 헤더(.title)는 $font-title 폰트를 사용 — 사이즈/마진 등 개별 디테일은 각 섹션에서 정의
.canvas .title {
  font-family: $font-title;
}

.canvas .foot {
  text-align: center;
  padding: 56px 24px calc(96px + env(safe-area-inset-bottom));
  color: var(--color-body-muted);
}

.canvas .foot__message {
  margin: 0;
  font-family: $font-title;
  font-size: 1.05rem;
  letter-spacing: 0.16em;
  line-height: 1.6;
  color: var(--color-section-heading);
}

.canvas .foot__divider {
  display: block;
  width: 28px;
  height: 1px;
  margin: 18px auto;
  background: var(--color-accent);
  opacity: 0.55;
}

.canvas .foot__signoff {
  margin: 0;
  font-family: $font-body;
  font-size: 1.1rem;
  color: var(--color-body-muted);
  margin-top: 15px;
}
</style>

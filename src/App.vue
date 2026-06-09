<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import FloatingActions from '@/components/FloatingActions.vue'
import PosterSection from '@/components/sections/PosterSection.vue'
import InvitationSection from '@/components/sections/InvitationSection.vue'
import IntroductionSection from '@/components/sections/IntroductionSection.vue'
import ProfileSection from '@/components/sections/ProfileSection.vue'
import CalendarSection from '@/components/sections/CalendarSection.vue'
import GallerySection from '@/components/sections/GallerySection.vue'
import LocationSection from '@/components/sections/LocationSection.vue'
import VenueGuideTabsSection from '@/components/sections/VenueGuideTabsSection.vue'
import TimelineSection from '@/components/sections/TimelineSection.vue'
import GuestBookSection from '@/components/sections/GuestBookSection.vue'
import LetterSection from '@/components/sections/LetterSection.vue'
import AccountsSection from '@/components/sections/AccountsSection.vue'
import FooterSection from '@/components/sections/FooterSection.vue'

import { getWeddingMock } from '@/mocks'
import { useLocale } from '@/composables/useLocale'

const { locale } = useLocale()

const mock = computed(() => getWeddingMock(locale.value))

// 섹션별 데이터 — locale 변경 시 자동 갱신
const WEDDING_EVENT_ISO = computed(() => mock.value.WEDDING_EVENT_ISO)
const posterSection = computed(() => mock.value.posterSection)
const ceremonySection = computed(() => mock.value.ceremonySection)
const invitationSection = computed(() => mock.value.invitationSection)
const introduceSection = computed(() => mock.value.introduceSection)
const profileSection = computed(() => mock.value.profileSection)
const calendarSection = computed(() => mock.value.calendarSection)
const gallerySection = computed(() => mock.value.gallerySection)
const locationSection = computed(() => mock.value.locationSection)
const venueGuideSection = computed(() => mock.value.venueGuideSection)
const timelineSection = computed(() => mock.value.timelineSection)
const guestbookSection = computed(() => mock.value.guestbookSection)
const letterSection = computed(() => mock.value.letterSection)
const accountsSection = computed(() => mock.value.accountsSection)
const footerSection = computed(() => mock.value.footerSection)
const shareSection = computed(() => mock.value.shareSection)
const loadingSection = computed(() => mock.value.loadingSection)

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
    :preload-images="[posterSection.imageUrl]"
    :min-duration="2800"
    :max-duration="6000"
    :groom-name="loadingSection.groomName"
    :bride-name="loadingSection.brideName"
    @done="handleLoadingDone"
  />

  <div class="app" :class="{ 'app--ready': !isLoading }">
    <main class="canvas">
      <PosterSection
        :image-url="posterSection.imageUrl"
        :title-lines="posterSection.titleLines"
        :groom-name="introduceSection.groom.givenName"
        :bride-name="introduceSection.bride.givenName"
        :role-labels="posterSection.roleLabels"
        :play="!isLoading"
        :date-label="ceremonySection.dateLabel"
        :venue-name="ceremonySection.venueName"
      />

      <div class="content">
        <InvitationSection
          :headline="invitationSection.headline"
          :paragraphs="invitationSection.paragraphs"
          :envelope-url="invitationSection.envelopeUrl"
          :envelope-alt="invitationSection.envelopeAlt"
        />

        <IntroductionSection
          :groom="introduceSection.groom"
          :bride="introduceSection.bride"
          :introducePhoto="introduceSection.introducePhoto"
        />

        <ProfileSection
          :title="profileSection.title"
          :cards="profileSection.cards"
        />

        <TimelineSection
            :title="timelineSection.title"
            :items="timelineSection.items"
            :meet-since-iso="calendarSection.meetSinceIso"
            :dday-label="calendarSection.ddayHeadline"
            :since-units="timelineSection.sinceUnits" />

        <CalendarSection
          :title="calendarSection.title"
          :wedding-iso="WEDDING_EVENT_ISO"
          :wedding-day="calendarSection.weddingDay"
          :wedding-day-eng="calendarSection.weddingDayEng"
          :calendar-year="calendarSection.calendarYear"
          :calendar-month-index="calendarSection.calendarMonthIndex"
          :highlighted-day="calendarSection.highlightedDay"
          :ceremony-time-short="calendarSection.ceremonyTimeShort"
          :countdown-headline="calendarSection.countdownHeadline"
          :countdown-units="calendarSection.countdownUnits"
        />

        <LocationSection v-bind="locationSection" />

        <VenueGuideTabsSection
          :title="venueGuideSection.title"
          :tabs="venueGuideSection.tabs"
        />

        <GallerySection
            :title="gallerySection.title"
            :items="gallerySection.items"
        />

        <LetterSection
          :image-url="letterSection.imageUrl"
          :image-alt="letterSection.imageAlt"
          :bride-letter="letterSection.brideLetter"
          :groom-letter="letterSection.groomLetter"
        />

        <GuestBookSection
            :title="guestbookSection.title"
            :empty-message-lines="guestbookSection.emptyMessageLines"
        />

        <AccountsSection v-if="locale === 'ko'" v-bind="accountsSection" />

        <FooterSection
          :message="footerSection.message"
          :signoff="footerSection.signoff"
          :share="shareSection"
        />
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

// 모든 섹션 헤더(.title) 공통 — 토큰 사용
.canvas .title {
  margin: 0 8px 36px;
  text-align: center;
  font-family: $font-title-eng;
  font-size: $fs-xxl;
  font-weight: 500;
  letter-spacing: $ls-wide;
  color: var(--color-section-heading);
}

// 모바일에서 버튼/링크 탭 시 생기는 기본 회색 하이라이트 제거
button,
a,
[role='button'],
[tabindex] {
  -webkit-tap-highlight-color: transparent;
}

</style>

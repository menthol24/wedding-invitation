<script setup lang="ts">
import FloatingActions from '@/components/FloatingActions.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import CeremonySection from '@/components/sections/CeremonySection.vue'
import InvitationSection from '@/components/sections/InvitationSection.vue'
import CoupleIntroSection from '@/components/sections/CoupleIntroSection.vue'
import CalendarCountdownSection from '@/components/sections/CalendarCountdownSection.vue'
import GallerySection from '@/components/sections/GallerySection.vue'
import DirectionsSection from '@/components/sections/DirectionsSection.vue'
import VenueGuideTabsSection from '@/components/sections/VenueGuideTabsSection.vue'
import TimelineSection from '@/components/sections/TimelineSection.vue'
import GuestBookSection from '@/components/sections/GuestBookSection.vue'
import AccountsSection from '@/components/sections/AccountsSection.vue'

import {
  WEDDING_EVENT_ISO,
  weddingHero,
  ceremonyInfo,
  invitationSection,
  couplesSection,
  countdownSection,
  galleryImages,
  directionsSection,
  venueGuideTabs,
  timelineItems,
  guestbookIntro,
  accountsSection,
} from '@/mocks/wedding.mock'
</script>

<template>
  <div class="app">
    <main class="canvas">
      <HeroSection :image-url="weddingHero.imageUrl" :title-lines="weddingHero.titleLines" />

      <div class="content">
        <CeremonySection
          :date-label="ceremonyInfo.dateLabel"
          :venue-name="ceremonyInfo.venueName"
        />

        <InvitationSection
          :headline="invitationSection.headline"
          :paragraphs="invitationSection.paragraphs"
        />

        <CoupleIntroSection
          :groom="couplesSection.groom"
          :bride="couplesSection.bride"
        />

        <CalendarCountdownSection
          :wedding-iso="WEDDING_EVENT_ISO"
          :title-lines="countdownSection.titleLines"
          :calendar-year="countdownSection.calendarYear"
          :calendar-month-index="countdownSection.calendarMonthIndex"
          :highlighted-day="countdownSection.highlightedDay"
          :ceremony-time-short="countdownSection.ceremonyTimeShort"
          :countdown-headline="countdownSection.countdownHeadline"
        />

        <GallerySection :items="galleryImages" />

        <DirectionsSection v-bind="directionsSection" />

        <VenueGuideTabsSection :tabs="venueGuideTabs" />

        <TimelineSection :items="timelineItems" />

        <GuestBookSection
          :title="guestbookIntro.title"
          :empty-message-lines="guestbookIntro.emptyMessageLines"
        />

        <AccountsSection v-bind="accountsSection" />

        <footer class="foot">with love</footer>
      </div>
    </main>

    <FloatingActions />
  </div>
</template>

<style lang="scss">
.app {
  min-height: 100vh;
  /** 데스크톱에서 양 옆 라이트 그레이 */
  background-color: var(--color-bg-soft);
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
  padding-bottom: calc(120px + env(safe-area-inset-bottom));
}

.canvas .section-pad {
  padding-top: clamp(88px, 20vw, 128px);
  padding-bottom: clamp(76px, 17vw, 112px);
  padding-inline: 26px;

  &--wide {
    padding-inline: clamp(22px, 6vw, 34px);
  }

  &--after-hero {
    padding-top: clamp(52px, 14vw, 80px);
  }
}

.canvas .foot {
  text-align: center;
  padding: 40px 24px calc(88px + env(safe-area-inset-bottom));
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  letter-spacing: 0.28em;
  font-size: 0.88rem;
  color: rgba(110, 103, 99, 0.42);
}
</style>

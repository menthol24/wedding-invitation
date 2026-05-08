<script setup lang="ts">
import { computed } from 'vue'
import { useCountdown } from '@/composables/useCountdown'
import { buildMonthGrid, WEEKDAY_LABELS_KO } from '@/utils/calendar'

const props = defineProps<{
  title?: string
  weddingIso: string
  weddingDay: string
  weddingDayEng: string
  calendarYear: number
  calendarMonthIndex: number
  highlightedDay: number
  ceremonyTimeShort: string
  countdownHeadline: string
}>()

const grid = computed(() =>
  buildMonthGrid(props.calendarYear, props.calendarMonthIndex),
)

const { parts } = useCountdown(props.weddingIso)
</script>

<template>
  <section class="cal section-pad section-pad--wide" aria-labelledby="cal-heading">
    <h2 v-if="props.title" id="cal-heading" class="title">{{ props.title }}</h2>

    <div class="title-stack">
      <p class="title-line">{{ props.weddingDay }}</p>
      <p class="title-line-eng">{{ props.weddingDayEng }}</p>
    </div>

    <div class="calendar">
      <div class="weekdays">
        <span
          v-for="(w, wi) in WEEKDAY_LABELS_KO"
          :key="w"
          class="w"
          :class="{ 'w--sun': wi === 0 }"
          >{{ w }}</span
        >
      </div>
      <div v-for="(row, ri) in grid" :key="ri" class="week">
        <div
          v-for="(cell, ci) in row"
          :key="`${ri}-${ci}`"
          class="cell"
          :class="{ 'cell--muted': cell === null, 'cell--pick': cell === highlightedDay }"
        >
          <template v-if="cell !== null && cell === highlightedDay">
            <div class="pick">
              <span class="pick__circle">{{ cell }}</span>
              <span class="pick__time">{{ ceremonyTimeShort }}</span>
            </div>
          </template>
          <span v-else-if="cell !== null" class="num">{{ cell }}</span>
        </div>
      </div>
    </div>

    <div class="dday dday--countdown" :aria-label="countdownHeadline">
      <p class="dday__label">{{ countdownHeadline }}</p>
      <template v-if="parts.isPast">
        <p class="done">저희의 날을 맞이해 주셔서 감사합니다.</p>
      </template>
      <p v-else class="dday__value">
        <span class="dday__num">{{ parts.days }}</span
        ><span class="dday__unit">일</span>
        <span class="dday__num">{{ parts.hours }}</span
        ><span class="dday__unit">시간</span>
        <span class="dday__num">{{ parts.minutes }}</span
        ><span class="dday__unit">분</span>
        <span class="dday__num">{{ parts.seconds }}</span
        ><span class="dday__unit">초</span>
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;
.cal {
  padding-inline: 0px !important;
}
.dday {
  text-align: center;
  margin-bottom: 36px;

  &--countdown {
    margin-top: 24px;
  }

  &__label {
    margin: 0 0 12px;
    font-size: $fs-xs;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--color-body-muted);
  }

  &__value {
    margin: 0;
    font-family: $font-body;
    font-size: $fs-xl;
    font-weight: 500;
    color: var(--color-section-heading);
    line-height: $lh-tight;
  }

  &__num {
    font-variant-numeric: tabular-nums;
    margin-right: 4px;
  }

  &__unit {
    font-size: $fs-base;
    margin-right: 10px;
    color: var(--color-body);
  }

  &__rule {
    height: 1px;
    width: 80px;
    margin: 40px auto 0;
  }
}
.dday__label {
   margin: 0 0 10px;
   font-size: $fs-sm;
   font-weight: 600;
   letter-spacing: $ls-wide;
   text-transform: uppercase;
   color: var(--color-body-muted);
   line-height: $lh-relaxed;
 }
.dday__value {
  margin: 0;
  font-family: $font-body;
  font-size: $fs-xxl;
  color: var(--color-section-heading);
  line-height: $lh-relaxed;
}
.title-stack {
  text-align: left;
  margin-bottom: 32px;
  h2 {
    margin: 0 0 18px;
  }
}

.title-line {
  display: block;
  font-family: $font-body;
  font-size: $fs-base;
  font-weight: 400;
  color: var(--color-body-muted);
  text-align: center;
  margin-bottom: 10px;
}

.title-line-eng {
  display: block;
  font-family: $font-body;
  font-size: $fs-base;
  color: var(--color-body-light-grey);
  text-align: center;
}

.calendar {
  background: var(--color-bg-soft);
  padding: 28px 14px 20px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 14px;

  .w {
    font-size: $fs-base;
    font-weight: 600;
    color: var(--color-body-muted);
    letter-spacing: $ls-wider;
    opacity: 0.88;
  }

  .w--sun {
    color: var(--color-section-heading);
    opacity: 1;
  }
}

.week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.cell {
  min-height: 2.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2px;
}

.cell--muted {
  visibility: hidden;
}

.num {
  font-size: $fs-base;
  font-weight: 500;
  color: var(--color-body);
}

.cell--pick {
  align-items: center;
}

.pick {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pick__circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  // 하트 모양 — 시각적 무게가 원보다 살짝 가벼우므로 살짝 키움
  width: 2rem;
  height: 1.9rem;
  background: var(--color-countdown-pink);
  color: #ffffff;
  font-size: $fs-xs;
  font-weight: bold;

  // CSS mask로 하트 모양 클리핑
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 29'><path d='M23.6 0c-2.91 0-5.49 1.41-7.6 3.59C13.89 1.41 11.31 0 8.4 0 3.76 0 0 3.76 0 8.4c0 9.27 16 20.6 16 20.6s16-11.33 16-20.6C32 3.76 28.24 0 23.6 0z' fill='black'/></svg>");
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 29'><path d='M23.6 0c-2.91 0-5.49 1.41-7.6 3.59C13.89 1.41 11.31 0 8.4 0 3.76 0 0 3.76 0 8.4c0 9.27 16 20.6 16 20.6s16-11.33 16-20.6C32 3.76 28.24 0 23.6 0z' fill='black'/></svg>");
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}

.pick__time {
  font-size: $fs-xs;
  font-weight: 500;
  color: var(--color-body-muted);

  white-space: nowrap;
  position: relative;
  top: 8px;
}

.done {
  margin: 0;
  text-align: center;
  font-size: $fs-base;
  color: var(--color-body-muted);
}
</style>

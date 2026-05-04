<script setup lang="ts">
import { computed } from 'vue'
import { useCountdown } from '@/composables/useCountdown'
import { buildMonthGrid, WEEKDAY_LABELS_KO } from '@/utils/calendar'

const props = defineProps<{
  weddingIso: string
  titleLines: string[]
  calendarYear: number
  calendarMonthIndex: number
  highlightedDay: number
  ceremonyTimeShort: string
  countdownHeadline: string
}>()

const grid = computed(() =>
  buildMonthGrid(props.calendarYear, props.calendarMonthIndex),
)

const pad = (n: number) => String(n).padStart(2, '0')

const { parts } = useCountdown(props.weddingIso)
</script>

<template>
  <section class="cal section-pad section-pad--wide" aria-labelledby="cal-heading">
    <div class="title-stack">
      <h2 id="cal-heading">
        <span v-for="(line, i) in titleLines" :key="i" class="title-line">{{ line }}</span>
      </h2>
      <div class="title-rule" aria-hidden="true" />
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

    <div class="section-rule" aria-hidden="true" />

    <div class="count-intro">
      <p class="count-intro__line">{{ countdownHeadline }}</p>
    </div>

    <div class="badges" role="group" aria-label="카운트다운">
      <template v-if="parts.isPast">
        <p class="done">저희의 날을 맞이해 주셔서 감사합니다.</p>
      </template>
      <template v-else>
        <div class="badge-pack">
          <div class="badge-circle">
            <span class="badge-circle__num">{{ pad(parts.days) }}</span>
          </div>
          <span class="badge-pack__unit">Days</span>
        </div>
        <div class="badge-pack">
          <div class="badge-circle">
            <span class="badge-circle__num">{{ pad(parts.hours) }}</span>
          </div>
          <span class="badge-pack__unit">Hours</span>
        </div>
        <div class="badge-pack">
          <div class="badge-circle">
            <span class="badge-circle__num">{{ pad(parts.minutes) }}</span>
          </div>
          <span class="badge-pack__unit">Minutes</span>
        </div>
        <div class="badge-pack">
          <div class="badge-circle">
            <span class="badge-circle__num">{{ pad(parts.seconds) }}</span>
          </div>
          <span class="badge-pack__unit">Seconds</span>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.title-stack {
  text-align: left;
  margin-bottom: 28px;
  h2 {
    margin: 0 0 18px;
  }
}

.title-line {
  display: block;
  font-family: $font-display;
  font-size: 1.42rem;
  font-weight: 500;
  line-height: 1.36;
  color: var(--color-section-heading);

  letter-spacing: 0.01em;
  word-spacing: 0.02em !important;

  &:not(:first-child) {
    margin-top: 4px;
  }
}

.title-rule {
  height: 1px;
  margin: 0 auto;
  background: rgba(196, 149, 149, 0.35);
}

.calendar {
  padding: 20px 14px 22px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 14px;

  .w {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-body-muted);
    letter-spacing: 0.12em;
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
  font-size: 0.88rem;
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
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  background: var(--color-countdown-pink);
  color: #fffefd;
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.pick__time {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-body-muted);
  letter-spacing: 0.02em;
  white-space: nowrap;
  position: relative;
  top: 8px;
}

.section-rule {
  height: 1px;
  margin: 36px auto 28px;
  background: rgba(196, 149, 149, 0.38);
}

.count-intro {
  text-align: center;
  margin-bottom: 28px;

  &__line {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    color: var(--color-body);
  }
}

.badges {
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  gap: 8px;
  max-width: 340px;
  margin: 0 auto;
}

.badge-pack {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.badge-circle {
  width: clamp(3.25rem, 17vw, 3.75rem);
  height: clamp(3.25rem, 17vw, 3.75rem);
  border-radius: 50%;
  background: var(--color-countdown-pink);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 12px rgba(42, 36, 34, 0.07);

  &__num {
    font-size: clamp(0.98rem, 4.2vw, 1.08rem);
    font-weight: 600;
    color: #ffffff;
    letter-spacing: 0.02em;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
}

.badge-pack__unit {
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-body-muted);
}

.done {
  margin: 0;
  text-align: center;
  font-size: 0.9rem;
  line-height: 1.78;
  color: var(--color-body-muted);
}
</style>

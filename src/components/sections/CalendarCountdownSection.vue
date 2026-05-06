<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
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
  /** 두 사람이 처음 만난 날 (ISO: YYYY-MM-DD) */
  meetSinceIso: string
  /** 디데이 섹션 상단 라벨 */
  ddayHeadline: string
}>()

const grid = computed(() =>
  buildMonthGrid(props.calendarYear, props.calendarMonthIndex),
)

const { parts } = useCountdown(props.weddingIso)

// 디데이(함께한 시간) — 만남일로부터 오늘까지 흐른 햇수와 일수를 계산
const now = ref(new Date())
let timer: number | undefined

onMounted(() => {
  // 자정 경계에서 일수가 바뀔 수 있어 1분마다 갱신
  timer = window.setInterval(() => {
    now.value = new Date()
  }, 60_000)
})

onBeforeUnmount(() => {
  if (timer !== undefined) window.clearInterval(timer)
})

const sinceParts = computed(() => {
  const start = new Date(props.meetSinceIso)
  const today = now.value

  // 시간 정보를 무시하고 날짜 단위로만 비교
  const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  let years = todayDate.getFullYear() - startDate.getFullYear()
  // 같은 해 안에서 만남 기념일을 아직 지나지 않았다면 1년 차감
  const anniversaryThisYear = new Date(
    todayDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
  )
  if (todayDate < anniversaryThisYear) years -= 1

  // 가장 최근에 지난 만남 기념일로부터의 잔여 일수
  const lastAnniversary = new Date(
    todayDate.getFullYear() - (todayDate < anniversaryThisYear ? 1 : 0),
    startDate.getMonth(),
    startDate.getDate(),
  )
  const dayMs = 24 * 60 * 60 * 1000
  const days = Math.floor((todayDate.getTime() - lastAnniversary.getTime()) / dayMs)

  return { years: Math.max(0, years), days: Math.max(0, days) }
})
</script>

<template>
  <section class="cal section-pad section-pad--wide" aria-labelledby="cal-heading">
    <div class="dday" :aria-label="ddayHeadline">
      <p class="dday__label">{{ ddayHeadline }}</p>
      <p class="dday__value">
        <span class="dday__num">{{ sinceParts.years }}</span
        ><span class="dday__unit">년</span>
        <span class="dday__num">{{ sinceParts.days }}</span
        ><span class="dday__unit">일</span>
      </p>
      <div class="dday__rule" aria-hidden="true" />
    </div>

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

.dday {
  text-align: center;
  margin-bottom: 36px;

  &__label {
    margin: 0 0 12px;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--color-body-muted);
  }

  &__value {
    margin: 0;
    font-family: $font-display;
    font-size: 1.5rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: var(--color-section-heading);
    line-height: 1.2;
  }

  &__num {
    font-variant-numeric: tabular-nums;
    margin-right: 4px;
  }

  &__unit {
    font-size: 0.95rem;
    margin-right: 10px;
    color: var(--color-body);
  }

  &__rule {
    height: 1px;
    width: 80px;
    margin: 40px auto 0;
  }
}

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
  text-align: center;

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
  // 하트 모양 — 시각적 무게가 원보다 살짝 가벼우므로 살짝 키움
  width: 2rem;
  height: 1.9rem;
  background: var(--color-countdown-pink);
  color: #fffefd;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
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
  margin: 36px auto 70px;
  background: rgba(196, 149, 149, 0.38);
}

.done {
  margin: 0;
  text-align: center;
  font-size: 0.9rem;
  line-height: 1.78;
  color: var(--color-body-muted);
}
</style>

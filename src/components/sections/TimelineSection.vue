<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export interface TimelinePiece {
  year?: string
  text: string
  photoUrl: string
  alt?: string
}

const props = defineProps<{
  title: string
  items: TimelinePiece[]
  /** 두 사람이 처음 만난 날 (ISO: YYYY-MM-DD) — 디데이 계산용 */
  meetSinceIso?: string
  ddayLabel?: string
}>()

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
  if (!props.meetSinceIso) return null
  const start = new Date(props.meetSinceIso)
  const today = now.value

  const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  let years = todayDate.getFullYear() - startDate.getFullYear()
  const anniversaryThisYear = new Date(
    todayDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
  )
  if (todayDate < anniversaryThisYear) years -= 1

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
  <section class="tl section-pad section-pad--wide" aria-labelledby="tl-heading">
    <h2 id="tl-heading" class="title">{{ title }}</h2>

    <div v-if="sinceParts" class="dday" :aria-label="ddayLabel">
      <p v-if="ddayLabel" class="dday__label">{{ ddayLabel }}</p>
      <p class="dday__value">
        <span class="dday__num">{{ sinceParts.years }}</span
        ><span class="dday__unit">년</span>
        <span class="dday__num">{{ sinceParts.days }}</span
        ><span class="dday__unit">일</span>
      </p>
    </div>

    <div class="axis">
      <div v-for="(it, idx) in items" :key="idx" class="row" :class="{ 'row--flip': idx % 2 === 1 }">
        <figure class="fig">
          <img :src="it.photoUrl" :alt="it.alt ?? ''" loading="lazy" decoding="async" />
        </figure>
        <div class="content">
          <p v-if="it.year" class="year">{{ it.year }}</p>
          <p class="text">{{ it.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

// 타이틀 아래 디데이 — 함께한 시간 (년/일)
.dday {
  text-align: center;
  margin: -20px 0 40px;
}

.dday__label {
  margin: 0 0 10px;
  font-size: $fs-sm;
  font-weight: 600;
  letter-spacing: $ls-wide;
  line-height: $lh-relaxed;
  text-transform: uppercase;
  color: var(--color-body-muted);
}

.dday__value {
  margin: 0;
  font-family: $font-body;
  font-size: $fs-xxl;
  color: var(--color-section-heading);
  line-height: $lh-relaxed;
}

.dday__num {
  font-variant-numeric: tabular-nums;
  margin-right: 4px;
}

.dday__unit {
  font-size: $fs-base;
  margin-right: 10px;
  color: var(--color-body);
}

.axis {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 40px;
    left: 50%;
    width: 1px;
    background: rgb(69 69 69 / 15%);
    transform: translateX(-0.5px);
  }
}

// axis 양옆에 사진/텍스트가 1:1 로 분리되는 레이아웃
.row {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 28px 1fr; // 좌 | axis 닷 영역 | 우
  align-items: center;
  column-gap: 0;
  margin-bottom: 46px;

  &:last-child {
    margin-bottom: 0;
  }

  // axis 위 닷
  &::before {
    content: '';
    grid-column: 2;
    justify-self: center;
    align-self: center;
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

// 기본(짝수 row) — 사진 왼쪽, 텍스트 오른쪽
.row .fig {
  grid-column: 1;
  grid-row: 1;
  justify-self: end;
  padding-right: 12px;
}

.row .content {
  grid-column: 3;
  grid-row: 1;
  justify-self: start;
  padding-left: 10px;
  text-align: left;
}

// row--flip (홀수 row) — 텍스트 왼쪽, 사진 오른쪽
.row--flip .fig {
  grid-column: 3;
  justify-self: start;
  padding-right: 0;
  padding-left: 10px;
}

.row--flip .content {
  grid-column: 1;
  justify-self: end;
  padding-left: 0;
  padding-right: 12px;
  text-align: right;
}

.fig {
  margin: 0;
  width: 100%;
  max-width: 160px;

  img {
    display: block;
    width: 100%;
    border-radius: var(--radius-photo);
    aspect-ratio: 1 / 1;
    object-fit: cover;
    box-shadow: 0 4px 14px rgba(42, 36, 34, 0.06);
  }
}

.content {
  width: 100%;
}

.year {
  margin: 0 0 8px;
  font-family: $font-body;
  font-size: $fs-base;
  font-weight: 500;
  color: var(--color-section-heading);
}

.text {
  margin: 0;
  font-size: $fs-sm;
  line-height: $lh-base;
  color: var(--color-body-muted);
  word-break: keep-all;

}
</style>

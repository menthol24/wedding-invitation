<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import GuestBookWriteModal from '@/components/guestbook/GuestBookWriteModal.vue'
import { useGuestbook } from '@/composables/useGuestbook'
import { useSwipe } from '@/composables/useSwipe'
import type { GuestBookCreateInput, GuestBookEntry } from '@/services/guestbook/types'

const props = defineProps<{
  title: string
  emptyMessageLines: string[]
}>()

const {
  entries,
  visibleEntries,
  loading,
  refresh,
  submit,
  currentPage,
  totalPages,
  goToPage,
  prevPage,
  nextPage,
  pageSize,
} = useGuestbook()

const modalOpen = ref(false)
const submitBusy = ref(false)

onMounted(refresh)

async function onSubmit(input: GuestBookCreateInput) {
  submitBusy.value = true
  try {
    await submit(input)
    modalOpen.value = false
  } finally {
    submitBusy.value = false
  }
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  const y = d.getFullYear()
  const mo = `${d.getMonth() + 1}`.padStart(2, '0')
  const da = `${d.getDate()}`.padStart(2, '0')
  return `${y}.${mo}.${da}`
}

// 페이지 번호 목록 (최대 5개 윈도우)
const pageNumbers = computed(() => {
  const tp = totalPages.value
  const cp = currentPage.value
  const maxButtons = 5
  if (tp <= maxButtons) return Array.from({ length: tp }, (_, i) => i + 1)
  let start = Math.max(1, cp - 2)
  const end = Math.min(tp, start + maxButtons - 1)
  start = Math.max(1, end - maxButtons + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const showPagination = computed(() => entries.value.length > 5)

function getPageEntries(page: number): GuestBookEntry[] {
  if (page < 1 || page > totalPages.value) return []
  const start = (page - 1) * pageSize
  return entries.value.slice(start, start + pageSize)
}

// === 트랙 기반 카루셀 ===
// 트랙은 [prev, current, next] 세 슬라이드를 가로로 깔고, 평소에는 -100% - gap 위치(=current가 보임)에 정지
const SLIDE_GAP = 16 // 슬라이드 간 간격 (px)
const dragX = ref(0)
const animating = ref(false)

const prevEntries = computed(() => getPageEntries(currentPage.value - 1))
const currentEntries = computed(() => visibleEntries.value)
const nextEntries = computed(() => getPageEntries(currentPage.value + 1))

const trackStyle = computed(() => ({
  transform: `translate3d(calc(-100% - ${SLIDE_GAP}px + ${dragX.value}px), 0, 0)`,
  transition: animating.value ? 'transform 260ms ease' : 'none',
}))

function canMove(delta: number) {
  const next = currentPage.value + delta
  return next >= 1 && next <= totalPages.value
}

// 페이지가 1개 초과일 때만 스와이프로 페이지 이동
const swipe = useSwipe({
  enabled: () => totalPages.value > 1,
  onDragMove: (dx) => {
    animating.value = false
    // 끝 페이지에서 더 끌면 저항감
    if ((dx < 0 && !canMove(1)) || (dx > 0 && !canMove(-1))) {
      dragX.value = dx * 0.35
    } else {
      dragX.value = dx
    }
  },
  onDragEnd: (committed, direction) => {
    if (!committed) {
      // 임계값 미달 — 원위치로 부드럽게 복귀
      animating.value = true
      dragX.value = 0
      return
    }
    // 1) 트랙을 다음/이전 슬라이드 위치까지 마저 이동 (간격만큼 추가)
    const width = (viewportEl.value?.clientWidth ?? window.innerWidth ?? 400) + SLIDE_GAP
    animating.value = true
    dragX.value = direction === 'left' ? -width : width

    // 2) 트랜지션 끝나면 인덱스 변경 + 트랙 위치를 즉시(트랜지션 없이) 0으로 리셋
    window.setTimeout(() => {
      animating.value = false
      if (direction === 'left') nextPage()
      else prevPage()
      dragX.value = 0
    }, 260)
  },
})

const viewportEl = ref<HTMLElement | null>(null)

function jumpToPage(n: number) {
  if (n === currentPage.value) return
  // 페이지 번호 클릭은 즉시 이동 (애니메이션 생략)
  animating.value = false
  dragX.value = 0
  goToPage(n)
}
</script>

<template>
  <section class="guest section-pad section-pad--wide" aria-labelledby="guest-heading">
    <div class="header">
      <h2 id="guest-heading" class="title">{{ props.title }}</h2>
      <button
        type="button"
        class="write-btn"
        aria-label="방명록 작성"
        @click="modalOpen = true"
      >
        <svg
          class="write-icon"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </button>
    </div>

    <p v-if="loading" class="hint">방명록을 불러오는 중입니다.</p>

    <div v-if="!loading && entries.length === 0" class="empty">
      <p v-for="(ln, i) in props.emptyMessageLines" :key="i">{{ ln }}</p>
    </div>

    <div
      v-else
      ref="viewportEl"
      class="list-viewport"
      @touchstart.passive="swipe.onTouchStart"
      @touchmove="swipe.onTouchMove"
      @touchend="swipe.onTouchEnd"
      @touchcancel="swipe.onTouchCancel"
    >
      <div class="track" :style="trackStyle">
        <ul class="slide list" aria-hidden="true">
          <li v-for="e in prevEntries" :key="`p-${e.id}`" class="item">
            <div class="meta">
              <span class="name">{{ e.name }}</span>
              <span class="date">{{ fmtDate(e.created_at) }}</span>
            </div>
            <p class="body">{{ e.message }}</p>
          </li>
        </ul>
        <ul class="slide list">
          <li v-for="e in currentEntries" :key="`c-${e.id}`" class="item">
            <div class="meta">
              <span class="name">{{ e.name }}</span>
              <span class="date">{{ fmtDate(e.created_at) }}</span>
            </div>
            <p class="body">{{ e.message }}</p>
          </li>
        </ul>
        <ul class="slide list" aria-hidden="true">
          <li v-for="e in nextEntries" :key="`n-${e.id}`" class="item">
            <div class="meta">
              <span class="name">{{ e.name }}</span>
              <span class="date">{{ fmtDate(e.created_at) }}</span>
            </div>
            <p class="body">{{ e.message }}</p>
          </li>
        </ul>
      </div>
    </div>

    <nav v-if="showPagination" class="pager" aria-label="방명록 페이지 이동">
      <button
        type="button"
        class="page-arrow"
        :disabled="currentPage === 1"
        aria-label="이전 페이지"
        @click="jumpToPage(currentPage - 1)"
      >
        ‹
      </button>
      <button
        v-for="n in pageNumbers"
        :key="n"
        type="button"
        class="page-num"
        :class="{ active: n === currentPage }"
        :aria-current="n === currentPage ? 'page' : undefined"
        @click="jumpToPage(n)"
      >
        {{ n }}
      </button>
      <button
        type="button"
        class="page-arrow"
        :disabled="currentPage === totalPages"
        aria-label="다음 페이지"
        @click="jumpToPage(currentPage + 1)"
      >
        ›
      </button>
    </nav>

    <GuestBookWriteModal
      :open="modalOpen"
      :busy="submitBusy"
      @close="modalOpen = false"
      @submit="onSubmit"
    />
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.write-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 50%;
  border: 1px solid rgba(72, 58, 54, 0.12);
  background: #ffffff;
  color: var(--color-body);
  cursor: pointer;
  box-shadow: var(--shadow-lift);
  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;

  &:hover {
    background: var(--color-accent-soft);
    color: var(--color-accent-strong);
  }

  &:active {
    transform: translateY(-50%) scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}

.write-icon {
  display: block;
}

.hint {
  margin: 0 0 22px;
  text-align: center;
  font-size: $fs-sm;
  color: var(--color-body-muted);
}

.empty {
  text-align: center;
  padding: 20px 0 28px;

  p {
    margin: 8px 0;
    font-size: $fs-base;
    line-height: $lh-loose;
    color: var(--color-body-muted);
  }
}

.list-viewport {
  position: relative;
  overflow: hidden;
  // 가로 드래그 시 브라우저 세로 스크롤이 동시에 일어나지 않게
  touch-action: pan-y;
}

.track {
  display: flex;
  align-items: flex-start;
  width: 100%;
  gap: 16px;
  will-change: transform;
}

.slide {
  flex: 0 0 100%;
  width: 100%;
  min-width: 0;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
}

.item {
  padding: 18px;
  border-radius: var(--radius-card);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lift);
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;

  .name {
    font-size: $fs-base;
    font-weight: 600;
    color: var(--color-body);
  }

  .date {
    font-size: $fs-xs;
    letter-spacing: $ls-wide;
    color: var(--color-body-muted);
    opacity: 0.85;
  }
}

.body {
  margin: 0;
  font-size: $fs-base;
  line-height: $lh-loose;
  color: var(--color-body-muted);
  white-space: pre-wrap;
}

.pager {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 22px;
}

.page-arrow,
.page-num {
  min-width: 30px;
  height: 30px;
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: $fs-sm;
  font-weight: 500;

  color: var(--color-body-muted);
  background: #ffffff;
  border: 1px solid rgba(72, 58, 54, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;

  &:hover:not(:disabled) {
    background: var(--color-accent-soft);
    color: var(--color-accent-strong);
    border-color: rgba(212, 163, 163, 0.4);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.page-num.active {
  background: var(--color-accent);
  color: #ffffff;
  border-color: var(--color-accent);
}

.page-arrow {
  font-size: $fs-md;
  line-height: $lh-flat;
}
</style>

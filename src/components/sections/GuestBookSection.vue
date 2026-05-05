<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import GuestBookWriteModal from '@/components/guestbook/GuestBookWriteModal.vue'
import { useGuestbook } from '@/composables/useGuestbook'
import { useSwipe } from '@/composables/useSwipe'
import type { GuestBookCreateInput } from '@/services/guestbook/types'

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

// === 드래그 따라가기 + 슬라이드 전환 ===
const dragX = ref(0)
const animating = ref(false)
const slideDir = ref<'forward' | 'backward'>('forward')

const listStyle = computed(() => ({
  transform: dragX.value !== 0 ? `translate3d(${dragX.value}px, 0, 0)` : '',
  transition: animating.value ? 'transform 220ms ease' : 'none',
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
    if ((dx < 0 && !canMove(1)) || (dx > 0 && !canMove(-1))) {
      dragX.value = dx * 0.35
    } else {
      dragX.value = dx
    }
  },
  onDragEnd: (committed) => {
    if (committed) {
      // 페이지 교체는 <Transition>이 처리 — 드래그 오프셋은 즉시 리셋
      animating.value = false
      dragX.value = 0
    } else {
      animating.value = true
      dragX.value = 0
    }
  },
  onSwipeLeft: () => {
    if (!canMove(1)) return
    slideDir.value = 'forward'
    nextPage()
  },
  onSwipeRight: () => {
    if (!canMove(-1)) return
    slideDir.value = 'backward'
    prevPage()
  },
})

function jumpToPage(n: number) {
  if (n === currentPage.value) return
  slideDir.value = n > currentPage.value ? 'forward' : 'backward'
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
      class="list-viewport"
      @touchstart.passive="swipe.onTouchStart"
      @touchmove="swipe.onTouchMove"
      @touchend="swipe.onTouchEnd"
      @touchcancel="swipe.onTouchCancel"
    >
      <Transition :name="slideDir === 'forward' ? 'slide-fwd' : 'slide-bwd'" mode="out-in">
        <ul :key="currentPage" class="list" :style="listStyle">
          <li v-for="e in visibleEntries" :key="e.id" class="item">
            <div class="meta">
              <span class="name">{{ e.name }}</span>
              <span class="date">{{ fmtDate(e.createdAt) }}</span>
            </div>
            <p class="body">{{ e.content }}</p>
          </li>
        </ul>
      </Transition>
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
  margin: 0 0 32px;
}

.title {
  margin: 0;
  text-align: center;
  font-family: $font-display;
  font-size: 1.38rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--color-section-heading);
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
  font-size: 0.82rem;
  color: var(--color-body-muted);
}

.empty {
  text-align: center;
  padding: 20px 0 28px;

  p {
    margin: 8px 0;
    font-size: 0.9rem;
    line-height: 1.88;
    color: var(--color-body-muted);
  }
}

.list-viewport {
  position: relative;
  overflow: hidden;
  // 가로 드래그 시 브라우저 세로 스크롤이 동시에 일어나지 않게
  touch-action: pan-y;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
  will-change: transform;
}

// 다음 페이지: 새 리스트는 오른쪽에서 들어오고, 이전 리스트는 왼쪽으로 빠짐
.slide-fwd-enter-from {
  transform: translate3d(100%, 0, 0);
  opacity: 0;
}

.slide-fwd-leave-to {
  transform: translate3d(-100%, 0, 0);
  opacity: 0;
}

// 이전 페이지: 반대 방향
.slide-bwd-enter-from {
  transform: translate3d(-100%, 0, 0);
  opacity: 0;
}

.slide-bwd-leave-to {
  transform: translate3d(100%, 0, 0);
  opacity: 0;
}

.slide-fwd-enter-active,
.slide-fwd-leave-active,
.slide-bwd-enter-active,
.slide-bwd-leave-active {
  transition:
    transform 220ms ease,
    opacity 220ms ease;
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
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-body);
  }

  .date {
    font-size: 0.72rem;
    letter-spacing: 0.05em;
    color: var(--color-body-muted);
    opacity: 0.85;
  }
}

.body {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.82;
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
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.02em;
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
  font-size: 1rem;
  line-height: 1;
}
</style>

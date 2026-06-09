<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import GuestBookWriteModal from '@/components/guestbook/GuestBookWriteModal.vue'
import GuestBookDeleteModal from '@/components/guestbook/GuestBookDeleteModal.vue'
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
  remove,
  addLike,
  currentPage,
  totalPages,
  goToPage,
  prevPage,
  nextPage,
  pageSize,
} = useGuestbook()

const modalOpen = ref(false)
const submitBusy = ref(false)

// 마스터 비밀번호 — VITE_ 접두사라 빌드 결과물에 노출됨. 청첩장 성격상 장난성 안전장치 수준
const MASTER_PASSWORD = import.meta.env.VITE_MASTER_PASSWORD ?? ''

const deleteModalOpen = ref(false)
const deleteBusy = ref(false)
const deleteTargetId = ref<string | null>(null)
const deleteModalRef = ref<InstanceType<typeof GuestBookDeleteModal> | null>(null)

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

function openDeleteModal(id: string) {
  deleteTargetId.value = id
  deleteModalOpen.value = true
}

function closeDeleteModal() {
  deleteModalOpen.value = false
  deleteTargetId.value = null
}

async function onConfirmDelete({ password }: { password: string }) {
  if (password !== MASTER_PASSWORD) {
    deleteModalRef.value?.showError('비밀번호가 일치하지 않습니다.')
    return
  }
  if (!deleteTargetId.value) return

  deleteBusy.value = true
  try {
    await remove(deleteTargetId.value)
    closeDeleteModal()
  } catch (e) {
    deleteModalRef.value?.showError(
      e instanceof Error ? e.message : '삭제하지 못했습니다.',
    )
  } finally {
    deleteBusy.value = false
  }
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  const y = d.getFullYear()
  const mo = `${d.getMonth() + 1}`.padStart(2, '0')
  const da = `${d.getDate()}`.padStart(2, '0')
  return `${y}.${mo}.${da}`
}

// 좋아요 클릭 시 펄스 애니메이션 재생을 위한 상태 (클릭마다 토글)
const poppingId = ref<string | null>(null)

function onLike(id: string) {
  // 같은 버튼 연타 시에도 매번 애니메이션이 다시 재생되도록 잠깐 끊었다 켠다
  poppingId.value = null
  // nextTick 없이 즉시 재설정하면 클래스 변화가 합쳐져 애니메이션이 안 보일 수 있어
  // requestAnimationFrame 으로 다음 프레임에 클래스를 다시 붙인다
  requestAnimationFrame(() => {
    poppingId.value = id
  })
  addLike(id)
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
            <span v-if="e.likes > 0" class="like-static">
              <svg
                class="like-icon"
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
              <span class="like-count">{{ e.likes }}</span>
            </span>
          </li>
        </ul>
        <ul class="slide list">
          <li v-for="e in currentEntries" :key="`c-${e.id}`" class="item">
            <div class="meta">
              <span class="name">{{ e.name }}</span>
              <span class="date">{{ fmtDate(e.created_at) }}</span>
            </div>
            <p class="body">{{ e.message }}</p>
            <button
              type="button"
              class="like-btn"
              :class="{ popping: poppingId === e.id }"
              aria-label="좋아요"
              @click="onLike(e.id)"
            >
              <span class="like-heart">
                <svg
                  class="like-icon"
                  viewBox="0 0 24 24"
                  width="15"
                  height="15"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  />
                </svg>
                <!-- 클릭 시 사방으로 터지는 입자 6개 (60°씩) -->
                <span class="like-burst" aria-hidden="true">
                  <span style="--angle: 0deg"></span>
                  <span style="--angle: 60deg"></span>
                  <span style="--angle: 120deg"></span>
                  <span style="--angle: 180deg"></span>
                  <span style="--angle: 240deg"></span>
                  <span style="--angle: 300deg"></span>
                </span>
              </span>
              <span v-if="e.likes > 0" class="like-count">{{ e.likes }}</span>
            </button>
            <button
              type="button"
              class="delete-btn"
              aria-label="방명록 삭제"
              @click="openDeleteModal(e.id)"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              </svg>
            </button>
          </li>
        </ul>
        <ul class="slide list" aria-hidden="true">
          <li v-for="e in nextEntries" :key="`n-${e.id}`" class="item">
            <div class="meta">
              <span class="name">{{ e.name }}</span>
              <span class="date">{{ fmtDate(e.created_at) }}</span>
            </div>
            <p class="body">{{ e.message }}</p>
            <span v-if="e.likes > 0" class="like-static">
              <svg
                class="like-icon"
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
              <span class="like-count">{{ e.likes }}</span>
            </span>
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

    <GuestBookDeleteModal
      ref="deleteModalRef"
      :open="deleteModalOpen"
      :busy="deleteBusy"
      @close="closeDeleteModal"
      @confirm="onConfirmDelete"
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
  font-size: $fs-base;
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
  position: relative;
  padding: 18px;
  border-radius: var(--radius-card);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lift);
}

.like-btn {
  position: absolute;
  left: 10px;
  bottom: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  // 배경/테두리 제거 — 아이콘만 노출
  padding: 0 8px 0 6px;
  border: 0;
  background: transparent;
  color: var(--color-guestbook-like);
  cursor: pointer;
  transition: transform 0.12s ease;

  &:hover .like-icon {
    transform: scale(1.08);
  }

  // 클릭 시 하트가 톡 튀는 피드백 (poppingId 가 붙은 동안 1회 재생)
  &.popping .like-icon {
    animation: like-pop 0.4s ease;
  }

  // 클릭 시 하트 주변으로 입자가 터지는 효과 (popping 일 때만 입자 재생)
  &.popping .like-burst span {
    animation: like-particle 0.5s ease-out;
  }

  &:active {
    transform: scale(0.94);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: 6px;
  }
}

// 하트 아이콘을 감싸 burst 입자의 기준점이 되는 래퍼
.like-heart {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.like-icon {
  display: block;
  position: relative;
  z-index: 1;
}

// 하트 중심에서 사방으로 퍼지는 입자들 (평소엔 보이지 않음)
.like-burst {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 4px;
  height: 4px;
  margin: -2px 0 0 -2px;
  pointer-events: none;
  opacity: 0;

  span {
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--color-accent);
    // 각 입자를 6방향(60°씩)으로 회전 배치 후, 애니메이션에서 바깥으로 밀어냄
    transform: rotate(var(--angle)) translateY(0);
  }
}

.like-count {
  font-size: $fs-xs;
  font-weight: 600;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--color-body)
}

// prev/next 슬라이드의 비인터랙티브 좋아요 표시
.like-static {
  position: absolute;
  left: 10px;
  bottom: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 8px 0 6px;
  color: var(--color-guestbook-like);
}

@keyframes like-pop {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(0.85);
  }
  60% {
    transform: scale(1.4);
  }
  100% {
    transform: scale(1);
  }
}

// 입자가 중심에서 바깥으로 튕겨나가며 사라지는 효과
@keyframes like-particle {
  0% {
    transform: rotate(var(--angle)) translateY(0) scale(1);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    // 회전 방향 그대로 14px 바깥으로 이동하며 작아지고 사라짐
    transform: rotate(var(--angle)) translateY(-14px) scale(0.3);
    opacity: 0;
  }
}

.delete-btn {
  position: absolute;
  right: 10px;
  bottom: 8px;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 50%;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-body-light-grey);
  cursor: pointer;
  opacity: 0.7;
  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    opacity 0.18s ease;

  &:hover {
    background: var(--color-accent-soft);
    color: var(--color-guestbook-like);
    opacity: 1;
  }

  &:active {
    transform: scale(0.94);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;

  .name {
    font-family: $font-body-strong;
    font-size: $fs-base;
    font-weight: bold;
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
  // 하단의 좋아요/삭제 버튼과 메시지가 겹치지 않도록 마지막 줄에 패딩 확보
  padding-bottom: 34px;
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
  font-size: $fs-base;
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
    color: var(--color-guestbook-like);
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

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref, watch } from 'vue'
import type { GallerySlide } from './gallery.types'

const props = defineProps<{
  open: boolean
  slides: GallerySlide[]
  initialIndex: number
}>()

const emit = defineEmits<{
  close: []
  'update-index': [n: number]
}>()

const count = computed(() => props.slides.length)
const idx = computed({
  get: () => props.initialIndex,
  set: (n: number) => emit('update-index', normalize(n)),
})

function normalize(n: number) {
  if (count.value === 0) return 0
  return ((n % count.value) + count.value) % count.value
}

function prev() {
  resetTransform()
  idx.value -= 1
}

function next() {
  resetTransform()
  idx.value += 1
}

function keydown(ev: KeyboardEvent) {
  if (!props.open) return
  if (ev.key === 'Escape') emit('close')
  if (ev.key === 'ArrowLeft') prev()
  if (ev.key === 'ArrowRight') next()
}

onMounted(() => window.addEventListener('keydown', keydown))
onUnmounted(() => window.removeEventListener('keydown', keydown))

// === 핀치 줌 / 팬 (current 이미지 한정) ===
const MIN_SCALE = 1
const MAX_SCALE = 4

const scale = ref(1)
const tx = ref(0)
const ty = ref(0)

const imgStyle = computed(() => ({
  transform: `translate3d(${tx.value}px, ${ty.value}px, 0) scale(${scale.value})`,
  transition: gestureActive.value ? 'none' : 'transform 0.2s ease',
}))

function resetTransform() {
  scale.value = 1
  tx.value = 0
  ty.value = 0
}

// 슬라이드가 바뀌거나 닫힐 때 변형 초기화
watch(() => props.initialIndex, resetTransform)
watch(
  () => props.open,
  (v) => {
    if (!v) resetTransform()
  },
)

// === 트랙 (prev / current / next 세 슬라이드) ===
const SLIDE_GAP = 24 // 슬라이드 간 간격 (px)
const dragX = ref(0)
const trackAnimating = ref(false)
const frameEl = ref<HTMLElement | null>(null)

const prevSlide = computed(() => props.slides[normalize(idx.value - 1)] ?? null)
const currentSlide = computed(() => props.slides[idx.value] ?? null)
const nextSlide = computed(() => props.slides[normalize(idx.value + 1)] ?? null)

const trackStyle = computed(() => ({
  transform: `translate3d(calc(-100% - ${SLIDE_GAP}px + ${dragX.value}px), 0, 0)`,
  transition: trackAnimating.value ? 'transform 0.26s ease' : 'none',
}))

// --- 제스처 상태 ---
const gestureActive = ref(false)
let startDistance = 0
let startScale = 1
let startMidX = 0
let startMidY = 0
let startTx = 0
let startTy = 0
let isPinching = false
let isPanning = false
let lastTapAt = 0

// --- 스와이프 상태 (확대되지 않은 상태에서 1손가락 좌우 이동) ---
const SWIPE_THRESHOLD = 50
const SWIPE_INTENT = 8
let swipeTracking = false
let swipeStartX = 0
let swipeStartY = 0
/** 'pending' = 가로/세로 미확정, 'horizontal' = 손가락 따라 트랙 이동, 'vertical' = 무시 */
let swipeIntent: 'pending' | 'horizontal' | 'vertical' = 'pending'

function distance(t1: Touch, t2: Touch) {
  const dx = t1.clientX - t2.clientX
  const dy = t1.clientY - t2.clientY
  return Math.hypot(dx, dy)
}

function midpoint(t1: Touch, t2: Touch) {
  return {
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2,
  }
}

function onTouchStart(e: TouchEvent) {
  if (e.touches.length === 2) {
    e.preventDefault()
    isPinching = true
    isPanning = false
    swipeTracking = false
    gestureActive.value = true
    startDistance = distance(e.touches[0], e.touches[1])
    startScale = scale.value
    const mid = midpoint(e.touches[0], e.touches[1])
    startMidX = mid.x
    startMidY = mid.y
    startTx = tx.value
    startTy = ty.value
  } else if (e.touches.length === 1 && scale.value > 1) {
    // 확대 상태에서만 1손가락 팬 허용 (스와이프와 충돌 방지)
    isPanning = true
    swipeTracking = false
    gestureActive.value = true
    startMidX = e.touches[0].clientX
    startMidY = e.touches[0].clientY
    startTx = tx.value
    startTy = ty.value
  } else if (e.touches.length === 1) {
    // 확대 전 상태에서 1손가락 좌우 스와이프 추적 시작
    swipeTracking = true
    swipeIntent = 'pending'
    swipeStartX = e.touches[0].clientX
    swipeStartY = e.touches[0].clientY
    trackAnimating.value = false
    dragX.value = 0
  }
}

function onTouchMove(e: TouchEvent) {
  if (isPinching && e.touches.length === 2) {
    e.preventDefault()
    const d = distance(e.touches[0], e.touches[1])
    const ns = clamp((d / startDistance) * startScale, MIN_SCALE, MAX_SCALE)
    scale.value = ns

    // 두 손가락 중심점이 이동한 만큼 함께 팬
    const mid = midpoint(e.touches[0], e.touches[1])
    tx.value = startTx + (mid.x - startMidX)
    ty.value = startTy + (mid.y - startMidY)
  } else if (isPanning && e.touches.length === 1) {
    e.preventDefault()
    tx.value = startTx + (e.touches[0].clientX - startMidX)
    ty.value = startTy + (e.touches[0].clientY - startMidY)
  } else if (swipeTracking && e.touches.length === 1) {
    // 1손가락 좌우 스와이프 — 트랙이 손가락을 따라가게
    const dx = e.touches[0].clientX - swipeStartX
    const dy = e.touches[0].clientY - swipeStartY
    if (swipeIntent === 'pending') {
      if (Math.abs(dx) < SWIPE_INTENT && Math.abs(dy) < SWIPE_INTENT) return
      swipeIntent = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical'
    }
    if (swipeIntent === 'horizontal') {
      if (e.cancelable) e.preventDefault()
      trackAnimating.value = false
      dragX.value = dx
    }
  }
}

function onTouchEnd(e: TouchEvent) {
  if (e.touches.length === 0) {
    // 1손가락 좌우 스와이프 판정 — 확대되지 않은 상태에서만
    if (swipeTracking && e.changedTouches.length === 1 && scale.value <= MIN_SCALE + 0.01) {
      const t = e.changedTouches[0]
      const dx = t.clientX - swipeStartX
      const dy = t.clientY - swipeStartY
      const wasHorizontal = swipeIntent === 'horizontal'
      const committed =
        wasHorizontal && Math.abs(dx) >= SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)

      swipeTracking = false
      swipeIntent = 'pending'

      if (committed) {
        // 트랙을 다음/이전 슬라이드 위치까지 마저 이동시키고, 트랜지션 끝나면 인덱스 변경
        const width = (frameEl.value?.clientWidth ?? window.innerWidth ?? 400) + SLIDE_GAP
        trackAnimating.value = true
        dragX.value = dx < 0 ? -width : width
        const direction: 'next' | 'prev' = dx < 0 ? 'next' : 'prev'
        window.setTimeout(() => {
          trackAnimating.value = false
          if (direction === 'next') next()
          else prev()
          dragX.value = 0
        }, 260)

        lastTapAt = 0
        isPinching = false
        isPanning = false
        gestureActive.value = false
        return
      }

      // 임계값 미달 → 원위치로 부드럽게 복귀
      if (wasHorizontal) {
        trackAnimating.value = true
        dragX.value = 0
      } else {
        dragX.value = 0
      }
    }
    swipeTracking = false
    swipeIntent = 'pending'

    isPinching = false
    isPanning = false
    gestureActive.value = false

    // 확대 해제 시 위치도 원복
    if (scale.value <= MIN_SCALE + 0.01) {
      resetTransform()
    }

    // 더블탭 — 1배 ↔ 2배 토글
    if (e.changedTouches.length === 1) {
      const now = Date.now()
      if (now - lastTapAt < 280) {
        if (scale.value > 1) {
          resetTransform()
        } else {
          scale.value = 2
        }
        lastTapAt = 0
      } else {
        lastTapAt = now
      }
    }
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="open && slides.length"
        class="lb"
        data-allow-zoom
        role="dialog"
        aria-modal="true"
        aria-label="갤러리 확대 보기"
        @click.self="emit('close')"
      >
        <button type="button" class="lb__close ghost" aria-label="닫기" @click="emit('close')">
          ✕
        </button>

        <button
          type="button"
          class="lb__nav lb__nav--prev ghost"
          aria-label="이전"
          @click.stop="prev"
        >
          ‹
        </button>

        <div
          ref="frameEl"
          class="lb__frame"
          @touchstart.passive="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <div class="lb__track" :style="trackStyle">
            <div class="lb__slide" aria-hidden="true">
              <img
                v-if="prevSlide"
                class="lb__img lb__img--static"
                :src="prevSlide.src"
                :alt="prevSlide.alt ?? ''"
                decoding="async"
                draggable="false"
              />
            </div>
            <div class="lb__slide">
              <img
                v-if="currentSlide"
                class="lb__img"
                :src="currentSlide.src"
                :alt="currentSlide.alt ?? ''"
                :style="imgStyle"
                decoding="async"
                draggable="false"
              />
            </div>
            <div class="lb__slide" aria-hidden="true">
              <img
                v-if="nextSlide"
                class="lb__img lb__img--static"
                :src="nextSlide.src"
                :alt="nextSlide.alt ?? ''"
                decoding="async"
                draggable="false"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          class="lb__nav lb__nav--next ghost"
          aria-label="다음"
          @click.stop="next"
        >
          ›
        </button>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 220ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.lb {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

.ghost {
  border: none;
  background: transparent;
}

// 닫기 — 우측 상단, 회색
.lb__close {
  position: absolute;
  top: calc(12px + env(safe-area-inset-top));
  right: 12px;
  width: 42px;
  height: 42px;
  font-size: 1.15rem;
  color: #888888;
  z-index: 2;
  margin-bottom: 20px;
  &:hover {
    color: #555555;
  }
}

// 좌우 화살표 — 사진 위에 겹쳐서 흰색
.lb__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 64px;
  font-size: 2rem;
  line-height: 1;
  color: #ffffff;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.45);
  z-index: 2;
}

.lb__nav--prev {
  left: 6px;
}

.lb__nav--next {
  right: 6px;
}

// 사진 영역 — 화면 가로 100%, 위/아래 빈 공간은 흰색 배경
.lb__frame {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  // 핀치 줌/팬은 직접 처리하므로 브라우저 기본 제스처는 막음
  touch-action: none;
  user-select: none;
}

.lb__track {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 24px;
  will-change: transform;
}

.lb__slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb__img {
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
  transform-origin: center center;
  will-change: transform;
  -webkit-user-drag: none;
  user-select: none;
}

.lb__img--static {
  // 미리보기 슬라이드는 변형 없이 고정 크기로
  transform: none !important;
  transition: none !important;
}
</style>

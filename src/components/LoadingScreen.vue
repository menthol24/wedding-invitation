<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 사전 로드할 핵심 이미지 URL — 가장 큰 히어로/포스터 이미지 */
    preloadImages?: string[]
    /** 최소 노출 시간 (ms) — 너무 빨리 사라지면 깜빡거림처럼 보여 어색함 */
    minDuration?: number
    /** 안전장치: 이 시간(ms)이 지나면 로드 실패와 무관하게 강제 종료 */
    maxDuration?: number
    /** 로딩 중 표시할 텍스트 라인 */
    groomName?: string
    brideName?: string
    subText?: string
  }>(),
  {
    preloadImages: () => [],
    minDuration: 1400,
    maxDuration: 5000,
    groomName: '',
    brideName: '',
    subText: 'Loading our story...',
  },
)

const emit = defineEmits<{
  done: []
}>()

const visible = ref(true)
const fadingOut = ref(false)

let startedAt = 0
let safetyTimer: ReturnType<typeof setTimeout> | null = null

function startFadeOut() {
  if (fadingOut.value) return
  fadingOut.value = true
  // 트랜지션 시간(0.6s) 후 DOM 제거
  setTimeout(() => {
    visible.value = false
    emit('done')
  }, 600)
}

function preload(url: string): Promise<void> {
  return new Promise((resolve) => {
    if (!url) return resolve()
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = url
  })
}

onMounted(async () => {
  startedAt = performance.now()

  safetyTimer = setTimeout(() => {
    startFadeOut()
  }, props.maxDuration)

  await Promise.all(props.preloadImages.map(preload))

  const elapsed = performance.now() - startedAt
  const wait = Math.max(0, props.minDuration - elapsed)
  setTimeout(startFadeOut, wait)
})

onBeforeUnmount(() => {
  if (safetyTimer) clearTimeout(safetyTimer)
})
</script>

<template>
  <Transition name="loading-fade">
    <div
      v-if="visible"
      class="loading"
      :class="{ 'loading--out': fadingOut }"
      role="status"
      aria-live="polite"
      aria-label="청첩장을 불러오고 있습니다"
    >
      <!-- 떨어지는 꽃잎 -->
      <div class="petals" aria-hidden="true">
        <span v-for="i in 9" :key="i" class="petal" :class="`petal--${i}`" />
      </div>

      <!-- 메인 카피 -->
      <div class="stage">
        <p class="stage__top">Wedding Invitation</p>

        <div class="names">
          <span class="names__name names__name--groom">
            <span class="names__name-inner">{{ groomName }}</span>
          </span>
          <span class="names__heart" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path
                d="M12 21s-7.5-4.7-9.6-9.4C.9 7.7 3 4 6.6 4c2.1 0 3.7 1.2 4.6 2.7C12.1 5.2 13.7 4 15.8 4 19.4 4 21.5 7.7 19.9 11.6 17.8 16.3 12 21 12 21z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span class="names__name names__name--bride">
            <span class="names__name-inner">{{ brideName }}</span>
          </span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.loading {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(
      120% 80% at 50% 0%,
      rgba(252, 233, 224, 0.85) 0%,
      rgba(250, 245, 238, 0.95) 45%,
      var(--color-bg) 100%
    );

  // 부드럽게 사라짐
  transition: opacity 0.6s ease;

  &--out {
    opacity: 0;
    pointer-events: none;
  }
}

// === 메인 스테이지 ===
.stage {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 24px;
  animation: stage-in 1.2s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

.stage__top {
  margin: 0 0 22px;
  font-family: $font-display;
  font-size: 0.7rem;
  letter-spacing: 0.42em;
  text-transform: uppercase;
  color: var(--color-body-muted);
  opacity: 0.75;
}

.names {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 28px;
}

.names__name {
  // iOS Safari 의 background-clip:text + transform 애니메이션 충돌 방지를 위해
  // 그라디언트 텍스트는 inner span 으로 분리, 애니메이션은 바깥 요소가 담당
  display: inline-block;
  font-family: $font-poster-script;
  font-size: clamp(1.8rem, 9vw, 2.4rem);
  line-height: 1.4;
  padding: 0.05em 0.08em;
  letter-spacing: 0.02em;
  white-space: nowrap;
  // GPU 합성 강제 — iOS Safari 가 애니메이션을 안정적으로 재생
  will-change: transform, opacity;
  transform: translateZ(0);

  &--groom {
    animation: name-in-left 1.2s cubic-bezier(0.22, 0.61, 0.36, 1) 0.15s both;
  }

  &--bride {
    animation: name-in-right 1.2s cubic-bezier(0.22, 0.61, 0.36, 1) 0.35s both;
  }
}

// 골드 그라디언트는 inner span 에만 적용 (clip:text + transform 충돌 분리)
.names__name-inner {
  display: inline-block;
  color: var(--color-section-heading);
  background: var(--color-loading-gradation);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.names__heart {
  display: inline-flex;
  color: var(--color-countdown-pink);
  animation: heartbeat 1.4s ease-in-out 0.6s infinite both;
}

.stage__sub {
  margin: 0 0 28px;
  font-family: 'Cormorant Garamond', $font-display, serif;
  font-style: italic;
  font-size: 0.86rem;
  letter-spacing: 0.18em;
  color: var(--color-body-muted);
  opacity: 0;
  animation: sub-in 1s ease 0.7s forwards;
}

// === 키프레임 ===
@keyframes stage-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes name-in-left {
  from {
    opacity: 0;
    transform: translateX(-14px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes name-in-right {
  from {
    opacity: 0;
    transform: translateX(14px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes sub-in {
  to {
    opacity: 1;
  }
}

@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  18% {
    transform: scale(1.18);
  }
  36% {
    transform: scale(0.96);
  }
  54% {
    transform: scale(1.08);
  }
  72% {
    transform: scale(1);
  }
}

@keyframes bar-slide {
  0% {
    left: -40%;
  }
  100% {
    left: 100%;
  }
}

// === 접근성: 모션 줄이기 선호 시 — 무한 반복/장식만 끄고 등장 애니메이션은 유지
// (iOS 저전력 모드 등에서 reduce 가 강제될 때 화면이 정적으로만 보이는 문제 방지)
@media (prefers-reduced-motion: reduce) {
  .petals {
    display: none;
  }

  .names__heart {
    animation: none;
  }

  .bar__fill {
    animation: bar-slide 2.4s linear infinite;
  }
}
</style>

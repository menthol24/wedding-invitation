<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

withDefaults(
  defineProps<{
    imageUrl: string
    titleLines: string[]
    /** 로딩 화면 종료 후 true 가 되면 타이틀 애니메이션이 재생됨 */
    play?: boolean
    /** 포스터 상단 양옆에 표시할 이름 */
    groomName?: string
    brideName?: string
    dateLabel: string
    venueName: string
    /** 신랑/신부 역할 라벨 — 로케일별로 다른 텍스트 (예: 한국어 '신랑/신부', 일본어 '新郎/新婦') */
    roleLabels: {
      groom: string
      bride: string
    }
  }>(),
  {
    play: false,
    groomName: '',
    brideName: '',
  },
)

// 카카오톡 인앱브라우저 등에서 하단 컨트롤바가 동적으로 등장/퇴장하면 svh/lvh 단위가
// 의도와 달리 재계산되며 포스터 사진이 흔들려 보임. 진입 시점의 innerHeight를 px로
// 박아두고 세로/가로 회전 시에만 갱신해 컨테이너를 고정.
const posterHeight = ref<string>('100lvh')

function measureHeight() {
  posterHeight.value = `${window.innerHeight}px`
}

onMounted(() => {
  measureHeight()
  window.addEventListener('orientationchange', measureHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('orientationchange', measureHeight)
})
</script>

<template>
  <section class="poster" aria-label="웰컴 영역">
    <div class="poster__photo" :style="{ height: posterHeight }">
      <img :src="imageUrl" decoding="async" fetchpriority="high" />
      <!-- 포스터 상단 양옆 이름 헤더 -->
      <div v-if="groomName || brideName" class="poster__names">
        <span class="poster__names-side poster__names-side--left">
          <span class="poster__names-role">{{ roleLabels.groom }}</span>
          <span class="poster__names-given">{{ groomName }}</span>
        </span>
        <span class="poster__names-side poster__names-side--right">
          <span class="poster__names-role">{{ roleLabels.bride }}</span>
          <span class="poster__names-given">{{ brideName }}</span>
        </span>
      </div>

      <!-- 반짝이 — 4점 별(메인) + 글로우 닷(서브) 믹스 -->
      <div class="poster__sparkles" aria-hidden="true">
        <template v-for="i in 12" :key="i">
          <!-- 인덱스 3/7/11 위치를 글로우 닷 — 좌측·좌측·하단가운데로 분산 -->
          <span
            v-if="[3, 7, 11].includes(i)"
            class="sparkle sparkle--dot"
            :class="`sparkle--${i}`"
          />
          <!-- 나머지는 4점 다이아몬드 별 -->
          <svg
            v-else
            class="sparkle sparkle--star"
            :class="`sparkle--${i}`"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 0 C12.4 7 13 9.6 14.4 11 C15.8 12.4 18.4 13 24 12 C18.4 12 15.8 12.4 14.4 13 C13 13.6 12.4 16 12 24 C11.6 16 11 13.6 9.6 13 C8.2 12.4 5.6 12 0 12 C5.6 12 8.2 11.6 9.6 11 C11 10.4 11.6 7 12 0 Z"
              fill="currentColor"
            />
          </svg>
        </template>
      </div>

      <div class="poster__copy" :class="{ 'poster__copy--play': play }">
        <p v-for="(line, i) in titleLines" :key="i" class="poster__line">{{ line }}</p>
        <div class="poster__info">
          <p class="date">{{ dateLabel }}</p>
          <p class="venue">{{ venueName }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use 'sass:list';
.poster {
  position: relative;
  width: 100%;
}

.poster__photo {
  position: relative;
  overflow: hidden;
  width: 100%;
  // 실제 height는 인라인 스타일로 진입 시점 innerHeight(px)가 주입됨.
  // 아래 값은 JS 미실행/하이드레이션 전 폴백 용도.
  height: 100lvh;
  max-height: 860px;
  margin-bottom: -1px;
  contain: paint;

  img {
    // transform: scale 대신 실제 사이즈로 확대 — 모바일 사파리에서 합성 레이어 변형 버그 방지
    position: absolute;
    width: 130%;
    height: 130%;
    left: -15%;
    top: -15%;
    object-fit: cover;
    object-position: center 45%;
    display: block;
    // 사진 하단을 부드럽게 페이드 — 다음 섹션과 자연스럽게 이어지도록
    -webkit-mask-image: linear-gradient(
      to bottom,
      #000 0%,
      #000 78%,
      rgba(0, 0, 0, 0.55) 92%,
      rgba(0, 0, 0, 0) 100%
    );
    mask-image: linear-gradient(
      to bottom,
      #000 0%,
      #000 78%,
      rgba(0, 0, 0, 0.55) 92%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  // 하단 살짝 블러 — mask 가 알파만 깎아내므로 픽셀 자체를 흐리려면 별도 레이어가 필요
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 22%;
    pointer-events: none;
    z-index: 1;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    // 블러를 아래로 갈수록 강해지도록 mask
    -webkit-mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.7) 60%,
      #000 100%
    );
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.7) 60%,
      #000 100%
    );
  }
}

// 상단 양옆 신랑/신부 이름
.poster__names {
  position: absolute;
  top: calc(20px + env(safe-area-inset-top));
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0 22px;
  pointer-events: none;
  z-index: 2; // veil/sparkles 위, copy 아래
  color: #ffffff;
  // 사진 위에서도 가독성 확보
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.75);
}

.poster__names-side {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;

  &--right {
    text-align: right;
  }
}

.poster__names-role {
  font-family: $font-body;
  font-size: $fs-xs;
  letter-spacing: $ls-wide;
  opacity: 0.85;
}

.poster__names-given {
  font-family: $font-body;
  font-size: $fs-base;
  font-weight: 500;
  letter-spacing: $ls-wide;
}

.poster__copy {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  text-align: center;
  padding: 56px 24px 40px;
  pointer-events: none;
}

.poster::after {
  z-index: 2;
}

.poster__copy {
  z-index: 3;
}

.poster__line {
  width:100%;
  display: inline-block;
  margin: 0;
  font-family: $font-poster-script;
  font-size: clamp(3.0rem, 9vw, 3.6rem);
  font-weight: 400;

  line-height: $lh-tight;
  color: var(--color-poster-gold);
  white-space: nowrap;
  opacity: 0;
  clip-path: inset(0 100% 0 0);
}

// play 트리거가 들어와야 손글씨 reveal 애니메이션이 시작됨
.poster__copy--play .poster__line {
  animation: handwritingReveal 1.8s ease forwards;

  &:nth-child(2) {
    animation-delay: 1.1s;
  }
}

@keyframes handwritingReveal {
  0% {
    opacity: 0;
    clip-path: inset(0 100% 0 0);
  }

  1% {
    opacity: 1;
  }

  100% {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }
}

// === 반짝이 ===
.poster__sparkles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1; // veil 위, copy 아래
  // 자연스러운 빛이 번지도록 살짝 광택
  mix-blend-mode: screen;
  // iOS Safari 가 애니메이션 레이어를 안정적으로 합성하도록 격리
  transform: translateZ(0);
  isolation: isolate;
}

// 공통 — 위치/사이즈/애니메이션
.sparkle {
  position: absolute;
  width: 14px;
  height: 14px;
  opacity: 0;
  transform-origin: center center;
  will-change: opacity, transform;
  animation: twinkle 3.4s ease-in-out infinite;
}

// 별 — 4점 다이아몬드, 회전하며 깜빡임
.sparkle--star {
  color: var(--color-poster-gold);
  // iOS 부하 감소를 위해 drop-shadow 약하게 (이전 4px 0.85 → 2px 0.7)
  filter: drop-shadow(0 0 2px rgba(255, 232, 168, 0.7));
}

// 글로우 닷 — 별 사이사이 잔잔한 빛점. 작고 단순하게
.sparkle--dot {
  // 닷은 별보다 작게 — 전체 .sparkle 의 14px 를 덮어씀
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 240, 200, 0.9);
  // 다중 box-shadow → 단일 약한 글로우 (iOS 부하 감소)
  box-shadow: 0 0 6px 2px rgba(255, 225, 165, 0.55);
  animation-name: twinkle-dot;
}

// 손으로 흩뿌린 듯 — 가운데(가로 30~70%, 세로 35~75%) 는 비우고 가장자리/모서리에 배치
// (top/left/size/duration/delay)
$sparkles: (
  ( 8%,  10%, 16px, 3.6s, 0.0s),  // 좌상
  (12%,  78%, 10px, 4.2s, 0.7s),  // 우상
  (22%,  20%, 20px, 3.0s, 1.4s),  // 좌상
  (18%,  90%, 12px, 3.8s, 0.3s),  // 우상
  (32%,   8%,  9px, 4.6s, 2.1s),  // 좌측
  (28%,  72%, 18px, 3.2s, 1.0s),  // 우측
  (50%,   6%, 14px, 4.0s, 1.7s),  // 좌측 중간
  (56%,  88%, 11px, 3.5s, 0.5s),  // 우측 중간
  (78%,  16%, 17px, 4.4s, 2.4s),  // 좌하
  (82%,  74%, 13px, 3.7s, 0.9s),  // 우하
  (88%,  44%,  8px, 4.1s, 1.3s),  // 하단 (글씨 아래쪽)
  (92%,  88%, 10px, 3.3s, 1.9s)   // 우하 코너
);

@for $i from 1 through length($sparkles) {
  $cfg: nth($sparkles, $i);
  // 별에만 사이즈 적용. 닷(.sparkle--dot)은 자기 사이즈(4px) 유지
  .sparkle--star.sparkle--#{$i} {
    width: nth($cfg, 3);
    height: nth($cfg, 3);
  }
  .sparkle--#{$i} {
    top: nth($cfg, 1);
    left: nth($cfg, 2);
    animation-duration: nth($cfg, 4);
    animation-delay: nth($cfg, 5);
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.4) rotate(0deg);
  }
  40% {
    opacity: 0.95;
    transform: scale(1) rotate(45deg);
  }
  55% {
    opacity: 0.7;
    transform: scale(1.08) rotate(60deg);
  }
  70% {
    opacity: 0;
    transform: scale(0.4) rotate(90deg);
  }
}

// 닷 전용 — 회전 없이 부드러운 페이드 + scale
@keyframes twinkle-dot {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5);
  }
  45% {
    opacity: 0.9;
    transform: scale(1);
  }
  60% {
    opacity: 0.7;
    transform: scale(1.1);
  }
  80% {
    opacity: 0;
    transform: scale(0.5);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sparkle {
    animation: none;
    opacity: 0.55;
    transform: scale(0.85) rotate(20deg);
  }
}

.poster__info {
  text-align: center;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
  padding-top: 20px;
}

.date {
  margin: 0px auto 0px;
  font-size: $fs-base;
  font-weight: 500;
  color: #ffffff;
  line-height: $lh-tight;
}

.venue {
  margin: 0 auto 0px;
  font-size: $fs-md;
  font-weight: 500;
  color: #ffffff;
  line-height: $lh-loose;
}
</style>

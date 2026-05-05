<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSwipe } from '@/composables/useSwipe'

export type VenueTab = {
  id: string
  title: string
  imageUrl?: string
  imageAlt?: string
  blocks: { subtitle: string; lines: string[] }[]
}

const props = defineProps<{ tabs: readonly VenueTab[] }>()

const activeId = ref(props.tabs[0]?.id ?? '')

const active = computed(() => props.tabs.find((t) => t.id === activeId.value) ?? props.tabs[0])

const activeIndex = computed(() => props.tabs.findIndex((t) => t.id === activeId.value))

function choose(id: string) {
  activeId.value = id
}

function moveBy(delta: number) {
  if (props.tabs.length === 0) return
  const i = activeIndex.value
  if (i < 0) return
  const next = i + delta
  if (next < 0 || next >= props.tabs.length) return
  activeId.value = props.tabs[next].id
}

// === 드래그 따라가기 ===
const dragX = ref(0) // 손가락 따라 움직이는 가로 오프셋(px)
const animating = ref(false) // 드래그 종료 후 복귀 트랜지션 적용 여부
/** 슬라이드 전환 방향 — 'forward' = 새 패널이 오른쪽에서 들어옴 */
const slideDir = ref<'forward' | 'backward'>('forward')

const panelStyle = computed(() => ({
  transform: dragX.value !== 0 ? `translate3d(${dragX.value}px, 0, 0)` : '',
  transition: animating.value ? 'transform 220ms ease' : 'none',
}))

function canMove(delta: number) {
  const next = activeIndex.value + delta
  return next >= 0 && next < props.tabs.length
}

const swipe = useSwipe({
  onDragMove: (dx) => {
    animating.value = false
    // 끝 패널에서는 저항감을 주기 위해 0.35 비율로 감쇠
    if ((dx < 0 && !canMove(1)) || (dx > 0 && !canMove(-1))) {
      dragX.value = dx * 0.35
    } else {
      dragX.value = dx
    }
  },
  onDragEnd: (committed) => {
    if (committed) {
      // 패널 교체는 <Transition>이 처리하므로 드래그 오프셋만 즉시 리셋
      animating.value = false
      dragX.value = 0
    } else {
      // 임계값 미달 — 원위치로 부드럽게 복귀
      animating.value = true
      dragX.value = 0
    }
  },
  onSwipeLeft: () => {
    if (!canMove(1)) return
    slideDir.value = 'forward'
    moveBy(1)
  },
  onSwipeRight: () => {
    if (!canMove(-1)) return
    slideDir.value = 'backward'
    moveBy(-1)
  },
})

function chooseTab(id: string) {
  const cur = activeIndex.value
  const next = props.tabs.findIndex((t) => t.id === id)
  if (next < 0 || next === cur) return
  slideDir.value = next > cur ? 'forward' : 'backward'
  choose(id)
}
</script>

<template>
  <section class="guide section-pad section-pad--wide" aria-labelledby="guide-heading">
    <div class="tablist" role="tablist" aria-label="예식장 부가 안내">
      <button
        v-for="t in tabs"
        :id="`tab-${t.id}`"
        :key="t.id"
        type="button"
        role="tab"
        class="tab"
        :aria-selected="t.id === activeId"
        :aria-controls="`panel-guide`"
        :class="{ 'tab--active': t.id === activeId }"
        @click="chooseTab(t.id)"
      >
        {{ t.title }}
      </button>
    </div>

    <div
      id="panel-guide"
      class="panel-viewport"
      role="tabpanel"
      :aria-labelledby="'tab-' + (active?.id ?? '')"
      @touchstart.passive="swipe.onTouchStart"
      @touchmove="swipe.onTouchMove"
      @touchend="swipe.onTouchEnd"
      @touchcancel="swipe.onTouchCancel"
    >
      <Transition :name="slideDir === 'forward' ? 'slide-fwd' : 'slide-bwd'" mode="out-in">
        <article
          v-if="active"
          :key="active.id"
          class="panel"
          :style="panelStyle"
        >
          <figure v-if="active.imageUrl" class="figure">
            <img
              :src="active.imageUrl"
              :alt="active.imageAlt || ''"
              loading="lazy"
              decoding="async"
            />
          </figure>

          <div class="blocks">
            <div v-for="(b, i) in active.blocks" :key="`${active.id}-${i}`" class="block">
              <h3 class="sub">{{ b.subtitle }}</h3>
              <p v-for="(ln, li) in b.lines" :key="li" class="para">{{ ln }}</p>
            </div>
          </div>
        </article>
      </Transition>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.title {
  margin: 0 0 36px;
  text-align: center;
  font-family: $font-display;
  font-size: 1.38rem;
  font-weight: 500;
  letter-spacing: 0.07em;
  color: var(--color-section-heading);
}

.tablist {
  display: flex;
  gap: 0;
  justify-content: space-between;
  border-bottom: 1px solid rgba(72, 58, 54, 0.08);
  margin-bottom: 32px;

  button {
    background: transparent;
    border: none;
    padding: 12px 0 16px;
    flex: 1;
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.03em;
    color: var(--color-body-muted);
    position: relative;
  }

  .tab::after {
    content: '';
    position: absolute;
    left: 10%;
    right: 10%;
    bottom: 0;
    height: 2px;
    border-radius: 999px;
    background: transparent;
    transition: background 200ms ease;
  }

  .tab--active {
    color: var(--color-section-heading);
  }

  .tab--active::after {
    background: var(--color-section-heading);
    opacity: 0.75;
  }

  button:focus-visible {
    outline: 1.5px solid rgba(169, 120, 134, 0.35);
    outline-offset: 3px;
    border-radius: 6px;
  }
}

.figure {
  margin: 0 0 30px;

  img {
    width: 100%;
    display: block;
    border-radius: var(--radius-photo);
    object-fit: cover;
    aspect-ratio: 16 / 10;
    border: 1px solid var(--color-border);
  }
}

.block {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.sub {
  margin: 0 0 10px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-section-heading);
}

.para {
  margin: 0 0 7px;
  font-size: 0.86rem;
  line-height: 1.85;
  color: var(--color-body-muted);
  letter-spacing: 0.01em;

  &:last-child {
    margin-bottom: 0;
  }
}

#panel-guide {
  min-height: 380px;
}

.panel-viewport {
  position: relative;
  overflow: hidden;
  // 가로 드래그 시 브라우저 세로 스크롤이 동시에 일어나지 않게
  touch-action: pan-y;
}

.panel {
  will-change: transform;
}

// 다음 탭으로 전환: 새 패널이 오른쪽에서 슬라이드 인, 이전 패널은 왼쪽으로 빠짐
.slide-fwd-enter-from {
  transform: translate3d(100%, 0, 0);
  opacity: 0;
}

.slide-fwd-leave-to {
  transform: translate3d(-100%, 0, 0);
  opacity: 0;
}

// 이전 탭으로 전환: 반대 방향
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
    transform 240ms ease,
    opacity 240ms ease;
}
</style>

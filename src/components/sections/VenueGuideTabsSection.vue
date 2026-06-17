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

const props = defineProps<{ title?: string; tabs: readonly VenueTab[] }>()

const activeId = ref(props.tabs[0]?.id ?? '')

const active = computed(() => props.tabs.find((t) => t.id === activeId.value) ?? props.tabs[0])

const activeIndex = computed(() => props.tabs.findIndex((t) => t.id === activeId.value))

function setActiveByIndex(i: number) {
  if (i < 0 || i >= props.tabs.length) return
  activeId.value = props.tabs[i].id
}

const prevPanel = computed(() => props.tabs[activeIndex.value - 1] ?? null)
const nextPanel = computed(() => props.tabs[activeIndex.value + 1] ?? null)

// === 트랙 기반 카루셀 ===
const dragX = ref(0)
const animating = ref(false)
const viewportEl = ref<HTMLElement | null>(null)

const trackStyle = computed(() => ({
  transform: `translate3d(calc(-100% + ${dragX.value}px), 0, 0)`,
  transition: animating.value ? 'transform 260ms ease' : 'none',
}))

function canMove(delta: number) {
  const next = activeIndex.value + delta
  return next >= 0 && next < props.tabs.length
}

const swipe = useSwipe({
  onDragMove: (dx) => {
    animating.value = false
    if ((dx < 0 && !canMove(1)) || (dx > 0 && !canMove(-1))) {
      dragX.value = dx * 0.35
    } else {
      dragX.value = dx
    }
  },
  onDragEnd: (committed, direction) => {
    if (!committed) {
      animating.value = true
      dragX.value = 0
      return
    }
    const width = viewportEl.value?.clientWidth ?? window.innerWidth ?? 400
    animating.value = true
    dragX.value = direction === 'left' ? -width : width
    window.setTimeout(() => {
      animating.value = false
      setActiveByIndex(activeIndex.value + (direction === 'left' ? 1 : -1))
      dragX.value = 0
    }, 260)
  },
})

function chooseTab(id: string) {
  const cur = activeIndex.value
  const next = props.tabs.findIndex((t) => t.id === id)
  if (next < 0 || next === cur) return
  // 탭 클릭은 즉시 이동 (애니메이션 생략)
  animating.value = false
  dragX.value = 0
  activeId.value = id
}
</script>

<template>
  <section class="guide section-pad" aria-labelledby="guide-heading">
    <h2 v-if="props.title" id="guide-heading" class="title">{{ props.title }}</h2>

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
      ref="viewportEl"
      class="panel-viewport"
      role="tabpanel"
      :aria-labelledby="'tab-' + (active?.id ?? '')"
      @touchstart.passive="swipe.onTouchStart"
      @touchmove="swipe.onTouchMove"
      @touchend="swipe.onTouchEnd"
      @touchcancel="swipe.onTouchCancel"
    >
      <div class="track" :style="trackStyle">
        <article class="slide panel" aria-hidden="true">
          <template v-if="prevPanel">
            <figure v-if="prevPanel.imageUrl" class="figure">
              <img
                :src="prevPanel.imageUrl"
                :alt="prevPanel.imageAlt || ''"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div class="blocks">
              <div
                v-for="(b, i) in prevPanel.blocks"
                :key="`prev-${prevPanel.id}-${i}`"
                class="block"
              >
                <h3 class="sub">{{ b.subtitle }}</h3>
                <p v-for="(ln, li) in b.lines" :key="li" class="para" v-html="ln"></p>
              </div>
            </div>
          </template>
        </article>

        <article v-if="active" class="slide panel">
          <figure v-if="active.imageUrl" class="figure">
            <img
              :src="active.imageUrl"
              :alt="active.imageAlt || ''"
              loading="lazy"
              decoding="async"
            />
          </figure>
          <div class="blocks">
            <div v-for="(b, i) in active.blocks" :key="`cur-${active.id}-${i}`" class="block">
              <h3 class="sub">{{ b.subtitle }}</h3>
              <p v-for="(ln, li) in b.lines" :key="li" class="para" v-html="ln"></p>
            </div>
          </div>
        </article>

        <article class="slide panel" aria-hidden="true">
          <template v-if="nextPanel">
            <figure v-if="nextPanel.imageUrl" class="figure">
              <img
                :src="nextPanel.imageUrl"
                :alt="nextPanel.imageAlt || ''"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div class="blocks">
              <div
                v-for="(b, i) in nextPanel.blocks"
                :key="`next-${nextPanel.id}-${i}`"
                class="block"
              >
                <h3 class="sub">{{ b.subtitle }}</h3>
                <p v-for="(ln, li) in b.lines" :key="li" class="para" v-html="ln"></p>
              </div>
            </div>
          </template>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

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
    font-size: $fs-base;
    font-weight: 500;
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
    color: var(--color-section-item-heading);
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
  font-size: $fs-base;
  font-weight: 600;
  color: var(--color-section-item-heading);
  border-bottom: 0.5px solid var(--color-body-very-light-grey);
  line-height: 2;
}

.para {
  margin: 0 0 7px;
  font-size: $fs-base;
  line-height: $lh-relaxed;
  color: var(--color-body-muted);
  &:last-child {
    margin-bottom: 0;
  }

  // v-html 로 삽입된 형광펜 강조 — 글자 전체 뒤가 칠해지는 형광펜 느낌
  :deep(mark.hl) {
    background: rgba(255, 221, 119, 0.58);
    color: inherit;
    font-weight: 600;
    padding: 1px 3px;
    border-radius: 2px;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
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

.track {
  display: flex;
  align-items: flex-start;
  width: 100%;
  will-change: transform;
}

.slide {
  flex: 0 0 100%;
  width: 100%;
  min-width: 0;
}
</style>

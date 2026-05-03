<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
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
  idx.value -= 1
}

function next() {
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
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="open && slides.length"
        class="lb"
        role="dialog"
        aria-modal="true"
        aria-label="갤러리 확대 보기"
        @click.self="emit('close')"
      >
        <button type="button" class="lb__close ghost" aria-label="닫기" @click="emit('close')">
          ✕
        </button>

        <button type="button" class="lb__nav lb__nav--prev ghost" aria-label="이전" @click.stop="prev">
          ‹
        </button>

        <div class="lb__frame">
          <img
            class="lb__img"
            :src="slides[idx]?.src"
            :alt="slides[idx]?.alt ?? ''"
            decoding="async"
          />
        </div>

        <button type="button" class="lb__nav lb__nav--next ghost" aria-label="다음" @click.stop="next">
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
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 44px;
  grid-template-rows: 48px 1fr;
  align-items: center;
  gap: 0 6px;
  padding: calc(12px + env(safe-area-inset-top)) 10px calc(24px + env(safe-area-inset-bottom));
  background: rgba(28, 24, 22, 0.72);
}

.ghost {
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #f7f6f3;
  border-radius: 10px;
  backdrop-filter: blur(6px);
}

.lb__close {
  grid-column: 3;
  justify-self: end;
  align-self: start;
  width: 42px;
  height: 38px;
  font-size: 1.05rem;
}

.lb__nav {
  width: 40px;
  height: 64px;
  font-size: 1.85rem;
  line-height: 1;
}

.lb__nav--prev {
  grid-column: 1;
  grid-row: 2;
}

.lb__nav--next {
  grid-column: 3;
  grid-row: 2;
}

.lb__frame {
  grid-column: 2;
  grid-row: 2;
  justify-self: center;
  align-self: center;
  max-height: calc(92vh - 48px - env(safe-area-inset-bottom));
  width: min(92vw, 420px);
  display: flex;
  justify-content: center;
}

.lb__img {
    max-height: calc(92vh - 48px - env(safe-area-inset-bottom));
    width: auto;
    max-width: 100%;
    border-radius: 10px;
    object-fit: contain;
    box-shadow: 0 16px 48px rgba(28, 24, 22, 0.28);
  }

@media (min-width: 520px) {
  .lb {
    grid-template-columns: 54px minmax(0, 1fr) 54px;
  }
}
</style>

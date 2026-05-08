<script setup lang="ts">
import { computed, ref } from 'vue'
import GalleryLightbox from '@/components/gallery/GalleryLightbox.vue'
import type { GallerySlide } from '@/components/gallery/gallery.types'

export interface GalleryItem {
  id: string
  src: string
  alt: string
}

const props = defineProps<{ title?: string; items: GalleryItem[] }>()

// 3열 × 5행 = 15장까지 펼치기 전 노출
const COLLAPSED_ROWS = 4
const COLUMNS = 3
const COLLAPSED_COUNT = COLLAPSED_ROWS * COLUMNS

const expanded = ref(false)
const canCollapse = computed(() => props.items.length > COLLAPSED_COUNT)
const visibleItems = computed(() =>
  canCollapse.value && !expanded.value
    ? props.items.slice(0, COLLAPSED_COUNT)
    : props.items,
)

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const slides = ref<GallerySlide[]>([])

function openAt(index: number) {
  slides.value = props.items.map((it) => ({ src: it.src, alt: it.alt }))
  lightboxIndex.value = index
  lightboxOpen.value = true
}

function closeLightbox() {
  lightboxOpen.value = false
}

function toggleExpanded() {
  expanded.value = !expanded.value
}
</script>

<template>
  <section class="gallery section-pad section-pad--wide" aria-labelledby="gallery-heading">
    <h2 v-if="title" id="gallery-heading" class="title">{{ title }}</h2>

    <div class="grid">
      <button
        v-for="(it, idx) in visibleItems"
        :key="it.id"
        type="button"
        class="tile"
        @click="openAt(idx)"
      >
        <img :src="it.src" :alt="it.alt" loading="lazy" decoding="async" />
      </button>
    </div>

    <button
      v-if="canCollapse"
      type="button"
      class="toggle"
      :class="{ 'toggle--expanded': expanded }"
      :aria-expanded="expanded"
      :aria-label="expanded ? '갤러리 접기' : '갤러리 더보기'"
      @click="toggleExpanded"
    >
      <span class="chevron" aria-hidden="true" />
    </button>

    <GalleryLightbox
      :open="lightboxOpen"
      :slides="slides"
      :initial-index="lightboxIndex"
      @close="closeLightbox"
      @update-index="lightboxIndex = $event"
    />
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.gallery {
  padding-inline: 0px !important;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2px;
  background: #ffffff;
  border-radius: 4px;
}

.toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto 0;
  width: 44px;
  height: 44px;
  padding: 0;
  background: transparent;
  border: 1px solid #e4e3e2;
  border-radius: 10px;
  cursor: pointer;
  color: #979696;

  &:focus-visible {
    outline: 2px solid rgba(212, 163, 163, 0.55);
    outline-offset: 2px;
    border-radius: 999px;
  }
}

// 꺽쇠 — 두 변을 보더로 그려 회전
.chevron {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: translateY(-3px) rotate(45deg);
  transition: transform 0.2s ease;
}

.toggle--expanded .chevron {
  transform: translateY(3px) rotate(-135deg);
}

.tile {
  position: relative;
  padding: 0;
  margin: 0;
  overflow: hidden;
  border-radius: 2px;
  border: none;
  background: var(--color-bg-soft);
  appearance: none;
  outline: none;
  cursor: zoom-in;

  &:focus-visible {
    outline: 2px solid rgba(212, 163, 163, 0.55);
    outline-offset: 1px;
  }

  img {
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    display: block;
    vertical-align: middle;
  }
}

@media (max-width: 340px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import GalleryLightbox from '@/components/gallery/GalleryLightbox.vue'
import type { GallerySlide } from '@/components/gallery/gallery.types'

export interface GalleryItem {
  id: string
  src: string
  alt: string
}

const props = defineProps<{ items: GalleryItem[] }>()

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
</script>

<template>
  <section class="gallery section-pad section-pad--wide" aria-labelledby="gallery-heading">
    <h2 id="gallery-heading" class="title">갤러리</h2>

    <div class="grid">
      <button
        v-for="(it, idx) in props.items"
        :key="it.id"
        type="button"
        class="tile"
        @click="openAt(idx)"
      >
        <img :src="it.src" :alt="it.alt" loading="lazy" decoding="async" />
      </button>
    </div>

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

.title {
  margin: 0 0 40px;
  text-align: center;
  font-family: $font-display;
  font-size: 1.38rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--color-section-heading);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2px;
  background: rgba(72, 58, 54, 0.06);
  padding: 2px;
  border-radius: 4px;
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

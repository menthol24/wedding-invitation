<script setup lang="ts">
import { ref, computed } from 'vue'

export type VenueTab = {
  id: string
  title: string
  imageUrl: string
  imageAlt: string
  blocks: { subtitle: string; lines: string[] }[]
}

const props = defineProps<{ tabs: readonly VenueTab[] }>()

const activeId = ref(props.tabs[0]?.id ?? '')

const active = computed(() =>
  props.tabs.find((t) => t.id === activeId.value) ?? props.tabs[0],
)

function choose(id: string) {
  activeId.value = id
}
</script>

<template>
  <section class="guide section-pad section-pad--wide" aria-labelledby="guide-heading">
    <h2 id="guide-heading" class="title">예식장 부가 안내</h2>

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
        @click="choose(t.id)"
      >
        {{ t.title }}
      </button>
    </div>

    <article
      id="panel-guide"
      class="panel"
      role="tabpanel"
      :aria-labelledby="'tab-' + (active?.id ?? '')"
    >
      <figure v-if="active" class="figure">
        <img :src="active.imageUrl" :alt="active.imageAlt" loading="lazy" decoding="async" />
      </figure>

      <div v-if="active" class="blocks">
        <div v-for="(b, i) in active.blocks" :key="`${active.id}-${i}`" class="block">
          <h3 class="sub">{{ b.subtitle }}</h3>
          <p v-for="(ln, li) in b.lines" :key="li" class="para">{{ ln }}</p>
        </div>
      </div>
    </article>
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
</style>

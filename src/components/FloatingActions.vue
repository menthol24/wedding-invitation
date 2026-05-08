<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const show = ref(false)

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onScroll() {
  show.value = window.scrollY > 360
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div v-if="show" class="fab" aria-label="바로가기">
    <button type="button" class="bubble" aria-label="맨 위로" @click="scrollTop">
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z" fill="currentColor" />
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
.fab {
  position: fixed;
  right: calc((100vw - min(100vw, var(--page-max))) / 2 + max(14px, env(safe-area-inset-right, 0px)));
  bottom: calc(22px + env(safe-area-inset-bottom, 0));
  display: grid;
  gap: 12px;
  z-index: 1500;

  @media (min-width: 520px) {
    right: calc((100vw - var(--page-max)) / 2 + 18px);
  }
}

.bubble {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  display: grid;
  place-items: center;
  background: rgba(130, 126, 122, 0.22);
  backdrop-filter: blur(10px);
  color: #ffffff;
  box-shadow: 0 4px 18px rgba(42, 36, 34, 0.08);

  &:active {
    transform: translateY(1px);
    opacity: 0.92;
  }
}

.bubble--kakao {
  background: #fee500;
  backdrop-filter: none;
  color: #191919;
  box-shadow: 0 4px 18px rgba(42, 36, 34, 0.12);
}

</style>

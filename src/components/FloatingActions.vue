<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { shareMeta } from '@/mocks/wedding.mock'

const show = ref(false)

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function share() {
  const url = window.location.href
  try {
    if (navigator.share) {
      await navigator.share({
        title: shareMeta.title,
        text: shareMeta.text,
        url,
      })
      return
    }
    await navigator.clipboard.writeText(url)
    window.alert('초대 링크가 복사되었습니다.')
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') return
    try {
      window.prompt('아래 링크를 복사해 주세요', url)
    } catch {
      void e
    }
  }
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
    <button type="button" class="bubble" aria-label="공유" @click="share">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
          fill="currentColor"
          opacity="0.88"
        />
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
</style>

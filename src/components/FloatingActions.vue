<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { shareMeta } from '@/mocks/wedding.mock'
import { ensureKakaoReady, shareWedding } from '@/services/kakao/share'

const show = ref(false)

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function share() {
  // 카카오톡 공유 우선 — SDK 가 준비되지 않은 환경에선 링크 복사로 폴백
  const ok = shareWedding({
    title: shareMeta.title,
    description: shareMeta.description,
    imageUrl: shareMeta.imageUrl,
  })
  if (ok) return

  const url = window.location.href
  try {
    await navigator.clipboard.writeText(url)
    window.alert('초대 링크가 복사되었습니다.')
  } catch {
    window.prompt('아래 링크를 복사해 주세요', url)
  }
}

function onScroll() {
  show.value = window.scrollY > 360
}

onMounted(() => {
  ensureKakaoReady()
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
    <button type="button" class="bubble bubble--kakao" aria-label="카카오톡으로 공유" @click="share">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3.5C6.8 3.5 2.6 6.78 2.6 10.83c0 2.6 1.74 4.88 4.36 6.18-.19.66-.69 2.42-.79 2.79-.13.46.17.45.36.33.15-.1 2.34-1.59 3.29-2.24.7.1 1.43.16 2.18.16 5.2 0 9.4-3.28 9.4-7.32S17.2 3.5 12 3.5z"
          fill="#191919"
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

.bubble--kakao {
  background: #fee500;
  backdrop-filter: none;
  color: #191919;
  box-shadow: 0 4px 18px rgba(42, 36, 34, 0.12);
}
</style>

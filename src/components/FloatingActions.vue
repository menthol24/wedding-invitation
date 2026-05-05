<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { shareMeta } from '@/mocks/wedding.mock'
import { ensureKakaoReady, shareWedding } from '@/services/kakao/share'

const show = ref(false)

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/** 일반 공유 — Web Share API 가 있으면 시스템 공유시트, 아니면 링크 복사 */
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

/** 카카오톡 공유 — Feed 템플릿 */
async function shareKakao() {
  const ok = shareWedding({
    title: shareMeta.title,
    description: shareMeta.description,
    imageUrl: shareMeta.imageUrl,
    linkUrl: shareMeta.url,
  })
  if (ok) return

  // SDK 가 로드되지 않았거나 차단된 경우 링크 복사로 폴백
  const url = window.location.href
  try {
    await navigator.clipboard.writeText(url)
    window.alert('카카오톡 공유를 사용할 수 없어 초대 링크를 복사했어요.')
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
    <button type="button" class="bubble" aria-label="공유" @click="share">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
          fill="currentColor"
          opacity="0.88"
        />
      </svg>
    </button>
    <button
      type="button"
      class="bubble bubble--kakao"
      aria-label="카카오톡으로 공유"
      @click="shareKakao"
    >
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

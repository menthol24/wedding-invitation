<script setup lang="ts">
import { onMounted } from 'vue'
import { ensureKakaoReady, shareWedding } from '@/services/kakao/share'
import endingImage from '@/assets/images/ending.png'

const props = defineProps<{
  message?: string
  signoff?: string
  share: {
    title: string
    text: string
    description: string
    imageUrl: string
    imageWidth: number
    imageHeight: number
    url: string
  }
}>()

onMounted(() => {
  ensureKakaoReady()
})

/** 일반 공유 — Web Share API 가 있으면 시스템 공유시트, 아니면 링크 복사 */
async function onShare() {
  const url = window.location.href
  try {
    if (navigator.share) {
      await navigator.share({
        title: props.share.title,
        text: props.share.text,
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
async function onShareKakao() {
  const ok = shareWedding({
    title: props.share.title,
    description: props.share.description,
    imageUrl: props.share.imageUrl,
    imageWidth: props.share.imageWidth,
    imageHeight: props.share.imageHeight,
    linkUrl: props.share.url,
  })
  if (ok) return

  const url = window.location.href
  try {
    await navigator.clipboard.writeText(url)
    window.alert('카카오톡 공유를 사용할 수 없어 초대 링크를 복사했어요.')
  } catch {
    window.prompt('아래 링크를 복사해 주세요', url)
  }
}
</script>

<template>
  <footer class="foot">
    <img :src="endingImage" alt="" class="foot__ending" />
    <p v-if="message" class="foot__message">{{ message }}</p>
    <p v-if="signoff" class="foot__signoff">{{ signoff }}</p>

    <div class="foot__share">
      <button
        type="button"
        class="foot__btn foot__btn--share"
        aria-label="공유하기"
        @click="onShare"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
            fill="currentColor"
          />
        </svg>
        <span>공유하기</span>
      </button>

      <button
        type="button"
        class="foot__btn foot__btn--kakao"
        aria-label="카카오톡으로 공유"
        @click="onShareKakao"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3.5C6.8 3.5 2.6 6.78 2.6 10.83c0 2.6 1.74 4.88 4.36 6.18-.19.66-.69 2.42-.79 2.79-.13.46.17.45.36.33.15-.1 2.34-1.59 3.29-2.24.7.1 1.43.16 2.18.16 5.2 0 9.4-3.28 9.4-7.32S17.2 3.5 12 3.5z"
            fill="#191919"
          />
        </svg>
        <span>카카오톡 공유</span>
      </button>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.foot {
  text-align: center;
  padding: 56px 24px calc(96px + env(safe-area-inset-bottom));
  color: var(--color-body-muted);
}

.foot__ending {
  display: block;
  width: 260px;
  max-width: 80%;
  height: auto;
  margin: 0 auto 24px;
  // PNG 투명 영역을 무시하고 하트 실루엣을 따라 외곽선을 그림
  // 1px drop-shadow 4방향을 겹쳐 균일한 테두리 효과
  filter:
    drop-shadow(1px 0 0 var(--color-poster-gold, #c9a96b))
    drop-shadow(-1px 0 0 var(--color-poster-gold, #c9a96b))
    drop-shadow(0 1px 0 var(--color-poster-gold, #c9a96b))
    drop-shadow(0 -1px 0 var(--color-poster-gold, #c9a96b));
}

.foot__message {
  margin: 0;
  font-family: $font-title-kor;
  font-size: $fs-md;
  letter-spacing: $ls-base;
  line-height: $lh-base;
  color: var(--color-section-heading);
}

.foot__signoff {
  margin: 15px 0 0;
  font-family: $font-body;
  font-size: $fs-base;
  color: var(--color-body-muted);
}

// 푸터 공유 버튼 — 좌우 정렬, 동일한 너비로 1:1
.foot__share {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 32px auto 0;
  max-width: 320px;
  padding-top: 50px;
}

.foot__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-family: $font-body;
  font-size: $fs-base;

  color: var(--color-body);
  cursor: pointer;
  transition: background-color 0.18s ease, transform 0.1s ease;

  &:hover {
    background: var(--color-bg-soft);
  }

  &:active {
    transform: translateY(1px);
  }

  svg {
    flex-shrink: 0;
  }
}

.foot__btn--kakao {
  background: #fee500;
  border-color: #fee500;
  color: #191919;

  &:hover {
    background: #fada0a;
  }
}
</style>

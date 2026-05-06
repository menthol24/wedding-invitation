import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export interface UseRevealOptions {
  /** IntersectionObserver threshold (0~1) */
  threshold?: number
  /** rootMargin — 뷰포트보다 일찍/늦게 트리거하고 싶을 때 사용 */
  rootMargin?: string
  /** true면 한 번 보이고 난 뒤에는 다시 숨기지 않음 (기본 true) */
  once?: boolean
}

/**
 * 스크롤로 요소가 뷰포트에 들어오면 `revealed`를 true로 만들어 주는 훅.
 * `prefers-reduced-motion`이 켜진 환경에서는 즉시 true로 시작해 애니메이션을 생략.
 */
export function useReveal(options: UseRevealOptions = {}): {
  el: Ref<HTMLElement | null>
  revealed: Ref<boolean>
} {
  const { threshold = 0.5, rootMargin = '0px 0px -20% 0px', once = false } = options

  const el = ref<HTMLElement | null>(null)
  const revealed = ref(false)

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    // 모션을 줄이고 싶다는 사용자 설정이면 즉시 표시
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      revealed.value = true
      return
    }

    // IntersectionObserver 미지원 환경에서도 즉시 표시
    if (typeof IntersectionObserver === 'undefined' || !el.value) {
      revealed.value = true
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            revealed.value = true
            if (once && observer) {
              observer.disconnect()
              observer = null
            }
          } else if (!once) {
            revealed.value = false
          }
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })

  return { el, revealed }
}

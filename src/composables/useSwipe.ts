/**
 * 수평 스와이프 제스처 핸들러 생성 훅
 *
 * - 단일 손가락 좌/우 스와이프만 감지 (멀티터치/세로 스와이프는 무시)
 * - 임계값(threshold) 이상 가로 이동 + 세로 이동보다 가로 이동이 클 때만 콜백 호출
 * - 드래그 중 onDragMove, 종료 시 onDragEnd 콜백으로 손가락을 따라가는 애니메이션 구현 가능
 * - touch-action 등 CSS 설정은 사용처에서 직접 관리
 */
export type SwipeOptions = {
  /** 좌→우 (이전 페이지 / 이전 슬라이드) */
  onSwipeRight?: () => void
  /** 우→좌 (다음 페이지 / 다음 슬라이드) */
  onSwipeLeft?: () => void
  /** 드래그 중 호출 — dx는 시작점 대비 가로 이동량(px). 가로 의도가 확정된 후에만 호출 */
  onDragMove?: (dx: number) => void
  /** 드래그 종료(스와이프 확정 또는 임계값 미달) — 사용처에서 위치 복귀/재설정 */
  onDragEnd?: (committed: boolean, direction: 'left' | 'right' | null) => void
  /** 가로 이동 최소 거리(px). 기본 50 */
  threshold?: number
  /** 가로/세로 의도 판별 거리(px). 이 거리만큼 움직였을 때 둘 중 큰 쪽으로 확정. 기본 8 */
  intentDistance?: number
  /** 스와이프 활성 여부를 동적으로 제어 (예: 줌 상태일 때 false) */
  enabled?: () => boolean
}

export function useSwipe(opts: SwipeOptions) {
  const threshold = opts.threshold ?? 50
  const intentDistance = opts.intentDistance ?? 8
  let startX = 0
  let startY = 0
  let tracking = false
  /** 'pending' = 가로/세로 미확정, 'horizontal' = 가로 드래그 확정, 'vertical' = 세로(스와이프 무시) */
  let intent: 'pending' | 'horizontal' | 'vertical' = 'pending'

  function isEnabled() {
    return opts.enabled ? opts.enabled() : true
  }

  function onTouchStart(e: TouchEvent) {
    if (!isEnabled()) return
    if (e.touches.length !== 1) {
      tracking = false
      return
    }
    tracking = true
    intent = 'pending'
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
  }

  function onTouchMove(e: TouchEvent) {
    if (!tracking) return
    if (e.touches.length !== 1) return
    const dx = e.touches[0].clientX - startX
    const dy = e.touches[0].clientY - startY

    if (intent === 'pending') {
      if (Math.abs(dx) < intentDistance && Math.abs(dy) < intentDistance) return
      intent = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical'
    }

    if (intent === 'horizontal') {
      // 가로 드래그가 확정된 시점부터는 브라우저 세로 스크롤이 따라오지 않도록 차단
      if (e.cancelable) e.preventDefault()
      opts.onDragMove?.(dx)
    }
  }

  function onTouchEnd(e: TouchEvent) {
    if (!tracking) return
    const wasHorizontal = intent === 'horizontal'
    tracking = false
    intent = 'pending'
    if (!isEnabled()) return
    const t = e.changedTouches[0]
    if (!t) {
      if (wasHorizontal) opts.onDragEnd?.(false, null)
      return
    }
    const dx = t.clientX - startX
    const dy = t.clientY - startY

    let committed = false
    let direction: 'left' | 'right' | null = null

    if (Math.abs(dx) >= threshold && Math.abs(dx) > Math.abs(dy)) {
      direction = dx < 0 ? 'left' : 'right'
      committed = true
      if (direction === 'left') opts.onSwipeLeft?.()
      else opts.onSwipeRight?.()
    }

    if (wasHorizontal) opts.onDragEnd?.(committed, direction)
  }

  function onTouchCancel() {
    const wasHorizontal = intent === 'horizontal'
    tracking = false
    intent = 'pending'
    if (wasHorizontal) opts.onDragEnd?.(false, null)
  }

  return { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel }
}

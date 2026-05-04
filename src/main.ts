import { createApp } from 'vue'
import App from './App.vue'
import './styles/global.scss'

// iOS Safari 는 viewport meta의 user-scalable=no 를 무시하므로 직접 차단
// (단, 라이트박스 등 [data-allow-zoom] 영역은 예외 처리)
function isInsideAllowedZoom(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false
  return !!target.closest('[data-allow-zoom]')
}

document.addEventListener(
  'gesturestart',
  (e) => {
    if (isInsideAllowedZoom(e.target)) return
    e.preventDefault()
  },
  { passive: false },
)

document.addEventListener(
  'touchmove',
  (e) => {
    if (e.touches.length > 1 && !isInsideAllowedZoom(e.target)) {
      e.preventDefault()
    }
  },
  { passive: false },
)

// iOS 의 더블탭 줌 차단
let lastTouchEnd = 0
document.addEventListener(
  'touchend',
  (e) => {
    const now = Date.now()
    if (now - lastTouchEnd <= 320 && !isInsideAllowedZoom(e.target)) {
      e.preventDefault()
    }
    lastTouchEnd = now
  },
  { passive: false },
)

createApp(App).mount('#app')

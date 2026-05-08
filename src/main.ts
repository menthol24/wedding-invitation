import { createApp } from 'vue'
import App from './App.vue'
import './styles/global.scss'

// 로딩화면에서 즉시 보이는 핵심 폰트 — 앱 마운트 전에 다운로드를 시작해 FOUT 깜빡임 방지
import bulgaryRoseUrl from '@/assets/fonts/BulgaryRose-L3ggG.ttf?url'
import pretendardLightUrl from '@/assets/fonts/Pretendard-Light.woff2?url'

function preloadFont(href: string, type: string) {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'font'
  link.type = type
  link.href = href
  link.crossOrigin = 'anonymous'
  document.head.appendChild(link)
}

preloadFont(bulgaryRoseUrl, 'font/ttf')
preloadFont(pretendardLightUrl, 'font/woff2')

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

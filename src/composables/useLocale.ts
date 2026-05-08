import { ref, watch } from 'vue'
import type { Locale } from '@/mocks'

const STORAGE_KEY = 'wedding-invitation:locale'
const SUPPORTED: Locale[] = ['ko', 'ja']

function readInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'ko'

  // 1) URL 쿼리 우선 (공유/북마크 보존)
  const param = new URLSearchParams(window.location.search).get('lang')
  if (param && (SUPPORTED as string[]).includes(param)) {
    return param as Locale
  }

  // 2) 직전 선택값 복원
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved && (SUPPORTED as string[]).includes(saved)) {
      return saved as Locale
    }
  } catch {
    // localStorage 차단 환경 — 무시
  }

  return 'ko'
}

const locale = ref<Locale>(readInitialLocale())

// <html lang> 초기 동기화 — :lang(ja) 셀렉터가 일본어 폰트로 분기시킴
if (typeof document !== 'undefined') {
  document.documentElement.lang = locale.value
}

watch(locale, (next) => {
  if (typeof window === 'undefined') return

  // <html lang> 동기화 → CSS :lang(ja) 룰이 일본어 폰트로 전환
  document.documentElement.lang = next

  // URL 쿼리 동기화 (history는 쌓지 않고 replace)
  const url = new URL(window.location.href)
  if (next === 'ko') {
    url.searchParams.delete('lang')
  } else {
    url.searchParams.set('lang', next)
  }
  window.history.replaceState({}, '', url.toString())

  try {
    window.localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // 무시
  }
})

export function useLocale() {
  function setLocale(next: Locale) {
    locale.value = next
  }

  function toggleLocale() {
    locale.value = locale.value === 'ko' ? 'ja' : 'ko'
  }

  return { locale, setLocale, toggleLocale }
}

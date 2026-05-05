/**
 * 카카오톡 메시지 공유 — Feed 템플릿
 *
 * 사용 흐름:
 *  1) index.html 에서 Kakao SDK 를 로드
 *  2) 앱 시작 시 ensureKakaoReady() 로 한 번 초기화
 *  3) shareWedding(payload) 호출 — 카카오톡 공유창이 뜸
 *
 * 주의: 카카오 메시지에 들어가는 imageUrl/링크는 "공개 접근 가능한 절대 URL" 이어야 함.
 *       로컬 자산(import 경로)은 직접 못 쓰므로, 배포된 사이트의 절대 URL 로 변환해서 넘겨야 함.
 */

interface KakaoSDK {
  isInitialized: () => boolean
  init: (jsKey: string) => void
  Share: {
    sendDefault: (payload: unknown) => void
  }
}

declare global {
  interface Window {
    Kakao?: KakaoSDK
  }
}

let initialized = false

/** Kakao SDK 가 로드되어 있는지 확인하고 1회 초기화 */
export function ensureKakaoReady(): boolean {
  if (typeof window === 'undefined') return false
  const Kakao = window.Kakao
  if (!Kakao) {
    console.warn('[kakao] SDK가 로드되지 않았습니다. index.html 의 SDK 스크립트를 확인하세요.')
    return false
  }
  if (initialized || Kakao.isInitialized()) {
    initialized = true
    return true
  }
  const jsKey = import.meta.env.VITE_KAKAO_JS_KEY as string | undefined
  if (!jsKey) {
    console.warn('[kakao] VITE_KAKAO_JS_KEY 가 설정되지 않았습니다.')
    return false
  }
  Kakao.init(jsKey)
  initialized = true
  return true
}

/** 사이트 절대 URL — .env 의 VITE_SITE_URL 이 비어 있으면 현재 origin 을 사용 */
export function getSiteUrl(): string {
  const fromEnv = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim()
  if (fromEnv) return fromEnv.replace(/\/+$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

/** 절대 URL 변환 — 이미 절대 URL 이면 그대로, 아니면 SITE_URL 기준으로 합침 */
export function toAbsoluteUrl(input: string): string {
  if (/^https?:\/\//i.test(input)) return input
  const base = getSiteUrl()
  if (!base) return input
  return `${base}${input.startsWith('/') ? '' : '/'}${input}`
}

export type WeddingSharePayload = {
  title: string
  description: string
  /** 절대 URL 권장. 상대경로면 SITE_URL 기준으로 보정됨 */
  imageUrl: string
  /** 클릭 시 이동할 청첩장 URL. 비우면 현재 페이지 URL */
  linkUrl?: string
  /** 메인 버튼 라벨 (기본: "청첩장 보기") */
  buttonLabel?: string
}

/**
 * Feed 템플릿으로 카카오톡 공유창 띄우기
 *
 * 카카오 측 도메인 화이트리스트(앱 > 플랫폼 > Web 사이트 도메인)에
 * 호출 페이지의 도메인이 등록돼 있어야 정상 동작함.
 */
export function shareWedding(payload: WeddingSharePayload): boolean {
  if (!ensureKakaoReady()) return false
  const Kakao = window.Kakao
  if (!Kakao) return false

  const linkUrl =
    payload.linkUrl ?? (typeof window !== 'undefined' ? window.location.href : getSiteUrl())
  const imageUrl = toAbsoluteUrl(payload.imageUrl)
  const buttonLabel = payload.buttonLabel ?? '청첩장 보기'

  Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: payload.title,
      description: payload.description,
      imageUrl,
      link: {
        mobileWebUrl: linkUrl,
        webUrl: linkUrl,
      },
    },
    buttons: [
      {
        title: buttonLabel,
        link: {
          mobileWebUrl: linkUrl,
          webUrl: linkUrl,
        },
      },
    ],
  })
  return true
}

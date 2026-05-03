const SCRIPT_MARKER = 'data-naver-maps-loaded'

/** 동일 페이지에서 스크립트 중복 로드 방지 */
let loadPromise: Promise<void> | null = null

export function loadNaverMapScript(ncpClientId: string): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve()

  if (window.naver?.maps) {
    return Promise.resolve()
  }

  if (document.querySelector(`script[${SCRIPT_MARKER}]`) && loadPromise) {
    return loadPromise
  }

  loadPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.setAttribute(SCRIPT_MARKER, 'true')
    script.async = true
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${encodeURIComponent(ncpClientId)}`
    script.onload = () => resolve()
    script.onerror = () => {
      loadPromise = null
      reject(new Error('네이버 지도 스크립트를 불러오지 못했습니다.'))
    }
    document.head.appendChild(script)
  })

  return loadPromise
}

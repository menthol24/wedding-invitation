<script setup lang="ts">
import { ref, shallowRef, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { loadNaverMapScript } from './loadNaverMapScript'

const props = withDefaults(
  defineProps<{
    ncpClientId: string
    lat: number
    lng: number
    zoom?: number
    mapLabel?: string
  }>(),
  {
    zoom: 17,
    mapLabel: '예식장 위치 지도',
  },
)

const shell = ref<HTMLDivElement | null>(null)
const loadError = ref<'none' | 'env' | 'fail'>('none')

let resizeTimer: ReturnType<typeof setTimeout> | null = null

const mapInst = shallowRef<unknown>(null)

function triggerResize() {
  clearTimeout(resizeTimer ?? undefined)
  resizeTimer = setTimeout(() => {
    resizeTimer = null
    try {
      const trig = window.naver?.maps?.Event?.trigger
      if (trig && mapInst.value) trig(mapInst.value, 'resize')
    } catch {
      //
    }
  }, 200)
}

async function rebuild() {
  const id = props.ncpClientId.trim()

  if (!id) {
    loadError.value = 'env'
    mapInst.value = null
    await nextTick()
    return
  }

  loadError.value = 'none'
  await nextTick()

  const el = shell.value
  if (!el) return

  try {
    await loadNaverMapScript(id)
    const nm = window.naver?.maps
    if (!nm?.LatLng || !nm.Map || !nm.Marker) {
      throw new Error('네이버 지도 초기화 실패')
    }

    el.innerHTML = ''

    const center = new nm.LatLng(props.lat, props.lng)
    const map = new nm.Map(el, {
      center,
      zoom: props.zoom ?? 17,
    })
    mapInst.value = map
    new nm.Marker({ map, position: center })
    triggerResize()
  } catch {
    loadError.value = 'fail'
    mapInst.value = null
    el.innerHTML = ''
  }
}

watch(
  () => [props.ncpClientId, props.lat, props.lng, props.zoom],
  () => {
    rebuild()
  },
)

onMounted(rebuild)

onUnmounted(() => {
  clearTimeout(resizeTimer ?? undefined)
  mapInst.value = null
})
</script>

<template>
  <div class="wrapper">
    <div
      v-if="loadError === 'none'"
      ref="shell"
      class="naver-shell"
      role="application"
      :aria-label="mapLabel"
    />

    <div v-else-if="loadError === 'env'" class="map-fallback">
      <p>네이버 지도 Client ID가 필요합니다.</p>
      <p class="sub">
        루트에 <code>.env</code> 파일을 만들고
        <code>VITE_NAVER_MAP_CLIENT_ID</code>= (네이버 클라우드 Application 키) 를 입력한 뒤
        <code>npm run dev</code> 를 다시 실행해 주세요.
      </p>
    </div>

    <div v-else-if="loadError === 'fail'" class="map-fallback">
      <p>지도를 불러오지 못했습니다.</p>
      <p class="sub">
        클라우드 콘솔에서 Maps API 사용 등록 및 웹 클라이언트 ID 허용 URL(
        예: http://localhost:5173 )을 확인해 주세요.
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.naver-shell {
  width: 100%;
  height: 100%;
  min-height: inherit;
}

.map-fallback {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: center;
  padding: 24px 20px;

  p {
    margin: 0 0 10px;
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--color-body-muted);
  }

  .sub {
    margin: 0;
    font-size: 0.72rem;
    line-height: 1.65;
    font-weight: 400;
    color: var(--color-body-muted);
    opacity: 0.92;
    max-width: 17rem;

    code {
      font-size: 0.67rem;
      padding: 2px 5px;
      border-radius: 4px;
      background: rgba(72, 58, 54, 0.06);
    }
  }
}
</style>

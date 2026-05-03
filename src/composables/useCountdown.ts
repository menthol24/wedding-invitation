import { onMounted, onUnmounted, reactive } from 'vue'

export interface TimeParts {
  days: number
  hours: number
  minutes: number
  seconds: number
  isPast: boolean
}

export function parseTarget(iso: string): number {
  return new Date(iso).getTime()
}

export function getTimeRemaining(targetMs: number, nowMs: number): TimeParts {
  const diff = targetMs - nowMs
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds, isPast: false }
}

/** 실시간 카운트다운 */
export function useCountdown(targetIso: string, tickMs = 1000) {
  const parts = reactive<TimeParts>(
    getTimeRemaining(parseTarget(targetIso), Date.now()),
  )
  let id: ReturnType<typeof setInterval>

  function tick() {
    const next = getTimeRemaining(parseTarget(targetIso), Date.now())
    parts.days = next.days
    parts.hours = next.hours
    parts.minutes = next.minutes
    parts.seconds = next.seconds
    parts.isPast = next.isPast
  }

  onMounted(() => {
    tick()
    id = setInterval(tick, tickMs)
  })

  onUnmounted(() => {
    clearInterval(id)
  })

  return { parts }
}

import { computed, readonly, ref, shallowRef } from 'vue'
import { createLocalGuestBookProvider } from '@/services/guestbook/localGuestBookProvider'
import type {
  GuestBookCreateInput,
  GuestBookEntry,
  GuestBookProvider,
} from '@/services/guestbook/types'

/** 기본 제공자 인스턴스 — 나중에 Supabase 구현체로 교체 가능 */
const defaultProvider = createLocalGuestBookProvider()

export function useGuestbook(provider: GuestBookProvider = defaultProvider) {
  const entries = ref<GuestBookEntry[]>([])
  const loading = ref(false)
  const error = shallowRef<string | null>(null)
  const allVisible = ref(false)

  async function refresh() {
    loading.value = true
    error.value = null
    try {
      entries.value = await provider.list()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '방명록을 불러오지 못했습니다.'
    } finally {
      loading.value = false
    }
  }

  async function submit(input: GuestBookCreateInput) {
    loading.value = true
    error.value = null
    try {
      const created = await provider.create(input)
      entries.value = [created, ...entries.value]
      return created
    } catch (e) {
      error.value = e instanceof Error ? e.message : '저장하지 못했습니다.'
      throw e
    } finally {
      loading.value = false
    }
  }

  const visibleEntries = computed(() =>
    allVisible.value ? entries.value : entries.value.slice(0, 3),
  )

  return {
    entries: readonly(entries),
    visibleEntries,
    loading: readonly(loading),
    error: readonly(error),
    allVisible,
    refresh,
    submit,
    toggleShowAll() {
      allVisible.value = !allVisible.value
    },
  }
}

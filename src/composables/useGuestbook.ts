import { computed, readonly, ref, shallowRef, watch } from 'vue'
/* import { createLocalGuestBookProvider } from '@/services/guestbook/localGuestBookProvider' */
import { createSupabaseGuestBookProvider } from '@/services/guestbook/supabaseGuestBookProvider.ts'
import type {
  GuestBookCreateInput,
  GuestBookEntry,
  GuestBookProvider,
} from '@/services/guestbook/types'

/** 기본 제공자 인스턴스 — 나중에 Supabase 구현체로 교체 가능 */
const defaultProvider = createSupabaseGuestBookProvider()

/** 페이지당 표시할 방명록 개수 */
const PAGE_SIZE = 5

export function useGuestbook(provider: GuestBookProvider = defaultProvider) {
  const entries = ref<GuestBookEntry[]>([])
  const loading = ref(false)
  const error = shallowRef<string | null>(null)
  const currentPage = ref(1)

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
      // 새 글이 추가되면 첫 페이지로 이동
      currentPage.value = 1
      return created
    } catch (e) {
      error.value = e instanceof Error ? e.message : '저장하지 못했습니다.'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function remove(id: string) {
    loading.value = true
    error.value = null
    try {
      await provider.remove(id)
      entries.value = entries.value.filter((e) => e.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '삭제하지 못했습니다.'
      throw e
    } finally {
      loading.value = false
    }
  }

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(entries.value.length / PAGE_SIZE)),
  )

  const visibleEntries = computed(() => {
    const start = (currentPage.value - 1) * PAGE_SIZE
    return entries.value.slice(start, start + PAGE_SIZE)
  })

  // 데이터가 줄어 현재 페이지가 범위를 벗어나면 보정
  watch(totalPages, (tp) => {
    if (currentPage.value > tp) currentPage.value = tp
  })

  function goToPage(page: number) {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
  }

  return {
    entries: readonly(entries),
    visibleEntries,
    loading: readonly(loading),
    error: readonly(error),
    currentPage: readonly(currentPage),
    totalPages,
    pageSize: PAGE_SIZE,
    refresh,
    submit,
    remove,
    goToPage,
    nextPage() {
      goToPage(currentPage.value + 1)
    },
    prevPage() {
      goToPage(currentPage.value - 1)
    },
  }
}

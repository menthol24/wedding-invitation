/**
 * Supabase 연동 시 이 파일을 복사해 구현하세요.
 *
 * 예시 패턴:
 * import type { GuestBookProvider, GuestBookEntry, GuestBookCreateInput } from './types'
 * export function createSupabaseGuestBookProvider(client: unknown): GuestBookProvider { ... }
 */

import type { GuestBookProvider } from './types'

export function createSupabaseGuestBookProviderStub(): GuestBookProvider {
  return {
    async list() {
      return []
    },
    async create() {
      throw new Error(
        '[guestbook] Supabase provider not implemented — wire createSupabaseGuestBookProviderStub first.',
      )
    },
  }
}

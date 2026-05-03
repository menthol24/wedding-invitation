import type { GuestBookCreateInput, GuestBookEntry, GuestBookProvider } from './types'

const STORAGE_KEY = 'wedding-guestbook-entries:v1'

function readStore(): GuestBookEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as GuestBookEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStore(entries: GuestBookEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

function uuid() {
  if (crypto.randomUUID) return crypto.randomUUID()
  return `gb-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

/**
 * 로컬 구현체 — Supabase 전환 시 `supabaseGuestBookProvider.ts`를 만들고 교체하면 됩니다.
 * 비밀번호는 검증 용도로만 들어가며, 현재 로컬 스키마에는 저장하지 않습니다.
 */
export function createLocalGuestBookProvider(): GuestBookProvider {
  return {
    async list() {
      return readStore().sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    },

    async create(input: GuestBookCreateInput): Promise<GuestBookEntry> {
      const entry: GuestBookEntry = {
        id: uuid(),
        name: input.name.trim(),
        content: input.content.trim(),
        createdAt: new Date().toISOString(),
      }
      const next = [entry, ...readStore()]
      writeStore(next)
      void input.password // Supabase 연동 시 해시 저장 등으로 사용
      return entry
    },
  }
}

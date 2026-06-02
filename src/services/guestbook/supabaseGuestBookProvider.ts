/**
 * Supabase 연동 시 이 파일을 복사해 구현하세요.
 *
 */

import { supabase } from "@/services/supabaseClient.ts"
import type { GuestBookEntry, GuestBookCreateInput, GuestBookProvider } from './types'

export function createSupabaseGuestBookProvider(): GuestBookProvider {
  return {
    async list() {
      const { data, error } = await supabase
          .from('guestbook')
          .select('id, name, message, created_at, likes')
          .eq('is_visible', true)
          .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`[guestbook] Supabase select list error: ${error.message}`)
      }
      // likes 컬럼이 null 이면 0 으로 보정
      return (data ?? []).map((row) => ({ ...row, likes: row.likes ?? 0 }))
    },

    async create(input: GuestBookCreateInput): Promise<GuestBookEntry> {
      const name = input.name.trim()
      const message = input.message.trim()
      const { data, error } = await supabase
          .from('guestbook')
          .insert({ name, message, is_visible: true })
          .select('id, name, message, created_at, likes')
          .single()

      if(error) {
        throw new Error(`[guestbook] Supabase insert error: ${error.message}`)
      }
      // 새 글의 좋아요 수는 0 으로 시작
      return { ...data, likes: data?.likes ?? 0 }

    },

      async remove(id: string): Promise<void> {
          const { error } = await supabase.rpc('soft_delete_guestbook', {
              target_id: id,
          })

          if (error) {
              throw new Error(`[guestbook] Supabase soft-delete error: ${error.message}`)
          }
      },

      async like(id: string): Promise<number> {
          // 원자적 +1 증가를 위해 RPC 사용 — 동시 클릭 시 경쟁 상태 방지
          const { data, error } = await supabase.rpc('like_guestbook', {
              p_target_id: id,
          })

          if (error) {
              throw new Error(`[guestbook] Supabase like error: ${error.message}`)
          }
          // RPC 가 갱신된 likes 값을 반환
          return typeof data === 'number' ? data : 0
      }
  }
}

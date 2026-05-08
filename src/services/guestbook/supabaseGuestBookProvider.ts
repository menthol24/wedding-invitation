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
          .select('id, name, message, created_at')
          .eq('is_visible', true)
          .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`[guestbook] Supabase select list error: ${error.message}`)
      }
      return data ?? []
    },

    async create(input: GuestBookCreateInput): Promise<GuestBookEntry> {
      const name = input.name.trim()
      const message = input.message.trim()
      const { data, error } = await supabase
          .from('guestbook')
          .insert({ name, message, is_visible: true })
          .select('id, name, message, created_at')
          .single()

      if(error) {
        throw new Error(`[guestbook] Supabase insert error: ${error.message}`)
      }
      return data ?? []

    },

    async remove(id: string): Promise<void> {
      const { error } = await supabase
          .from('guestbook')
          .update({ is_visible: false })
          .eq('id', id)

      if (error) {
        throw new Error(`[guestbook] Supabase soft-delete error: ${error.message}`)
      }
    },
  }
}

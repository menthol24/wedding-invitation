export interface GuestBookEntry {
  id: string
  name: string
  message: string
  created_at: string
  /** 좋아요(하트) 수 */
  likes: number
}

export interface GuestBookCreateInput {
  name: string
  message: string
}

export interface GuestBookProvider {
  list(): Promise<GuestBookEntry[]>
  create(entry: GuestBookCreateInput): Promise<GuestBookEntry>
  /** soft delete — is_visible 을 false 로 업데이트 */
  remove(id: string): Promise<void>
  /** 좋아요 +1 — 갱신된 좋아요 수를 반환 */
  like(id: string): Promise<number>
}

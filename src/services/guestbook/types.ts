export interface GuestBookEntry {
  id: string
  name: string
  message: string
  created_at: string
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
}

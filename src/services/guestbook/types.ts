export interface GuestBookEntry {
  id: string
  name: string
  message: string
  created_at: string
}

export interface GuestBookCreateInput {
  name: string
  password: string
  message: string
}

export interface GuestBookProvider {
  list(): Promise<GuestBookEntry[]>
  create(entry: GuestBookCreateInput): Promise<GuestBookEntry>
}

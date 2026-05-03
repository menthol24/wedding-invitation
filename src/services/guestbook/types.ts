export interface GuestBookEntry {
  id: string
  name: string
  content: string
  createdAt: string
}

export interface GuestBookCreateInput {
  name: string
  password: string
  content: string
}

export interface GuestBookProvider {
  list(): Promise<GuestBookEntry[]>
  create(entry: GuestBookCreateInput): Promise<GuestBookEntry>
}

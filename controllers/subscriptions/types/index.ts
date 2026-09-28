interface Subscription {
  id: number
  user_id: number
  plan: string
  pending_plan: string | null
  status: string
  started_at: string
  expires_at: string | null
  created_at: string
  updated_at: string
}

export type {
  Subscription
}

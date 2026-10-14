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

interface Payment {
  id: number
  user_id: number
  plan: string
  billing_cycle: string
  amount: string
  currency: string
  status: string
  paid_at: string | null
  created_at: string
}

export type {
  Subscription,
  Payment
}

interface BillingAddress {
  id: number
  user_id: number
  name: string | null
  phone: string | null
  line1: string | null
  line2: string | null
  city: string | null
  state: string | null
  postal_code: string | null
  country: string | null
  is_default: boolean
  created_at: string
  updated_at: string
}

interface BillingAddressForm {
  name: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default?: boolean
}

export type {
  BillingAddress,
  BillingAddressForm
}

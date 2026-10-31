interface BirValidationObj {
  job_id: string
  user_id: number
  filename: string
  status: string
  errors: unknown
  created_at: string | null
}

interface BirValidationTableRow {
  job_id: string
  user_id: number
  filename: string
  status: string
  errors: unknown
  created_at: string
}

interface BirValidationsData {
  birValidations: BirValidationObj[]
  total: number
  totalPages: number
}

export type {
  BirValidationObj,
  BirValidationTableRow,
  BirValidationsData
}

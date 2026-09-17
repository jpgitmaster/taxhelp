interface AuditLogObj {
  id: number
  user_id: number | null
  action: string
  resource_type: string | null
  resource_id: number | null
  description: string
  created_at: string | null
}

interface AuditLogTableRow {
  id: number
  no: number
  action: string
  resource_type: string
  description: string
  created_at: string
}

interface AuditLogsData {
  auditLogs: AuditLogObj[]
  total: number
  totalPages: number
}

export type {
  AuditLogObj,
  AuditLogTableRow,
  AuditLogsData
}
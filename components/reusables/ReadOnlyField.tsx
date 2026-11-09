import { ReactNode } from 'react'
import scss from './styles/ReadOnlyField.module.scss'

interface PropsDefinition {
  label: string
  value?: ReactNode
  span?: 2 | 3 | 4 | 5 | 6 | 8 | 12
}

const ReadOnlyField = ({ label, value, span = 4 }: PropsDefinition) => (
  <div className={scss.field} style={{ gridColumn: `span ${span}` }}>
    <span className={scss.label}>{label}</span>
    <span className={scss.value}>{value || value === 0 ? value : '—'}</span>
  </div>
)

export default ReadOnlyField

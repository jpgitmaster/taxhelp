import { ReactNode } from 'react'
import scss from './styles/ReadOnlyField.module.scss'

interface PropsDefinition {
  label: string
  value?: ReactNode
  /** Grid span out of 12 columns, matching the wizard's own .col2/.col3/etc
   * convention. Defaults to 4 (3 fields per row). */
  span?: 2 | 3 | 4 | 5 | 6 | 8 | 12
}

/** A single label + underline value pair for read-only record displays —
 * deliberately NOT styled like an input (no box/border-all-around/grey
 * fill), since a boxed-but-disabled field reads as "this should be
 * editable but isn't" rather than "this is just a fact being shown". */
const ReadOnlyField = ({ label, value, span = 4 }: PropsDefinition) => (
  <div className={scss.field} style={{ gridColumn: `span ${span}` }}>
    <span className={scss.label}>{label}</span>
    <span className={scss.value}>{value || value === 0 ? value : '—'}</span>
  </div>
)

export default ReadOnlyField

import { ReactNode } from 'react'
import scss from './styles/SectionHeader.module.scss'

interface PropsDefinition {
  title: string
  action?: ReactNode
}

/** Small uppercase section header, shared across any page that groups a form
 * into labeled sections (e.g. the Sales wizard's Client/Customer/Sales
 * Details/Particulars/Tax Details). Pass `action` for a right-aligned
 * link/button, e.g. an "Edit Details" toggle or an "+ Add Line" button. */
const SectionHeader = ({ title, action }: PropsDefinition) => (
  <div className={scss.sectionHeader}>
    {title}
    {action}
  </div>
)

export default SectionHeader

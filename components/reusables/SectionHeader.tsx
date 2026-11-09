import { ReactNode } from 'react'
import scss from './styles/SectionHeader.module.scss'

interface PropsDefinition {
  title: string
  action?: ReactNode
}

const SectionHeader = ({ title, action }: PropsDefinition) => (
  <div className={scss.sectionHeader}>
    {title}
    {action}
  </div>
)

export default SectionHeader

import { ReactNode } from 'react'
import scss from './styles/FilterBar.module.scss'

interface PropsDefinition {
  children: ReactNode
}

const FilterBar = ({ children }: PropsDefinition) => (
  <div className={scss.filterBar}>
    <div className={scss.grid}>{children}</div>
  </div>
)

export default FilterBar

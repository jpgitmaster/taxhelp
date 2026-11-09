import { ReactNode } from 'react'
import scss from './styles/FilterBar.module.scss'

interface PropsDefinition {
  children: ReactNode
}

/** Light-gray rounded filter box — the same convention already used on the
 * Sales list (Filter by Document/Client/date ranges). Reusable wrapper so
 * any list page can drop its filter fields (e.g. CustomContainer) in without
 * re-styling the box each time. */
const FilterBar = ({ children }: PropsDefinition) => (
  <div className={scss.filterBar}>
    <div className={scss.grid}>{children}</div>
  </div>
)

export default FilterBar

import { ReactNode, useState } from 'react'
import { Dropdown } from 'antd'
import scss from './styles/FilterPopoverButton.module.scss'

interface PropsDefinition {
  children: ReactNode
  onSearch: () => void
  onClear?: () => void
  active?: boolean
}

const FilterPopoverButton = ({ children, onSearch, onClear, active }: PropsDefinition) => {
  const [open, setOpen] = useState(false)

  return (
    <Dropdown
      trigger={['click']}
      open={open}
      onOpenChange={setOpen}
      popupRender={() => (
        <div className={scss.panel} onClick={e => e.stopPropagation()}>
          {children}
          <div className={scss.actions}>
            {onClear && (
              <button type="button" className={scss.clearBtn} onClick={() => { onClear(); }}>
                Clear filters
              </button>
            )}
            <button
              type="button"
              className={scss.searchBtn}
              onClick={() => { onSearch(); setOpen(false) }}
            >
              Search
            </button>
          </div>
        </div>
      )}
    >
      <button type="button" className={scss.trigger + (active ? ' ' + scss.active : '')} aria-label="Filters">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="6" cy="4" r="1.6" fill="currentColor" />
          <circle cx="11" cy="8" r="1.6" fill="currentColor" />
          <circle cx="5" cy="12" r="1.6" fill="currentColor" />
        </svg>
        Filters
      </button>
    </Dropdown>
  )
}

export default FilterPopoverButton

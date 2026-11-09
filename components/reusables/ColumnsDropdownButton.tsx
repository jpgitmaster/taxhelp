import { useMemo, useState } from 'react'
import { Dropdown, Input } from 'antd'
import scss from './styles/ColumnFilterTable.module.scss'

export interface ColumnsDropdownOption {
  key: string
  title: string
}

interface PropsDefinition {
  options: ColumnsDropdownOption[]
  selectedKeys: string[]
  onToggle: (key: string) => void
}

/** The "Columns" trigger + searchable checkbox panel used by
 * ColumnFilterTable, split out as its own component so it can be rendered
 * inline in a toolbar (next to Add Record/Search) instead of always
 * sitting in its own row above the table. */
const ColumnsDropdownButton = ({ options, selectedKeys, onToggle }: PropsDefinition) => {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const alphabetical = useMemo(
    () => [...options].sort((a, b) => a.title.localeCompare(b.title)),
    [options]
  )
  const filtered = useMemo(
    () => alphabetical.filter(c => c.title.toLowerCase().includes(search.trim().toLowerCase())),
    [alphabetical, search]
  )

  if (!options.length) return null

  return (
    <Dropdown
      trigger={['click']}
      open={open}
      onOpenChange={setOpen}
      popupRender={() => (
        <div className={scss.panel} onClick={e => e.stopPropagation()}>
          <Input
            autoFocus
            allowClear
            placeholder="Search columns..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={scss.columnSearch}
          />
          <ul className={scss.list}>
            {filtered.length ? filtered.map(c => (
              <li key={c.key}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedKeys.includes(c.key)}
                    onChange={() => onToggle(c.key)}
                  />
                  {c.title}
                </label>
              </li>
            )) : (
              <li className={scss.empty}>No matching columns</li>
            )}
          </ul>
        </div>
      )}
    >
      <button type="button" className={scss.columnsBtn}>
        Columns {selectedKeys.length > 0 && `(${selectedKeys.length})`}
      </button>
    </Dropdown>
  )
}

export default ColumnsDropdownButton

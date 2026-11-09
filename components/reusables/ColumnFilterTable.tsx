import { ReactNode, useMemo, useState } from 'react'
import { Table, Pagination, Dropdown, Input } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import scss from './styles/ColumnFilterTable.module.scss'

export interface ColumnFilterTableColumn<T> {
  key: string
  title: string
  dataIndex?: string
  render?: (value: any, record: T, index: number) => ReactNode
  width?: number
  align?: 'left' | 'center' | 'right'
  /** Pins the column so it never scrolls out of view. */
  frozen?: 'left' | 'right'
  /** Hidden by default — only rendered once the user checks it in the
   * Columns dropdown. Columns are appended to the table in click order,
   * not the dropdown's (alphabetical) list order. */
  optional?: boolean
}

interface PropsDefinition<T> {
  rowKey: string
  columns: ColumnFilterTableColumn<T>[]
  dataSource: T[]
  loading?: boolean
  /** Fixed pixel width for the table's outer container (e.g. viewport minus
   * sidebar). Without this the container has no definite width to scroll
   * within, so adding optional columns grows the whole page instead of
   * scrolling inside a fixed-width table — same fix the Sales list already
   * uses (tableWidth = window.innerWidth - 240). */
  width?: number
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number) => void
  }
}

/** Reusable data table with a built-in column-visibility filter: a small,
 * always-visible set of columns (optionally with some pinned via `frozen`)
 * plus a "Columns" dropdown (searchable, alphabetical) for everything else.
 * Checking an optional column appends it to the table in click order;
 * unchecking removes it. Built for the Manual Sales list but intentionally
 * generic — pass any `columns`/`dataSource` to reuse it elsewhere. */
function ColumnFilterTable<T extends Record<string, any>>({
  rowKey,
  columns,
  dataSource,
  loading,
  width,
  pagination,
}: PropsDefinition<T>) {
  const [selectedOptionalKeys, setSelectedOptionalKeys] = useState<string[]>([])
  const [columnSearch, setColumnSearch] = useState('')
  const [open, setOpen] = useState(false)

  const optionalColumns = useMemo(
    () => columns.filter(c => c.optional),
    [columns]
  )
  const optionalColumnsAlphabetical = useMemo(
    () => [...optionalColumns].sort((a, b) => a.title.localeCompare(b.title)),
    [optionalColumns]
  )
  const filteredOptionalColumns = useMemo(
    () => optionalColumnsAlphabetical.filter(c =>
      c.title.toLowerCase().includes(columnSearch.trim().toLowerCase())
    ),
    [optionalColumnsAlphabetical, columnSearch]
  )

  const toggleColumn = (key: string) => {
    setSelectedOptionalKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const visibleColumns = useMemo(() => {
    const leftFrozen = columns.filter(c => !c.optional && c.frozen === 'left')
    const defaultScrollable = columns.filter(c => !c.optional && !c.frozen)
    const selectedOptional = selectedOptionalKeys
      .map(key => optionalColumns.find(c => c.key === key))
      .filter((c): c is ColumnFilterTableColumn<T> => !!c)
    const rightFrozen = columns.filter(c => !c.optional && c.frozen === 'right')

    const ordered = [...leftFrozen, ...defaultScrollable, ...selectedOptional, ...rightFrozen]

    const antdColumns: ColumnsType<T> = ordered.map(c => ({
      key: c.key,
      title: c.title,
      dataIndex: c.dataIndex,
      render: c.render,
      width: c.width,
      align: c.align,
      fixed: c.frozen,
    }))
    return antdColumns
  }, [columns, selectedOptionalKeys, optionalColumns])

  const rangeStart = pagination ? (pagination.total === 0 ? 0 : (pagination.current - 1) * pagination.pageSize + 1) : 0
  const rangeEnd = pagination ? Math.min(pagination.current * pagination.pageSize, pagination.total) : 0

  return (
    <div className={scss.wrapper} style={width ? { width: `${width}px` } : undefined}>
      {!!optionalColumns.length && (
        <div className={scss.columnsRow}>
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
                  value={columnSearch}
                  onChange={e => setColumnSearch(e.target.value)}
                  className={scss.columnSearch}
                />
                <ul className={scss.list}>
                  {filteredOptionalColumns.length ? filteredOptionalColumns.map(c => (
                    <li key={c.key}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptionalKeys.includes(c.key)}
                          onChange={() => toggleColumn(c.key)}
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
              Columns {selectedOptionalKeys.length > 0 && `(${selectedOptionalKeys.length})`}
            </button>
          </Dropdown>
        </div>
      )}

      <div className={scss.tableWrap}>
        <Table
          rowKey={rowKey}
          columns={visibleColumns}
          dataSource={dataSource}
          loading={loading}
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </div>

      {pagination && (
        <div className={scss.paginationRow}>
          <span className={scss.rangeLabel}>
            {pagination.total
              ? `Showing ${rangeStart}–${rangeEnd} of ${pagination.total}`
              : 'No records'}
          </span>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={pagination.onChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  )
}

export default ColumnFilterTable

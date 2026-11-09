import { ReactNode, useMemo } from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { SorterResult } from 'antd/es/table/interface'
import DataPagination from './DataPagination'
import scss from './styles/ColumnFilterTable.module.scss'

export interface ColumnFilterTableColumn<T> {
  key: string
  title: string
  dataIndex?: string
  render?: (value: any, record: T, index: number) => ReactNode
  width?: number
  /** Marks this column as sharing leftover space instead of holding a
   * fixed width. Needs `minWidth` (not `width`): under table-layout:fixed,
   * columns with no declared width split whatever's left of the table's
   * total scroll width evenly between them, so default columns stretch to
   * fill the container the way they used to before every column got an
   * exact px width (which fixed a sticky-column overlap bug, but also
   * meant leftover space just sat empty on the right instead of being
   * distributed). Once optional columns push the total past the
   * container's width, each flexible column falls back to its own
   * `minWidth` floor and the table scrolls instead of cramming together. */
  flexible?: boolean
  minWidth?: number
  align?: 'left' | 'center' | 'right'
  /** Pins the column so it never scrolls out of view. */
  frozen?: 'left' | 'right'
  /** Hidden by default — only rendered once the user checks it in the
   * Columns dropdown. Columns are appended to the table in click order,
   * not the dropdown's (alphabetical) list order. */
  optional?: boolean
  /** Enables the column's sort arrows. `true` sorts server-side via
   * `onSortChange` (the whole dataset, same as pagination) — pass a compare
   * function instead only if this column should sort just the current page
   * client-side. */
  sorter?: boolean | ((a: T, b: T) => number)
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
  /** Current server-side sort state, for columns using `sorter: true`
   * (highlights the active arrow). Omit for purely client-side sorting. */
  sortBy?: string | null
  sortOrder?: 'asc' | 'desc'
  /** Fired when the user clicks a `sorter: true` column's arrows. Pass
   * `field: null` when sort is cleared (antd's third click). */
  onSortChange?: (field: string | null, order: 'asc' | 'desc') => void
  /** Controls which optional columns are shown, in click order — own and
   * update this state wherever you render ColumnsDropdownButton (e.g.
   * inline in a toolbar, rather than this component's own internal row). */
  selectedOptionalKeys?: string[]
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number) => void
    onPageSizeChange?: (pageSize: number) => void
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
  sortBy,
  sortOrder,
  onSortChange,
  selectedOptionalKeys = [],
  pagination,
}: PropsDefinition<T>) {
  const optionalColumns = useMemo(
    () => columns.filter(c => c.optional),
    [columns]
  )

  const orderedColumns = useMemo(() => {
    const leftFrozen = columns.filter(c => !c.optional && c.frozen === 'left')
    const defaultScrollable = columns.filter(c => !c.optional && !c.frozen)
    const selectedOptional = selectedOptionalKeys
      .map(key => optionalColumns.find(c => c.key === key))
      .filter((c): c is ColumnFilterTableColumn<T> => !!c)
    const rightFrozen = columns.filter(c => !c.optional && c.frozen === 'right')
    return [...leftFrozen, ...defaultScrollable, ...selectedOptional, ...rightFrozen]
  }, [columns, selectedOptionalKeys, optionalColumns])

  // table-layout:fixed splits leftover space EQUALLY between every
  // unset-width column — it has no concept of one flexible column (e.g.
  // Customer, minWidth 260) deserving more of that space than another
  // (e.g. Status, minWidth 110). So instead of leaving flexible columns
  // width-less and letting the browser split evenly, compute each one's
  // actual pixel width here, proportional to its own minWidth, and pass
  // that as an explicit `width` like every other column — the browser
  // never gets a chance to apply its equal-split behavior.
  const flexibleWidths = useMemo(() => {
    const flexibleCols = orderedColumns.filter(c => c.flexible)
    const fixedSum = orderedColumns.reduce((sum, c) => c.flexible ? sum : sum + (typeof c.width === 'number' ? c.width : 120), 0)
    const flexibleMinSum = flexibleCols.reduce((sum, c) => sum + (c.minWidth ?? 120), 0)
    const extra = Math.max(0, (width ?? 0) - fixedSum - flexibleMinSum)

    const map = new Map<string, number>()
    flexibleCols.forEach(c => {
      const min = c.minWidth ?? 120
      const share = flexibleMinSum > 0 ? (min / flexibleMinSum) * extra : 0
      map.set(c.key, Math.round(min + share))
    })
    return map
  }, [orderedColumns, width])

  const visibleColumns = useMemo(() => {
    const antdColumns: ColumnsType<T> = orderedColumns.map(c => ({
      key: c.key,
      title: c.title,
      dataIndex: c.dataIndex,
      render: c.render,
      width: c.flexible ? (flexibleWidths.get(c.key) ?? c.minWidth) : c.width,
      align: c.align,
      fixed: c.frozen,
      // `sorter: true` with no compare function tells antd this column is
      // server-sorted — it just renders the arrows and reports clicks via
      // the Table's onChange, same as pagination already goes through the
      // API rather than slicing the current page client-side.
      sorter: c.sorter,
      sortOrder: onSortChange && c.sorter === true && sortBy === c.key
        ? (sortOrder === 'desc' ? 'descend' : 'ascend')
        : undefined,
    }))
    return antdColumns
  }, [orderedColumns, flexibleWidths, onSortChange, sortBy, sortOrder])

  // Frozen columns + explicit per-column widths need scroll.x as a literal
  // pixel total, not 'max-content' — combining 'max-content' (or
  // tableLayout="fixed") with sticky columns desyncs antd's fixed-column
  // shadow clone from the real column width, causing it to overlap/ghost
  // into the next column while scrolling.
  const totalColumnsWidth = useMemo(() => {
    const sum = visibleColumns.reduce((total, c) => total + (typeof c.width === 'number' ? c.width : 120), 0)
    return width ? Math.max(sum, width) : sum
  }, [orderedColumns, width])

  return (
    <div className={scss.wrapper} style={width ? { width: `${width}px`, maxWidth: `${width}px` } : undefined}>
      <div className={scss.tableWrap}>
        <Table
          rowKey={rowKey}
          columns={visibleColumns}
          dataSource={dataSource}
          loading={loading}
          pagination={false}
          scroll={{ x: totalColumnsWidth }}
          tableLayout="fixed"
          onChange={(_pagination, _filters, sorter) => {
            if (!onSortChange) return
            const s = (Array.isArray(sorter) ? sorter[0] : sorter) as SorterResult<T> | undefined
            if (!s?.order) {
              onSortChange(null, 'asc')
              return
            }
            onSortChange(String(s.columnKey ?? s.field), s.order === 'descend' ? 'desc' : 'asc')
          }}
        />
      </div>

      {pagination && (
        <DataPagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={pagination.onChange}
          onPageSizeChange={pagination.onPageSizeChange}
        />
      )}
    </div>
  )
}

export default ColumnFilterTable

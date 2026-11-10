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
  flexible?: boolean
  minWidth?: number
  align?: 'left' | 'center' | 'right'
  frozen?: 'left' | 'right'
  optional?: boolean
  sorter?: boolean | ((a: T, b: T) => number)
}

interface PropsDefinition<T> {
  rowKey: string
  columns: ColumnFilterTableColumn<T>[]
  dataSource: T[]
  loading?: boolean
  width?: number
  sortBy?: string | null
  sortOrder?: 'asc' | 'desc'
  onSortChange?: (field: string | null, order: 'asc' | 'desc') => void
  selectedOptionalKeys?: string[]
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number) => void
    onPageSizeChange?: (pageSize: number) => void
  }
}

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
      sorter: c.sorter,
      sortOrder: onSortChange && c.sorter === true && sortBy === c.key
        ? (sortOrder === 'desc' ? 'descend' : 'ascend')
        : undefined,
    }))
    return antdColumns
  }, [orderedColumns, flexibleWidths, onSortChange, sortBy, sortOrder])

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

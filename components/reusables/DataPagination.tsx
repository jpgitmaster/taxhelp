import { useMemo } from 'react'
import scss from './styles/DataPagination.module.scss'

interface PropsDefinition {
  current: number
  pageSize: number
  total: number
  onChange: (page: number) => void
  pageSizeOptions?: number[]
  onPageSizeChange?: (pageSize: number) => void
}

/** "Showing page X of Y" + first/prev/numbered/next/last + rows-per-page —
 * a fuller pagination control than antd's default Pagination gives us, so
 * built as its own reusable component rather than fighting antd's API. */
const DataPagination = ({
  current,
  pageSize,
  total,
  onChange,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
}: PropsDefinition) => {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = []
    const windowSize = 1

    for (let p = 1; p <= pageCount; p++) {
      const isEdge = p === 1 || p === pageCount
      const isNearCurrent = Math.abs(p - current) <= windowSize
      if (isEdge || isNearCurrent) {
        pages.push(p)
      } else if (pages[pages.length - 1] !== 'ellipsis') {
        pages.push('ellipsis')
      }
    }
    return pages
  }, [current, pageCount])

  const goTo = (page: number) => {
    if (page < 1 || page > pageCount || page === current) return
    onChange(page)
  }

  return (
    <div className={scss.pagination}>
      <div className={scss.pageJump}>
        <span>Showing page</span>
        <span className={scss.pageBox}>{current}</span>
        <span>of {pageCount}</span>
      </div>

      <div className={scss.controls}>
        <button type="button" className={scss.btn} disabled={current === 1} onClick={() => goTo(1)} aria-label="First page">
          «
        </button>
        <button type="button" className={scss.btn} disabled={current === 1} onClick={() => goTo(current - 1)} aria-label="Previous page">
          ‹
        </button>

        {pageNumbers.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className={scss.ellipsis}>…</span>
          ) : (
            <button
              key={p}
              type="button"
              className={scss.btn + (p === current ? ' ' + scss.active : '')}
              onClick={() => goTo(p)}
            >
              {p}
            </button>
          )
        )}

        <button type="button" className={scss.btn} disabled={current === pageCount} onClick={() => goTo(current + 1)} aria-label="Next page">
          ›
        </button>
        <button type="button" className={scss.btn} disabled={current === pageCount} onClick={() => goTo(pageCount)} aria-label="Last page">
          »
        </button>
      </div>

      {onPageSizeChange && (
        <div className={scss.pageSize}>
          <span>Rows per page</span>
          <select value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))}>
            {pageSizeOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

export default DataPagination

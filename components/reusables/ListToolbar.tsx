import { ChangeEvent, FormEvent, KeyboardEvent, ReactNode } from 'react'
import scss from './styles/ListToolbar.module.scss'

interface PropsDefinition {
  /** Primary action, e.g. an "+ Add Record" Link/button. */
  action?: ReactNode
  search?: {
    value: string
    placeholder?: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    onKeyUp?: (e: KeyboardEvent<HTMLInputElement>) => void
    onSubmit: (e: FormEvent<HTMLFormElement>) => void
  }
  /** Rendered after the search form, on the same row — e.g. a
   * ColumnsDropdownButton, so it never wraps onto its own line separately
   * from Add Record/Search. */
  extra?: ReactNode
}

/** List-page toolbar row — primary action on the left, search (and any
 * `extra` control) on the right — matching the Sales list's own
 * .header/.searchComponent convention, but as its own reusable component
 * instead of depending on that page's stylesheet. */
const ListToolbar = ({ action, search, extra }: PropsDefinition) => (
  <div className={scss.toolbar}>
    {action && <div className={scss.action}>{action}</div>}
    <div className={scss.right}>
      {search && (
        <form className={scss.searchForm} onSubmit={search.onSubmit}>
          <input
            type="text"
            placeholder={search.placeholder || 'Search...'}
            value={search.value}
            onChange={search.onChange}
            onKeyUp={search.onKeyUp}
          />
          <button type="submit">Search</button>
        </form>
      )}
      {extra}
    </div>
  </div>
)

export default ListToolbar

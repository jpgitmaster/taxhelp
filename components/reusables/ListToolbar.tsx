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
}

/** List-page toolbar row — primary action on the left, search on the right —
 * matching the Sales list's own .header/.searchComponent convention, but as
 * its own reusable component instead of depending on that page's stylesheet. */
const ListToolbar = ({ action, search }: PropsDefinition) => (
  <div className={scss.toolbar}>
    {action && <div className={scss.action}>{action}</div>}
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
  </div>
)

export default ListToolbar

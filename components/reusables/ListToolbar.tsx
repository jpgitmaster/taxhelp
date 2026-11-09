import { ChangeEvent, FormEvent, KeyboardEvent, ReactNode } from 'react'
import scss from './styles/ListToolbar.module.scss'

interface PropsDefinition {
  action?: ReactNode
  search?: {
    value: string
    placeholder?: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    onKeyUp?: (e: KeyboardEvent<HTMLInputElement>) => void
    onSubmit: (e: FormEvent<HTMLFormElement>) => void
  }
  extra?: ReactNode
}

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

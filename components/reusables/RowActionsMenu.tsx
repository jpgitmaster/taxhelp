import Link from 'next/link'
import { useState } from 'react'
import { Dropdown, Popconfirm } from 'antd'
import scss from './styles/RowActionsMenu.module.scss'

export interface RowAction {
  label: string
  href?: string
  onClick?: () => void
  confirm?: { title: string, description: string }
  danger?: boolean
}

interface PropsDefinition {
  actions: RowAction[]
}

/** Per-row kebab (⋯) menu — collapses a table row's action buttons behind
 * one trigger instead of spelling every action out inline, which gets
 * cluttered once a row has more than one or two actions. Reusable by any
 * table that needs row-level actions (Resume/Delete here, but generic). */
const RowActionsMenu = ({ actions }: PropsDefinition) => {
  const [open, setOpen] = useState(false)

  const renderAction = (action: RowAction) => {
    const content = action.href ? (
      <Link href={action.href} className={scss.item + (action.danger ? ' ' + scss.danger : '')}>
        {action.label}
      </Link>
    ) : (
      <button
        type="button"
        className={scss.item + (action.danger ? ' ' + scss.danger : '')}
        onClick={() => { action.onClick?.(); setOpen(false) }}
      >
        {action.label}
      </button>
    )

    if (!action.confirm) return content

    return (
      <Popconfirm
        key={action.label}
        title={action.confirm.title}
        description={action.confirm.description}
        onConfirm={() => { action.onClick?.(); setOpen(false) }}
        okText="Yes"
        cancelText="No"
      >
        <button type="button" className={scss.item + (action.danger ? ' ' + scss.danger : '')}>
          {action.label}
        </button>
      </Popconfirm>
    )
  }

  return (
    <Dropdown
      trigger={['click']}
      open={open}
      onOpenChange={setOpen}
      popupRender={() => (
        <div className={scss.panel} onClick={e => e.stopPropagation()}>
          {actions.map(action => (
            <div key={action.label}>{renderAction(action)}</div>
          ))}
        </div>
      )}
    >
      <button type="button" className={scss.trigger} aria-label="Row actions">
        &#8942;
      </button>
    </Dropdown>
  )
}

export default RowActionsMenu

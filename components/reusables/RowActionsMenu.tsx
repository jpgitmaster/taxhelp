import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Dropdown, Popconfirm } from 'antd'
import scss from './styles/RowActionsMenu.module.scss'

export interface RowAction {
  label: string
  href?: string
  onClick?: () => void
  confirm?: { title: string, description: string }
  danger?: boolean
  /** Path under /public, e.g. "/svgs/edit.svg" */
  icon?: string
}

interface PropsDefinition {
  actions: RowAction[]
}

/** Per-row kebab (⋮) menu — collapses a table row's action buttons behind
 * one trigger instead of spelling every action out inline, which gets
 * cluttered once a row has more than one or two actions. Reusable by any
 * table that needs row-level actions (Resume/Delete here, but generic). */
const RowActionsMenu = ({ actions }: PropsDefinition) => {
  const [open, setOpen] = useState(false)

  const renderAction = (action: RowAction) => {
    const itemClass = scss.item + (action.danger ? ' ' + scss.danger : '')
    const inner = (
      <>
        {action.icon && (
          <Image
            src={action.icon}
            alt=""
            width={14}
            height={14}
            unoptimized
            className={scss.icon}
          />
        )}
        {action.label}
      </>
    )

    const content = action.href ? (
      <Link href={action.href} className={itemClass}>
        {inner}
      </Link>
    ) : (
      <button
        type="button"
        className={itemClass}
        onClick={() => { action.onClick?.(); setOpen(false) }}
      >
        {inner}
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
        <button type="button" className={itemClass}>
          {inner}
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
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="3" r="1.4" fill="currentColor" />
          <circle cx="8" cy="8" r="1.4" fill="currentColor" />
          <circle cx="8" cy="13" r="1.4" fill="currentColor" />
        </svg>
      </button>
    </Dropdown>
  )
}

export default RowActionsMenu

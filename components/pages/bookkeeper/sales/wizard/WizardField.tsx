import { ReactNode } from 'react'
import scss from './styles/Wizard.module.scss'

interface PropsDefinition {
  span?: 3 | 4 | 6 | 8 | 12
  label?: string
  htmlFor?: string
  required?: boolean
  err?: string
  children: ReactNode
}

const WizardField = ({ span = 6, label, htmlFor, required, err, children }: PropsDefinition) => {
  const colClass = {
    3: scss.col3,
    4: scss.col4,
    6: scss.col6,
    8: scss.col8,
    12: scss.col12,
  }[span]

  return (
    <div className={colClass + ' ' + scss.field}>
      {label && (
        <label htmlFor={htmlFor}>
          {label}
          {required && <em>*</em>}
        </label>
      )}
      {children}
      {err && <span className={scss.errmsg}>{err}</span>}
    </div>
  )
}

export default WizardField

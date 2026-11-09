import { ReactNode } from 'react'
import scss from './styles/Wizard.module.scss'

interface PropsDefinition {
  span?: 2 | 3 | 4 | 5 | 6 | 8 | 12
  label?: string
  htmlFor?: string
  required?: boolean
  err?: string
  children: ReactNode
}

const WizardField = ({ span = 6, label, htmlFor, required, err, children }: PropsDefinition) => {
  const colClass = {
    2: scss.col2,
    3: scss.col3,
    4: scss.col4,
    5: scss.col5,
    6: scss.col6,
    8: scss.col8,
    12: scss.col12,
  }[span]

  return (
    <div className={colClass + ' ' + scss.field + (err ? ' ' + scss.hasError : '')}>
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

import { ReactNode } from 'react'
interface PropsDefinition {
  err?: string | number
  width: number
  label?: string
  labelFor?: string
  required?: boolean
  disabled?: boolean
  children?: ReactNode
  className?: string | string[]
  scss: { [key: string]: string }
  cardClassName?: string | string[]
}
const CustomContainer = (
    {
      err,
      scss,
      width,
      label,
      labelFor,
      children,
      required,
      disabled,
      className,
      cardClassName,
    }: PropsDefinition
) => {
  return (
    <div className={scss.card+' '+scss['w'+width] + (cardClassName ? ' '+cardClassName : '')}>
      <div className={
          scss.npt +
          (err ? ' '+scss.err : '') +
          (disabled ? ' '+scss.disabled : '') +
          (className ? ' '+className : '')
      }>
        {
          label &&
          <label htmlFor={labelFor} className={scss.lbl}>
            {label}: {required ? <span>*</span> : <span>&nbsp; </span>}
          </label>
        }
        {children}
        <span className={scss.errmsg}>{err}</span>
      </div>
    </div>
  )
}
export default CustomContainer;
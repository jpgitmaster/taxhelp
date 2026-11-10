import scss from './styles/ActiveFilterChips.module.scss'

export interface ActiveFilterChip {
  key: string
  label: string
  onClear: () => void
}

interface PropsDefinition {
  chips: ActiveFilterChip[]
}

const ActiveFilterChips = ({ chips }: PropsDefinition) => {
  if (!chips.length) return null

  return (
    <div className={scss.row}>
      <span className={scss.label}>Active Filters:</span>
      {chips.map(chip => (
        <span key={chip.key} className={scss.chip}>
          {chip.label}
          <button type="button" onClick={chip.onClear} aria-label={`Clear ${chip.label}`}>×</button>
        </span>
      ))}
    </div>
  )
}

export default ActiveFilterChips

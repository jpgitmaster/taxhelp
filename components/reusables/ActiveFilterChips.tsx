import scss from './styles/ActiveFilterChips.module.scss'

export interface ActiveFilterChip {
  key: string
  label: string
  onClear: () => void
}

interface PropsDefinition {
  chips: ActiveFilterChip[]
}

/** Removable chips showing which filters are currently applied — a
 * standard SaaS filter-bar pattern (applied filters stay visible as
 * dismissable tags so a glance tells you what's being filtered without
 * re-opening each field). Renders nothing when no filters are active. */
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

import scss from './styles/Wizard.module.scss'

export interface WizardStepDefinition {
  key: number
  title: string
  subtitle: string
}

interface PropsDefinition {
  steps: WizardStepDefinition[]
  current: number
  /** A step is reachable once every step before it is complete. Pass one
   * boolean per step index (1-based) — e.g. [stepOneComplete, stepTwoComplete]. */
  completedSteps: boolean[]
  onStepClick: (step: number) => void
}

/** Clickable step indicator for a wizard flow — reusable by any multi-step
 * form, not just Sales. Steps ahead of the first incomplete one are disabled. */
const WizardSteps = ({ steps, current, completedSteps, onStepClick }: PropsDefinition) => {
  const firstIncomplete = completedSteps.findIndex(complete => !complete) + 1 || steps.length + 1

  return (
    <div className={scss.steps}>
      {steps.map((step) => {
        const isActive = step.key === current
        const isComplete = step.key < current
        const isDisabled = step.key > firstIncomplete

        return (
          <div
            key={step.key}
            className={scss.step + (isActive ? ' ' + scss.active : '') + (isComplete ? ' ' + scss.complete : '')}
            style={isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
            onClick={() => !isDisabled && onStepClick(step.key)}
          >
            <span className={scss.bubble}>{isComplete ? '✓' : step.key}</span>
            <span className={scss.label}>
              <small>{step.title}</small>
              <span>{step.subtitle}</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default WizardSteps

import scss from './styles/Wizard.module.scss'

interface StepDefinition {
  key: number
  title: string
  subtitle: string
}

interface PropsDefinition {
  current: number
  canLeaveStepOne: boolean
  onStepClick: (step: number) => void
}

const STEPS: StepDefinition[] = [
  { key: 1, title: 'Step 1', subtitle: 'Client & Customer' },
  { key: 2, title: 'Step 2', subtitle: 'Sales Details' },
  { key: 3, title: 'Step 3', subtitle: 'Tax Details' },
]

const WizardSteps = ({ current, canLeaveStepOne, onStepClick }: PropsDefinition) => {
  return (
    <div className={scss.steps}>
      {STEPS.map((step) => {
        const isActive = step.key === current
        const isComplete = step.key < current
        const isDisabled = step.key > 1 && !canLeaveStepOne

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

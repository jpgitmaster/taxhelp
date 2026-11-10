import scss from './styles/Wizard.module.scss'

interface PropsDefinition {
  isFirstStep: boolean
  isLastStep: boolean
  submitLabel: string
  submitDisabled?: boolean
  onBack: () => void
  onNext: () => void
}

const WizardNav = ({ isFirstStep, isLastStep, submitLabel, submitDisabled, onBack, onNext }: PropsDefinition) => (
  <div className={scss.navRow}>
    {!isFirstStep ? (
      <button type="button" className={scss.navBtn + ' ' + scss.secondary} onClick={onBack}>
        ← Back
      </button>
    ) : <span />}

    {!isLastStep ? (
      <button key="continue" type="button" className={scss.navBtn + ' ' + scss.primary} onClick={onNext}>
        Continue →
      </button>
    ) : (
      <button key="submit" type="submit" disabled={submitDisabled} className={scss.navBtn + ' ' + scss.primary}>
        {submitLabel}
      </button>
    )}
  </div>
)

export default WizardNav

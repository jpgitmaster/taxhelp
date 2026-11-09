import scss from './styles/Wizard.module.scss'

interface PropsDefinition {
  isFirstStep: boolean
  isLastStep: boolean
  submitLabel: string
  submitDisabled?: boolean
  onBack: () => void
  onNext: () => void
}

/** Back / Continue / Submit row for a wizard flow — reusable by any
 * multi-step form. The final step renders a type="submit" button instead
 * of Continue so it participates in the surrounding <form>'s onSubmit. */
const WizardNav = ({ isFirstStep, isLastStep, submitLabel, submitDisabled, onBack, onNext }: PropsDefinition) => (
  <div className={scss.navRow}>
    {!isFirstStep ? (
      <button type="button" className={scss.navBtn + ' ' + scss.secondary} onClick={onBack}>
        ← Back
      </button>
    ) : <span />}

    {!isLastStep ? (
      // Distinct keys (not just a ternary in the same slot) matter here: without
      // them React reconciles this into the *same* DOM button as the submit one
      // below and just flips its `type` attribute in place. Since React flushes
      // click-triggered state updates synchronously, the browser's native
      // click-default-action phase — which runs right after — then reads the
      // now-mutated type="submit" off the element it just clicked and submits
      // the form immediately, before the user ever sees Step 3. A fresh DOM
      // node per branch avoids that entirely.
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

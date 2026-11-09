import { useState } from 'react'

interface UseWizardOptions {
  totalSteps: number
  /** Validate a given step's fields. Return false to block leaving that step —
   * the wizard stays put (and whatever the validator did, e.g. setting error
   * state for red borders, is left in place for the user to see). */
  validateStep?: (step: number) => boolean
}

/** Generic multi-step wizard navigation — step state, forward/back, and a
 * clickable step list that validates every step in between before jumping
 * ahead. Reusable by any multi-step form in the app, not just Sales. */
const useWizard = ({ totalSteps, validateStep }: UseWizardOptions) => {
  const [step, setStep] = useState(1)

  const goNext = () => {
    if (validateStep && !validateStep(step)) return
    setStep(prev => Math.min(totalSteps, prev + 1))
  }

  const goBack = () => {
    setStep(prev => Math.max(1, prev - 1))
  }

  /** Jump directly to a step (e.g. clicking a step header). Going backward or
   * to the immediate next step behaves like goBack/goNext; jumping further
   * ahead validates every step in between and stops at the first one that
   * fails. */
  const goToStep = (target: number) => {
    if (target < 1 || target > totalSteps || target === step) return

    if (target <= step) {
      setStep(target)
      return
    }

    for (let current = step; current < target; current++) {
      if (validateStep && !validateStep(current)) {
        setStep(current)
        return
      }
    }
    setStep(target)
  }

  return {
    step,
    setStep,
    goNext,
    goBack,
    goToStep,
    isFirstStep: step === 1,
    isLastStep: step === totalSteps,
  }
}

export default useWizard

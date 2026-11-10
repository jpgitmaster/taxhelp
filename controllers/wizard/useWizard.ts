import { useState } from 'react'

interface UseWizardOptions {
  totalSteps: number
  validateStep?: (step: number) => boolean
}

const useWizard = ({ totalSteps, validateStep }: UseWizardOptions) => {
  const [step, setStep] = useState(1)

  const goNext = () => {
    if (validateStep && !validateStep(step)) return
    setStep(prev => Math.min(totalSteps, prev + 1))
  }

  const goBack = () => {
    setStep(prev => Math.max(1, prev - 1))
  }

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

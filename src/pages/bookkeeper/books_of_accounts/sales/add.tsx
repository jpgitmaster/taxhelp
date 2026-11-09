import { useEffect } from 'react'
import scss from './styles/Sales.module.scss'
import useWizard from '@/controllers/wizard/useWizard'
import wizardScss from '@/components/pages/bookkeeper/sales/wizard/styles/Wizard.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import useSaveSales from '@/controllers/sales/useSaveSales'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import WizardNav from '@/components/pages/bookkeeper/sales/wizard/WizardNav'
import WizardSteps, { WizardStepDefinition } from '@/components/pages/bookkeeper/sales/wizard/WizardSteps'
import TaxDetailsStep from '@/components/pages/bookkeeper/sales/wizard/TaxDetailsStep'
import SalesDetailsStep from '@/components/pages/bookkeeper/sales/wizard/SalesDetailsStep'
import ClientCustomerStep from '@/components/pages/bookkeeper/sales/wizard/ClientCustomerStep'

const WIZARD_STEPS: WizardStepDefinition[] = [
  { key: 1, title: 'Step 1', subtitle: 'Client & Customer' },
  { key: 2, title: 'Step 2', subtitle: 'Sales Details' },
  { key: 3, title: 'Step 3', subtitle: 'Tax Details' },
]

const AddSalesRecord_V = () => {
  const {
    doc,
    sales,
    status,
    errArr,
    options,
    clientArr,
    customerArr,
    clientLoader,
    displayTerms,
    displayClients,
    editCustomer,
    hasWithholding,
    customerLoader,
    displayCustomers,
    displayDiscounts,

    draftId,
    saveStatus,
    lockConflict,
    isHydrating,

    setDisplayTerms,
    setDisplayClients,
    setDisplayCustomers,
    setDisplayDiscounts,

    handleBlur,
    handleDate,
    handleChange,
    handleSubmit,
    handleToggle,
    validateStep,
    handleSelectTerms,
    handleSelectClient,
    handleAddParticular,
    handleSelectCustomer,
    handleSelectDiscount,
    handleEditCustomer,
    handleRemoveParticular,
    handleParticularChange,
    handleToggleWithholding,
  } = useSaveSales()
  const { loader } = status

  const { step, setStep, goNext, goBack, goToStep, isFirstStep, isLastStep } = useWizard({
    totalSteps: WIZARD_STEPS.length,
    validateStep,
  })

  // After a failed final submit, jump to whichever step holds the first
  // invalid field — errors set on a step the user isn't viewing would
  // otherwise be invisible. (Continue already blocks advancing past an
  // incomplete step, so this is mainly a safety net for the last step.)
  useEffect(() => {
    const erroredFields = Object.keys(sales.salesErr)
    if (!erroredFields.length) return

    const stepOfField = (field: string) => {
      if (field.startsWith('particulars')) return 2
      const stepTwoFields = ['taxable_month', 'invoice_date', 'invoice_number', 'terms', 'account_name', 'id_number']
      const stepOneFields = [
        'client', 'customer', 'tin', 'classification', 'registered_name',
        'first_name', 'middle_name', 'last_name', 'trade_name', 'phone', 'email',
        'first_address', 'second_address', 'postal_code',
      ]
      if (stepOneFields.includes(field)) return 1
      if (stepTwoFields.includes(field)) return 2
      return 3
    }

    setStep(Math.min(...erroredFields.map(stepOfField)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales.salesErr])

  const customer = sales.salesObj.customer
  const isNonIndividual = customer?.classification === 'NON-INDIVIDUAL'
  const isStepOneComplete = !!(
    doc.client?.id &&
    customer?.id &&
    customer?.tin &&
    customer?.first_address &&
    customer?.second_address &&
    (isNonIndividual ? customer?.registered_name : (customer?.first_name && customer?.last_name))
  )
  const hasCompleteParticular = sales.salesObj.particulars.some(
    (p: { description: string, quantity: string, unit_price: string, amount: string }) =>
      p.description && p.quantity && p.unit_price && p.amount
  )
  const isStepTwoComplete = isStepOneComplete && !!(
    sales.salesObj.taxable_month &&
    sales.salesObj.invoice_date &&
    sales.salesObj.invoice_number &&
    sales.salesObj.terms &&
    sales.salesObj.account_name &&
    sales.salesObj.id_number &&
    hasCompleteParticular
  )

  const saveStatusLabel = {
    idle: '',
    saving: 'Saving…',
    saved: 'Saved',
    error: 'Could not save — will retry on your next change',
  }[saveStatus]

  return (
    <form
      onSubmit={handleSubmit}
      className={wizardScss.wizard}
      // Pressing Enter in any field would otherwise submit the whole form the
      // moment a submit-type button exists anywhere inside it (the final
      // step's button) — even while still on Step 1 or 2. That ran full
      // validation against fields the user hasn't reached yet and left them
      // marked invalid. Only allow Enter to submit on the actual last step.
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !isLastStep) e.preventDefault()
      }}
    >
      {(loader || isHydrating) && <Loader scss={scss} position="absolute" />}

      {draftId && !lockConflict.locked && (
        <div className={wizardScss.statusRow}>
          <span className={wizardScss.saveStatus + ' ' + wizardScss[saveStatus]}>
            <span className={wizardScss.dot} />
            {saveStatusLabel}
          </span>
        </div>
      )}
      {lockConflict.locked && (
        <div className={wizardScss.lockBanner}>
          {lockConflict.message || 'This draft is currently being edited elsewhere.'} Changes here will not be saved.
        </div>
      )}

      <WizardSteps
        steps={WIZARD_STEPS}
        current={step}
        completedSteps={[isStepOneComplete, isStepTwoComplete]}
        onStepClick={goToStep}
      />

      <fieldset disabled={lockConflict.locked} style={{ border: 'none', margin: 0, padding: 0 }}>
        {step === 1 && (
          <ClientCustomerStep
            doc={doc}
            sales={sales}
            draftId={draftId}
            clientArr={clientArr}
            customerArr={customerArr}
            clientLoader={clientLoader}
            customerLoader={customerLoader}
            displayClients={displayClients}
            displayCustomers={displayCustomers}
            editCustomer={editCustomer}
            setDisplayClients={setDisplayClients}
            setDisplayCustomers={setDisplayCustomers}
            handleBlur={handleBlur}
            handleChange={handleChange}
            handleToggle={handleToggle}
            handleEditCustomer={handleEditCustomer}
            handleSelectClient={handleSelectClient}
            handleSelectCustomer={handleSelectCustomer}
          />
        )}

        {step === 2 && (
          <SalesDetailsStep
            doc={doc}
            sales={sales}
            errArr={errArr}
            displayTerms={displayTerms}
            displayDiscounts={displayDiscounts}
            setDisplayTerms={setDisplayTerms}
            setDisplayDiscounts={setDisplayDiscounts}
            handleBlur={handleBlur}
            handleChange={handleChange}
            handleDate={handleDate}
            handleToggle={handleToggle}
            handleSelectTerms={handleSelectTerms}
            handleSelectDiscount={handleSelectDiscount}
            handleAddParticular={handleAddParticular}
            handleRemoveParticular={handleRemoveParticular}
            handleParticularChange={handleParticularChange}
          />
        )}

        {step === 3 && (
          <TaxDetailsStep
            doc={doc}
            sales={sales}
            options={options}
            hasWithholding={hasWithholding}
            handleBlur={handleBlur}
            handleChange={handleChange}
            handleToggleWithholding={handleToggleWithholding}
          />
        )}
      </fieldset>

      <WizardNav
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        submitLabel={draftId ? 'Post Sales Record' : 'Add Sales Record'}
        submitDisabled={lockConflict.locked}
        onBack={goBack}
        onNext={goNext}
      />
    </form>
  )
}
export const getServerSideProps: GetServerSideProps<PageProps> = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context) as Session
  if (!session?.user) {
    signOut({ redirect: true, callbackUrl: '/' })
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}
export default AddSalesRecord_V;

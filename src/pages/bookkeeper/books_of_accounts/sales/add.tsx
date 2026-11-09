import { useEffect, useState } from 'react'
import scss from './styles/Sales.module.scss'
import wizardScss from '@/components/pages/bookkeeper/sales/wizard/styles/Wizard.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import useSaveSales from '@/controllers/sales/useSaveSales'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import WizardSteps from '@/components/pages/bookkeeper/sales/wizard/WizardSteps'
import TaxDetailsStep from '@/components/pages/bookkeeper/sales/wizard/TaxDetailsStep'
import SalesDetailsStep from '@/components/pages/bookkeeper/sales/wizard/SalesDetailsStep'
import ClientCustomerStep from '@/components/pages/bookkeeper/sales/wizard/ClientCustomerStep'

const STEP_ONE_FIELDS = new Set([
  'client', 'customer', 'tin', 'classification', 'registered_name', 'first_name',
  'middle_name', 'last_name', 'trade_name', 'phone', 'email',
  'first_address', 'second_address', 'postal_code',
])
const STEP_TWO_FIELDS = new Set([
  'taxable_month', 'invoice_date', 'invoice_number', 'terms', 'account_name', 'id_number', 'particulars',
])

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
    handleSelectTerms,
    handleSelectClient,
    handleAddParticular,
    handleSelectCustomer,
    handleSelectDiscount,
    handleRemoveParticular,
    handleParticularChange,
  } = useSaveSales()
  const { loader } = status
  const [step, setStep] = useState(1)

  // After a failed submit, jump to whichever step holds the first invalid field —
  // errors set on a step the user isn't viewing would otherwise be invisible.
  useEffect(() => {
    const erroredFields = Object.keys(sales.salesErr)
    if (!erroredFields.length) return

    const hasStepOneError = erroredFields.some(field => STEP_ONE_FIELDS.has(field))
    const hasStepTwoError = erroredFields.some(field => STEP_TWO_FIELDS.has(field) || field.startsWith('particulars'))

    if (hasStepOneError) setStep(1)
    else if (hasStepTwoError) setStep(2)
    else setStep(3)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales.salesErr])

  const canLeaveStepOne = !!doc.client?.id
  const saveStatusLabel = {
    idle: '',
    saving: 'Saving…',
    saved: 'Saved',
    error: 'Could not save — will retry on your next change',
  }[saveStatus]

  const goNext = () => setStep(prev => Math.min(3, prev + 1) as 1 | 2 | 3)
  const goBack = () => setStep(prev => Math.max(1, prev - 1) as 1 | 2 | 3)

  return (
    <form onSubmit={handleSubmit} className={wizardScss.wizard}>
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

      <WizardSteps current={step} canLeaveStepOne={canLeaveStepOne} onStepClick={setStep} />

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
            setDisplayClients={setDisplayClients}
            setDisplayCustomers={setDisplayCustomers}
            handleBlur={handleBlur}
            handleChange={handleChange}
            handleToggle={handleToggle}
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
            sales={sales}
            options={options}
            handleBlur={handleBlur}
            handleChange={handleChange}
          />
        )}
      </fieldset>

      <div className={wizardScss.navRow}>
        {step > 1 ? (
          <button type="button" className={wizardScss.navBtn + ' ' + wizardScss.secondary} onClick={goBack}>
            ← Back
          </button>
        ) : <span />}

        {step < 3 ? (
          <button
            type="button"
            className={wizardScss.navBtn + ' ' + wizardScss.primary}
            disabled={step === 1 && !canLeaveStepOne}
            onClick={goNext}
          >
            Continue →
          </button>
        ) : (
          <button type="submit" disabled={lockConflict.locked} className={wizardScss.navBtn + ' ' + wizardScss.primary}>
            {draftId ? 'Post Sales Record' : 'Add Sales Record'}
          </button>
        )}
      </div>
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

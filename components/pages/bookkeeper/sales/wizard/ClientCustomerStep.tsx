import { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction } from 'react'
import scss from './styles/Wizard.module.scss'
import WizardField from './WizardField'
import { CustomerObj } from '@/controllers/customers/types'
import ClientsDropdown from '@/components/pages/bookkeeper/documents/ClientsDropdown'
import CustomersDropdown from '@/components/pages/bookkeeper/sales/CustomersDropdown'

const ClientCustomerStep = (props: {
  doc: any
  sales: any
  draftId: number | null
  clientArr: any[]
  customerArr: any[]
  clientLoader: boolean
  customerLoader: boolean
  displayClients: boolean
  displayCustomers: boolean
  setDisplayClients: Dispatch<SetStateAction<boolean>>
  setDisplayCustomers: Dispatch<SetStateAction<boolean>>
  handleBlur: (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement>) => void
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleToggle: (dropdown: string) => void
  handleSelectClient: (client: any) => void
  handleSelectCustomer: (customer: CustomerObj) => void
}) => {
  const {
    doc,
    sales,
    draftId,
    clientArr,
    customerArr,
    clientLoader,
    customerLoader,
    displayClients,
    displayCustomers,
    setDisplayClients,
    setDisplayCustomers,
    handleBlur,
    handleChange,
    handleToggle,
    handleSelectClient,
    handleSelectCustomer,
  } = props
  const classification = sales.salesObj.customer?.classification

  return (
    <div className={scss.panel}>
      <div className={scss.panelTitle}>Who is this sale for?</div>

      <div className={scss.sectionLabel}>Client</div>
      <div className={scss.fieldGrid}>
        <WizardField span={8} label="Client" htmlFor="client" required err={sales.salesErr.client as string}>
          <div
            style={draftId ? { pointerEvents: 'none', opacity: 0.6 } : undefined}
            title={draftId ? 'Client is locked once this draft starts saving. Start a new entry to pick a different client.' : undefined}
          >
            <ClientsDropdown
              doc={doc}
              clients={clientArr}
              loader={clientLoader}
              displayClients={displayClients}
              err={sales.salesErr.client as string}
              setDisplayClients={setDisplayClients}
              handleChange={handleChange}
              handleToggle={handleToggle}
              handleSelectClient={handleSelectClient}
            />
          </div>
        </WizardField>
      </div>

      <div className={scss.sectionLabel}>Customer</div>
      <div className={scss.fieldGrid}>
        <WizardField span={8} label="Customer" htmlFor="customer" required err={sales.salesErr.customer as string}>
          <CustomersDropdown
            doc={doc}
            loader={customerLoader}
            customers={customerArr}
            displayCustomers={displayCustomers}
            err={sales.salesErr.customer as string}
            setDisplayCustomers={setDisplayCustomers}
            handleChange={handleChange}
            handleToggle={handleToggle}
            handleSelectCustomer={handleSelectCustomer}
          />
        </WizardField>

        <WizardField span={4} label="Classification" htmlFor="classification" required err={sales.salesErr.classification as string}>
          <select
            id="classification"
            name="classification"
            autoComplete="off"
            onKeyUp={handleBlur}
            onChange={handleChange}
            value={classification}
          >
            <option value="NON-INDIVIDUAL">Non-Individual</option>
            <option value="INDIVIDUAL">Individual</option>
          </select>
        </WizardField>

        <WizardField span={4} label="TIN No." htmlFor="tin" required err={sales.salesErr.tin as string}>
          <input
            id="tin"
            type="text"
            name="tin"
            maxLength={30}
            autoComplete="off"
            onKeyUp={handleBlur}
            onChange={handleChange}
            placeholder="000-000-000"
            value={sales.salesObj.customer?.tin}
          />
        </WizardField>

        {classification === 'NON-INDIVIDUAL' && (
          <WizardField span={8} label="Registered Name" htmlFor="registered_name" required err={sales.salesErr.registered_name as string}>
            <input
              type="text"
              maxLength={100}
              autoComplete="off"
              id="registered_name"
              name="registered_name"
              onKeyUp={handleBlur}
              onChange={handleChange}
              value={sales.salesObj.customer?.registered_name}
            />
          </WizardField>
        )}

        {classification === 'INDIVIDUAL' && (
          <>
            <WizardField span={4} label="First Name" htmlFor="first_name" required err={sales.salesErr.first_name as string}>
              <input
                type="text"
                maxLength={20}
                id="first_name"
                name="first_name"
                autoComplete="off"
                onKeyUp={handleBlur}
                onChange={handleChange}
                value={sales.salesObj.customer?.first_name}
              />
            </WizardField>
            <WizardField span={4} label="Middle Name" htmlFor="middle_name" err={sales.salesErr.middle_name as string}>
              <input
                type="text"
                maxLength={20}
                id="middle_name"
                name="middle_name"
                autoComplete="off"
                onKeyUp={handleBlur}
                onChange={handleChange}
                value={sales.salesObj.customer?.middle_name}
              />
            </WizardField>
            <WizardField span={4} label="Last Name" htmlFor="last_name" required err={sales.salesErr.last_name as string}>
              <input
                type="text"
                maxLength={20}
                id="last_name"
                name="last_name"
                autoComplete="off"
                onKeyUp={handleBlur}
                onChange={handleChange}
                value={sales.salesObj.customer?.last_name}
              />
            </WizardField>
          </>
        )}

        <WizardField span={6} label="Trade Name" htmlFor="trade_name" err={sales.salesErr.trade_name as string}>
          <input
            type="text"
            maxLength={100}
            id="trade_name"
            name="trade_name"
            autoComplete="off"
            onKeyUp={handleBlur}
            onChange={handleChange}
            value={sales.salesObj.customer?.trade_name}
          />
        </WizardField>
        <WizardField span={3} label="Phone Number" htmlFor="phone" err={sales.salesErr.phone as string}>
          <input
            id="phone"
            type="text"
            name="phone"
            maxLength={30}
            autoComplete="off"
            placeholder="(+63)926-123-4567"
            onKeyUp={handleBlur}
            onChange={handleChange}
            value={sales.salesObj.customer?.phone_number}
          />
        </WizardField>
        <WizardField span={3} label="Email" htmlFor="email" err={sales.salesErr.email as string}>
          <input
            id="email"
            name="email"
            type="text"
            maxLength={50}
            autoComplete="off"
            placeholder="yourname@yourcompany.com"
            onKeyUp={handleBlur}
            onChange={handleChange}
            value={sales.salesObj.customer?.email}
          />
        </WizardField>

        <WizardField span={4} label="First Address" htmlFor="first_address" required err={sales.salesErr.first_address as string}>
          <input
            type="text"
            maxLength={50}
            autoComplete="off"
            id="first_address"
            name="first_address"
            onKeyUp={handleBlur}
            onChange={handleChange}
            placeholder="Substreet, Street, Barangay"
            value={sales.salesObj.customer?.first_address}
          />
        </WizardField>
        <WizardField span={4} label="Second Address" htmlFor="second_address" required err={sales.salesErr.second_address as string}>
          <input
            id="second_address"
            type="text"
            name="second_address"
            maxLength={50}
            autoComplete="off"
            onKeyUp={handleBlur}
            onChange={handleChange}
            placeholder="District / Municipality, City / Province"
            value={sales.salesObj.customer?.second_address}
          />
        </WizardField>
        <WizardField span={4} label="Postal Code" htmlFor="postal_code" err={sales.salesErr.postal_code as string}>
          <input
            type="text"
            maxLength={10}
            id="postal_code"
            autoComplete="off"
            name="postal_code"
            onKeyUp={handleBlur}
            onChange={handleChange}
            value={sales.salesObj.customer?.postal_code}
          />
        </WizardField>
      </div>
    </div>
  )
}

export default ClientCustomerStep

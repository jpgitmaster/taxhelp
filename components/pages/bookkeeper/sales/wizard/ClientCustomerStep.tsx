import { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction } from 'react'
import scss from './styles/Wizard.module.scss'
import WizardField from './WizardField'
import { CustomerObj } from '@/controllers/customers/types'
import SectionHeader from '@/components/reusables/SectionHeader'
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
  editCustomer: boolean
  setDisplayClients: Dispatch<SetStateAction<boolean>>
  setDisplayCustomers: Dispatch<SetStateAction<boolean>>
  handleBlur: (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement>) => void
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleToggle: (dropdown: string) => void
  handleSelectClient: (client: any) => void
  handleSelectCustomer: (customer: CustomerObj) => void
  handleEditCustomer: (edit: boolean) => void
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
    editCustomer,
    setDisplayClients,
    setDisplayCustomers,
    handleBlur,
    handleChange,
    handleToggle,
    handleSelectClient,
    handleSelectCustomer,
    handleEditCustomer,
  } = props
  const classification = sales.salesObj.customer?.classification
  const client = doc.client
  const hasSelectedClient = !!client?.id
  const hasSelectedCustomer = !!sales.salesObj.customer?.id
  const isCustomerEditable = editCustomer || !hasSelectedCustomer

  return (
    <div className={scss.panel}>
      <SectionHeader title="Client Details" />
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

      {hasSelectedClient && (
        <>
          <div className={scss.fieldGrid}>
            <WizardField span={4} label="Classification">
              <input readOnly disabled type="text" value={client.classification ? client.classification.charAt(0) + client.classification.slice(1).toLowerCase() : ''} />
            </WizardField>
            <WizardField span={4} label="TIN No.">
              <input readOnly disabled type="text" value={client.tin || ''} />
            </WizardField>
            <WizardField span={2} label="RDO Code">
              <input readOnly disabled type="text" value={client.rdo_code || ''} />
            </WizardField>
            <WizardField span={2} label="Branch Code">
              <input readOnly disabled type="text" value={client.branch_code || ''} />
            </WizardField>
          </div>
          <div className={scss.fieldGrid}>
            <WizardField span={6} label="First Address">
              <input readOnly disabled type="text" value={client.first_address || ''} />
            </WizardField>
            <WizardField span={6} label="Second Address">
              <input readOnly disabled type="text" value={client.second_address || ''} />
            </WizardField>
          </div>
        </>
      )}

      <hr className={scss.divider} />

      <SectionHeader
        title="Customer Details"
        action={hasSelectedCustomer && (
          <span className={scss.editToggle} onClick={() => handleEditCustomer(!editCustomer)}>
            {editCustomer ? 'View Details' : 'Edit Details'}
          </span>
        )}
      />

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
          {isCustomerEditable ? (
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
          ) : (
            <input readOnly disabled type="text" value={classification ? classification.charAt(0) + classification.slice(1).toLowerCase() : ''} />
          )}
        </WizardField>
      </div>

      <div className={scss.fieldGrid}>
        {classification === 'NON-INDIVIDUAL' ? (
          <>
            <WizardField span={4} label="TIN No." htmlFor="tin" required={isCustomerEditable} err={sales.salesErr.tin as string}>
              <input
                readOnly={!isCustomerEditable} disabled={!isCustomerEditable}
                id="tin" type="text" name="tin" maxLength={30} autoComplete="off"
                onKeyUp={handleBlur} onChange={handleChange} placeholder="000-000-000"
                value={sales.salesObj.customer?.tin}
              />
            </WizardField>
            <WizardField span={8} label="Registered Name" htmlFor="registered_name" required={isCustomerEditable} err={sales.salesErr.registered_name as string}>
              <input
                readOnly={!isCustomerEditable} disabled={!isCustomerEditable}
                type="text" maxLength={100} autoComplete="off" id="registered_name" name="registered_name"
                onKeyUp={handleBlur} onChange={handleChange} value={sales.salesObj.customer?.registered_name}
              />
            </WizardField>
          </>
        ) : (
          <>
            <WizardField span={4} label="TIN No." htmlFor="tin" required={isCustomerEditable} err={sales.salesErr.tin as string}>
              <input
                readOnly={!isCustomerEditable} disabled={!isCustomerEditable}
                id="tin" type="text" name="tin" maxLength={30} autoComplete="off"
                onKeyUp={handleBlur} onChange={handleChange} placeholder="000-000-000"
                value={sales.salesObj.customer?.tin}
              />
            </WizardField>
            <WizardField span={4} label="First Name" htmlFor="first_name" required={isCustomerEditable} err={sales.salesErr.first_name as string}>
              <input
                readOnly={!isCustomerEditable} disabled={!isCustomerEditable}
                type="text" maxLength={20} id="first_name" name="first_name" autoComplete="off"
                onKeyUp={handleBlur} onChange={handleChange} value={sales.salesObj.customer?.first_name}
              />
            </WizardField>
            <WizardField span={4} label="Last Name" htmlFor="last_name" required={isCustomerEditable} err={sales.salesErr.last_name as string}>
              <input
                readOnly={!isCustomerEditable} disabled={!isCustomerEditable}
                type="text" maxLength={20} id="last_name" name="last_name" autoComplete="off"
                onKeyUp={handleBlur} onChange={handleChange} value={sales.salesObj.customer?.last_name}
              />
            </WizardField>
          </>
        )}
      </div>

      <div className={scss.fieldGrid}>
        {classification === 'INDIVIDUAL' && (
          <WizardField span={4} label="Middle Name" htmlFor="middle_name" err={sales.salesErr.middle_name as string}>
            <input
              readOnly={!isCustomerEditable} disabled={!isCustomerEditable}
              type="text" maxLength={20} id="middle_name" name="middle_name" autoComplete="off"
              onKeyUp={handleBlur} onChange={handleChange} value={sales.salesObj.customer?.middle_name}
            />
          </WizardField>
        )}
        <WizardField span={classification === 'INDIVIDUAL' ? 8 : 12} label="Trade Name" htmlFor="trade_name" err={sales.salesErr.trade_name as string}>
          <input
            readOnly={!isCustomerEditable} disabled={!isCustomerEditable}
            type="text" maxLength={100} id="trade_name" name="trade_name" autoComplete="off"
            onKeyUp={handleBlur} onChange={handleChange} value={sales.salesObj.customer?.trade_name}
          />
        </WizardField>
      </div>

      <div className={scss.fieldGrid}>
        <WizardField span={4} label="Phone Number" htmlFor="phone" err={sales.salesErr.phone as string}>
          <input
            readOnly={!isCustomerEditable} disabled={!isCustomerEditable}
            id="phone" type="text" name="phone" maxLength={30} autoComplete="off"
            placeholder="(+63)926-123-4567" onKeyUp={handleBlur} onChange={handleChange}
            value={sales.salesObj.customer?.phone_number}
          />
        </WizardField>
        <WizardField span={4} label="Email" htmlFor="email" err={sales.salesErr.email as string}>
          <input
            readOnly={!isCustomerEditable} disabled={!isCustomerEditable}
            id="email" name="email" type="text" maxLength={50} autoComplete="off"
            placeholder="yourname@yourcompany.com" onKeyUp={handleBlur} onChange={handleChange}
            value={sales.salesObj.customer?.email}
          />
        </WizardField>
        <WizardField span={4} label="Postal Code" htmlFor="postal_code" err={sales.salesErr.postal_code as string}>
          <input
            readOnly={!isCustomerEditable} disabled={!isCustomerEditable}
            type="text" maxLength={10} id="postal_code" autoComplete="off" name="postal_code"
            onKeyUp={handleBlur} onChange={handleChange} value={sales.salesObj.customer?.postal_code}
          />
        </WizardField>
      </div>

      <div className={scss.fieldGrid}>
        <WizardField span={6} label="First Address" htmlFor="first_address" required={isCustomerEditable} err={sales.salesErr.first_address as string}>
          <input
            readOnly={!isCustomerEditable} disabled={!isCustomerEditable}
            type="text" maxLength={50} autoComplete="off" id="first_address" name="first_address"
            onKeyUp={handleBlur} onChange={handleChange} placeholder="Substreet, Street, Barangay"
            value={sales.salesObj.customer?.first_address}
          />
        </WizardField>
        <WizardField span={6} label="Second Address" htmlFor="second_address" required={isCustomerEditable} err={sales.salesErr.second_address as string}>
          <input
            readOnly={!isCustomerEditable} disabled={!isCustomerEditable}
            id="second_address" type="text" name="second_address" maxLength={50} autoComplete="off"
            onKeyUp={handleBlur} onChange={handleChange} placeholder="District / Municipality, City / Province"
            value={sales.salesObj.customer?.second_address}
          />
        </WizardField>
      </div>
    </div>
  )
}

export default ClientCustomerStep

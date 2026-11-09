import dayjs from 'dayjs'
import Link from 'next/link'
import { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { signOut, getSession } from 'next-auth/react'
import CMS_Layout from '@/components/layouts/CMS_Layout'
import SectionHeader from '@/components/reusables/SectionHeader'
import ReadOnlyField from '@/components/reusables/ReadOnlyField'
import useSalesManualAPI from '@/controllers/salesManual/api'
import useQueryClients from '@/controllers/clients/api/queries'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import type { NextPageWithLayout } from '@/pages/_app'
import scss from './styles/ViewSalesRecord.module.scss'

const formatNumber = (value: number | string | undefined) =>
  Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Read-only display of a posted (or otherwise non-draft) manual sale
 * record — a separate page from the editable wizard (add.tsx) rather than
 * that wizard rendered disabled, since a greyed-out input box still reads
 * as "this field should be editable" where a plain label+underline reads
 * as "this is just a fact". */
const ViewSalesRecord_V: NextPageWithLayout = () => {
  const router = useRouter()
  const id = router.query.id ? Number(router.query.id) : null

  const { useGetSalesManualById } = useSalesManualAPI()
  const { getClient } = useQueryClients()

  const { data: sale, isLoading: saleLoading } = useGetSalesManualById(id)
  const { data: client, isLoading: clientLoading } = getClient(Number(sale?.client_id))

  const loading = saleLoading || (!!sale?.client_id && clientLoading)
  const customer = (sale?.customer || {}) as Record<string, string | undefined>
  const isNonIndividual = customer.classification === 'NON-INDIVIDUAL'
  const customerName = isNonIndividual
    ? customer.registered_name
    : [customer.first_name, customer.middle_name, customer.last_name].filter(Boolean).join(' ')
  const clientName = client?.registered_name || [client?.first_name, client?.last_name].filter(Boolean).join(' ')
  const titleCase = (value?: string) => value ? value.charAt(0) + value.slice(1).toLowerCase() : undefined
  const hasWithholding = !!(sale?.atc || sale?.ewt_rate)
  const hasDiscount = !!sale?.discount_type

  return (
    <div className={scss.wizard}>
      <div className={scss.header}>
        <div>
          <h1>Sale Record</h1>
          {sale && (
            <span className={scss.statusBadge + ' ' + scss[sale.status]}>{sale.status}</span>
          )}
        </div>
        <Link href="/bookkeeper/books_of_accounts/sales/manual" className={scss.backLink}>
          ← Back to list
        </Link>
      </div>

      {loading && <div className={scss.loadingText}>Loading…</div>}

      {!loading && sale && (
        <>
          <div className={scss.panel}>
            <SectionHeader title="Client Details" />
            <div className={scss.fieldGrid}>
              <ReadOnlyField label="Client" value={clientName} span={8} />
              <ReadOnlyField label="Classification" value={titleCase(client?.classification)} span={4} />
            </div>
            <div className={scss.fieldGrid}>
              <ReadOnlyField label="TIN No." value={client?.tin} span={4} />
              <ReadOnlyField label="Branch Code" value={client?.branch_code} span={4} />
              <ReadOnlyField label="RDO Code" value={client?.rdo_code} span={4} />
            </div>
            <div className={scss.fieldGrid}>
              <ReadOnlyField label="First Address" value={client?.first_address} span={12} />
            </div>
            <div className={scss.fieldGrid}>
              <ReadOnlyField label="Second Address" value={client?.second_address} span={12} />
            </div>

            <hr className={scss.divider} />

            <SectionHeader title="Customer Details" />
            <div className={scss.fieldGrid}>
              <ReadOnlyField label="Customer" value={customerName} span={8} />
              <ReadOnlyField label="Classification" value={titleCase(customer.classification)} span={4} />
            </div>
            <div className={scss.fieldGrid}>
              <ReadOnlyField label="Trade Name" value={customer.trade_name} span={8} />
              <ReadOnlyField label="TIN No." value={customer.tin} span={4} />
            </div>
            <div className={scss.fieldGrid}>
              {isNonIndividual ? (
                <ReadOnlyField label="Registered Name" value={customer.registered_name} span={12} />
              ) : (
                <>
                  <ReadOnlyField label="First Name" value={customer.first_name} span={4} />
                  <ReadOnlyField label="Middle Name" value={customer.middle_name} span={4} />
                  <ReadOnlyField label="Last Name" value={customer.last_name} span={4} />
                </>
              )}
            </div>
            <div className={scss.fieldGrid}>
              <ReadOnlyField label="Phone Number" value={customer.phone_number} span={4} />
              <ReadOnlyField label="Email" value={customer.email} span={4} />
              <ReadOnlyField label="Postal Code" value={customer.postal_code} span={4} />
            </div>
            <div className={scss.fieldGrid}>
              <ReadOnlyField label="First Address" value={customer.first_address} span={12} />
            </div>
            <div className={scss.fieldGrid}>
              <ReadOnlyField label="Second Address" value={customer.second_address} span={12} />
            </div>
          </div>

          <div className={scss.panel}>
            <SectionHeader title="Sales Details" />
            <div className={scss.fieldGrid}>
              <ReadOnlyField label="Taxable Month" value={sale.taxable_month ? dayjs(sale.taxable_month).format('MM-YYYY') : undefined} span={4} />
              <ReadOnlyField label="Invoice Date" value={sale.invoice_date ? dayjs(sale.invoice_date).format('MM/DD/YYYY') : undefined} span={4} />
              <ReadOnlyField label="Invoice Number" value={sale.invoice_number} span={4} />
            </div>
            <div className={scss.fieldGrid}>
              <ReadOnlyField label="Terms" value={titleCase(sale.terms)} span={hasDiscount ? 3 : 4} />
              <ReadOnlyField label="Discount Type" value={sale.discount_type || 'No Discount'} span={hasDiscount ? 5 : 8} />
              {hasDiscount && (
                <ReadOnlyField label={`${sale.discount_type} ID No.`} value={sale.discount_id_number} span={4} />
              )}
            </div>
            <div className={scss.fieldGrid}>
              <ReadOnlyField label="Account Name" value={sale.account_name} span={12} />
            </div>

            <hr className={scss.divider} />

            <SectionHeader title="Particulars" />
            <div className={scss.particularsCard}>
              <div className={scss.particularsRow + ' ' + scss.headRow}>
                <span>Item Description / Service Nature</span>
                <span>Qty</span>
                <span>Unit Price</span>
                <span>Amount</span>
              </div>

              {sale.particulars?.length ? sale.particulars.map((p, i) => (
                <div className={scss.particularsRow} key={i}>
                  <span>{p.description}</span>
                  <span>{p.quantity}</span>
                  <span>{formatNumber(p.unit_price)}</span>
                  <span>{formatNumber(p.amount)}</span>
                </div>
              )) : (
                <div className={scss.particularsEmpty}>No particulars recorded</div>
              )}

              <div className={scss.subtotalRow}>
                <span>Total Amount</span>
                <strong>{formatNumber(sale.particulars?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0))}</strong>
              </div>
            </div>
          </div>

          <div className={scss.panel}>
            <SectionHeader title="Tax Details" />

            <div className={scss.fieldGrid}>
              <ReadOnlyField label="VAT Type" value={sale.vat_type === 'INCLUSIVE' ? 'VAT Inclusive' : sale.vat_type === 'EXCLUSIVE' ? 'VAT Exclusive' : sale.vat_type} span={12} />
            </div>

            <SectionHeader title="Sales Breakdown" />
            <div className={scss.fieldGrid}>
              <ReadOnlyField label="Exempt Sales" value={formatNumber(sale.exempt_sales)} span={3} />
              <ReadOnlyField label="Zero Rated Sales" value={formatNumber(sale.zero_rated_sales)} span={3} />
              <ReadOnlyField label="Vatable Sales" value={formatNumber(sale.vatable_sales)} span={3} />
              <ReadOnlyField label="Gross Amount" value={formatNumber(sale.gross_amount)} span={3} />
            </div>
            <div className={scss.fieldGrid}>
              {/* Stored as a fraction (0.12), not a percentage — ×100 to show "12%" instead of "0.1200%". */}
              <ReadOnlyField label="VAT Rate" value={sale.vat_rate != null ? `${(Number(sale.vat_rate) * 100).toFixed(0)}%` : undefined} span={3} />
              <ReadOnlyField label="VAT Amount" value={formatNumber(sale.vat_amount)} span={3} />
              <ReadOnlyField label="Gross Taxable" value={formatNumber(sale.gross_taxable)} span={3} />
              <ReadOnlyField label="Total Gross Amount" value={formatNumber(sale.total_gross_amount)} span={3} />
            </div>

            {hasWithholding && (
              <>
                <hr className={scss.divider} />
                <SectionHeader title="Withholding Tax" />
                <div className={scss.fieldGrid}>
                  <ReadOnlyField label="ATC" value={sale.atc} span={4} />
                  <ReadOnlyField label="EWT Rate" value={sale.ewt_rate != null ? `${sale.ewt_rate}%` : undefined} span={4} />
                  <ReadOnlyField label="Tax Amount" value={formatNumber(sale.tax_amount)} span={4} />
                </div>
              </>
            )}

            <hr className={scss.divider} />

            {/* Every BIR-compliant invoice ends in a final Amount Due line
             * on the Add form — Total Gross Amount less withholding (the
             * discount peso amount itself isn't a stored column, only its
             * effect baked into the sales breakdown above, so it can't be
             * subtracted again here without double-counting). */}
            <div className={scss.fieldGrid}>
              <ReadOnlyField
                label="Total Amount Due"
                value={formatNumber(Number(sale.total_gross_amount || 0) - (hasWithholding ? Number(sale.tax_amount || 0) : 0))}
                span={12}
              />
            </div>
          </div>
        </>
      )}
    </div>
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

ViewSalesRecord_V.getLayout = (page: ReactElement) => <CMS_Layout spacious>{page}</CMS_Layout>

export default ViewSalesRecord_V

import dayjs from 'dayjs'
import Link from 'next/link'
import scss from '../styles/Sales.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import useSalesManual from '@/controllers/salesManual/useSalesManual'
import SuccessMessage from '@/components/reusables/SuccessMessage'
import RowActionsMenu from '@/components/reusables/RowActionsMenu'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import ColumnFilterTable, { ColumnFilterTableColumn } from '@/components/reusables/ColumnFilterTable'

interface ManualSalesRow {
  id: number
  status: 'draft' | 'posted'
  terms?: string
  tin?: string
  classification?: string
  customer_name?: string
  invoice_number?: string
  invoice_date?: string
  taxable_month?: string
  total_gross_amount?: number
  vat_amount?: number
  gross_taxable?: number
}

const SalesManual_V = () => {
  const {
    message,
    search,
    currentPage,
    recordsLimit,

    salesArr,
    totalSales,
    salesLoader,

    handleBlur,
    handleResubmit,
    handleSearch,
    handlePageChange,
    handleDeleteRecord,
    handleSubmitSearch,
  } = useSalesManual()

  const formatNumber = (value: number) =>
    Number(value || 0).toLocaleString(navigator.language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  const dataSource: ManualSalesRow[] = salesArr?.length ? salesArr.map((sale: any) => ({
    id: sale.id,
    status: sale.status === 'posted' ? 'posted' : 'draft',
    terms: sale.terms,
    tin: sale.customer?.tin,
    classification: sale.customer?.classification,
    customer_name: sale.customer?.classification === 'NON-INDIVIDUAL'
      ? sale.customer?.registered_name
      : [sale.customer?.first_name, sale.customer?.last_name].filter(Boolean).join(' '),
    invoice_number: sale.invoice_number,
    invoice_date: sale.invoice_date ? dayjs(sale.invoice_date).format('MM/DD/YYYY') : '',
    taxable_month: sale.taxable_month ? dayjs(sale.taxable_month).format('YYYY-MM') : '',
    total_gross_amount: Number(sale.total_gross_amount || 0),
    vat_amount: Number(sale.vat_amount || 0),
    gross_taxable: Number(sale.gross_taxable || 0),
  })) : []

  // Only Invoice No. is pinned left and Actions pinned right — everything
  // else (including the other always-shown columns) scrolls normally, so
  // pinning doesn't eat into the scrollable width for no reason. Taxable
  // Month/Terms/TIN/Vatable Sales/VAT Amount/Total Gross Amount are hidden
  // until picked from the Columns dropdown, appended in the order clicked.
  const columns: ColumnFilterTableColumn<ManualSalesRow>[] = [
    { key: 'invoice_number', title: 'Invoice No.', dataIndex: 'invoice_number', frozen: 'left' },
    { key: 'invoice_date', title: 'Invoice Date', dataIndex: 'invoice_date' },
    { key: 'customer_name', title: 'Customer', dataIndex: 'customer_name' },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (value: 'draft' | 'posted') => (
        <span style={{
          display: 'inline-block',
          padding: '2px 10px',
          borderRadius: '10px',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          color: value === 'posted' ? '#135200' : '#874d00',
          backgroundColor: value === 'posted' ? '#d9f7be' : '#fff1b8',
        }}>
          {value}
        </span>
      ),
    },
    {
      key: 'classification',
      title: 'Classification',
      dataIndex: 'classification',
      render: (value: string) => value ? value.charAt(0) + value.slice(1).toLowerCase() : '',
    },

    { key: 'taxable_month', title: 'Taxable Month', dataIndex: 'taxable_month', optional: true },
    { key: 'terms', title: 'Terms', dataIndex: 'terms', optional: true },
    { key: 'tin', title: 'TIN', dataIndex: 'tin', optional: true },
    { key: 'gross_taxable', title: 'Vatable Sales', dataIndex: 'gross_taxable', render: formatNumber, optional: true },
    { key: 'vat_amount', title: 'VAT Amount', dataIndex: 'vat_amount', render: formatNumber, optional: true },
    { key: 'total_gross_amount', title: 'Total Gross Amount', dataIndex: 'total_gross_amount', render: formatNumber, optional: true },

    {
      key: 'actions',
      title: 'Actions',
      width: 80,
      align: 'center',
      frozen: 'right',
      render: (_: unknown, record: ManualSalesRow) =>
        <RowActionsMenu
          actions={[
            ...(record.status === 'draft' ? [{
              label: 'Resume',
              href: `/bookkeeper/books_of_accounts/sales/add?draft=${record.id}`,
            }] : []),
            {
              label: 'Delete',
              danger: true,
              onClick: () => handleDeleteRecord(record.id),
              confirm: {
                title: 'Delete the record',
                description: 'Are you sure to delete this record?',
              },
            },
          ]}
        />
    },
  ]

  return (
    <div>
      {message && <SuccessMessage message={message} />}
      <div className={scss.header}>
        <Link href='/bookkeeper/books_of_accounts/sales/add' className={scss.button + ' ' + scss.btnblue}>
          Add Record
        </Link>
        <form className={scss.searchComponent} onSubmit={handleSubmitSearch}>
          <input
            id='search'
            type='text'
            name='search'
            maxLength={50}
            autoComplete='search'
            placeholder='Search by TIN, Name or Invoice Number...'
            value={search}
            onKeyUp={handleBlur}
            onChange={handleSearch}
          />
          <button type='submit' className={`${scss.button} ${scss.btnblue}`} onKeyDown={handleResubmit}>
            Search
          </button>
        </form>
      </div>
      <div className={scss.tableRecords}>
        {salesLoader && <Loader scss={scss} position='absolute' />}
        <ColumnFilterTable
          rowKey='id'
          columns={columns}
          dataSource={dataSource}
          pagination={{
            current: currentPage,
            pageSize: recordsLimit,
            total: totalSales,
            onChange: handlePageChange,
          }}
        />
      </div>
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
export default SalesManual_V;

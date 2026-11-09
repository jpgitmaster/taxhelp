import dayjs from 'dayjs'
import Link from 'next/link'
import scss from '../styles/Sales.module.scss'
import type { ColumnsType } from 'antd/es/table'
import { Table, Pagination, Popconfirm } from 'antd'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import useSalesManual from '@/controllers/salesManual/useSalesManual'
import SuccessMessage from '@/components/reusables/SuccessMessage'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

interface ManualSalesRow {
  id: number
  status: 'draft' | 'posted'
  terms?: string
  tin?: string
  registered_name?: string
  individual_name?: string
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
    registered_name: sale.customer?.registered_name,
    individual_name:
      (sale.customer?.first_name ? sale.customer.first_name + ' ' : '') +
      (sale.customer?.last_name ? sale.customer.last_name : ''),
    invoice_number: sale.invoice_number,
    invoice_date: sale.invoice_date ? dayjs(sale.invoice_date).format('MM/DD/YYYY') : '',
    taxable_month: sale.taxable_month ? dayjs(sale.taxable_month).format('YYYY-MM') : '',
    total_gross_amount: Number(sale.total_gross_amount || 0),
    vat_amount: Number(sale.vat_amount || 0),
    gross_taxable: Number(sale.gross_taxable || 0),
  })) : []

  const columns: ColumnsType<ManualSalesRow> = [
    {
      title: 'Status',
      key: 'status',
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
    { title: 'Taxable Month', key: 'taxable_month', dataIndex: 'taxable_month' },
    { title: 'Invoice Date', key: 'invoice_date', dataIndex: 'invoice_date' },
    { title: 'Invoice No.', key: 'invoice_number', dataIndex: 'invoice_number' },
    { title: 'Terms', key: 'terms', dataIndex: 'terms' },
    { title: 'TIN', key: 'tin', dataIndex: 'tin' },
    { title: 'Registered Name', key: 'registered_name', dataIndex: 'registered_name' },
    { title: 'Individual Name', key: 'individual_name', dataIndex: 'individual_name' },
    { title: 'Vatable Sales', key: 'gross_taxable', dataIndex: 'gross_taxable', render: formatNumber },
    { title: 'VAT Amount', key: 'vat_amount', dataIndex: 'vat_amount', render: formatNumber },
    { title: 'Total Gross Amount', key: 'total_gross_amount', dataIndex: 'total_gross_amount', render: formatNumber },
    {
      width: 160,
      fixed: 'right',
      title: 'Actions',
      align: 'center',
      render: (record: ManualSalesRow) =>
        <div className={scss.actions}>
          {
            record.status === 'draft' &&
            <Link
              href={`/bookkeeper/books_of_accounts/sales/add?draft=${record.id}`}
              className={scss.action + ' ' + scss.edit}
            >
              Resume
            </Link>
          }
          <Popconfirm
            title="Delete the record"
            description="Are you sure to delete this record?"
            onConfirm={() => handleDeleteRecord(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <button type='button' className={scss.action + ' ' + scss.delete}>
              Delete
            </button>
          </Popconfirm>
        </div>
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
        <Table
          rowKey='id'
          columns={columns}
          pagination={false}
          dataSource={dataSource}
          scroll={{ x: 'max-content', y: 60 * 5 }}
        />
      </div>
      <Pagination
        current={currentPage}
        pageSize={recordsLimit}
        total={totalSales}
        onChange={handlePageChange}
        showSizeChanger={false}
      />
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

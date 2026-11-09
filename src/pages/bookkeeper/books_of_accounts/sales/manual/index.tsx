import dayjs from 'dayjs'
import Link from 'next/link'
import { ReactElement } from 'react'
import { DatePicker } from 'antd'
import { signOut, getSession } from 'next-auth/react'
import useSalesManual from '@/controllers/salesManual/useSalesManual'
import FilterBar from '@/components/reusables/FilterBar'
import ListToolbar from '@/components/reusables/ListToolbar'
import CMS_Layout from '@/components/layouts/CMS_Layout'
import SuccessMessage from '@/components/reusables/SuccessMessage'
import RowActionsMenu from '@/components/reusables/RowActionsMenu'
import CustomContainer from '@/components/reusables/CustomContainer'
import filterFieldScss from '@/components/reusables/styles/FilterField.module.scss'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import ClientsDropdown from '@/components/pages/bookkeeper/documents/ClientsDropdown'
import ColumnFilterTable, { ColumnFilterTableColumn } from '@/components/reusables/ColumnFilterTable'
import type { NextPageWithLayout } from '@/pages/_app'

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

const SalesManual_V: NextPageWithLayout = () => {
  const {
    doc,
    message,
    search,
    currentPage,
    recordsLimit,
    tableWidth,

    clientArr,
    displayClients,
    clientLoader,

    salesArr,
    totalSales,
    salesLoader,

    setDisplayClients,

    handleBlur,
    handleToggle,
    handleChange,
    handleSearch,
    handleDateChange,
    handlePageChange,
    handlePageSizeChange,
    handleDeleteRecord,
    handleSelectClient,
    handleSubmitSearch,
    handleClearSelected,
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
  // Every column gets an explicit width so adding an optional column never
  // shrinks the existing ones — the table just gets wider and scrolls.
  const columns: ColumnFilterTableColumn<ManualSalesRow>[] = [
    { key: 'invoice_number', title: 'Invoice No.', dataIndex: 'invoice_number', width: 110, frozen: 'left', sorter: true },
    { key: 'invoice_date', title: 'Invoice Date', dataIndex: 'invoice_date', width: 120, sorter: true },
    { key: 'customer_name', title: 'Customer', dataIndex: 'customer_name', width: 260, sorter: true },
    {
      key: 'classification',
      title: 'Classification',
      dataIndex: 'classification',
      width: 130,
      sorter: true,
      render: (value: string) => value ? value.charAt(0) + value.slice(1).toLowerCase() : '',
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      width: 110,
      sorter: true,
      render: (value: 'draft' | 'posted') => (
        <span style={{
          display: 'inline-block',
          padding: '4px 14px',
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '.03em',
          textTransform: 'uppercase',
          color: '#fff',
          backgroundColor: value === 'posted' ? '#52c41a' : '#fa8c16',
        }}>
          {value}
        </span>
      ),
    },

    { key: 'taxable_month', title: 'Taxable Month', dataIndex: 'taxable_month', width: 130, optional: true },
    { key: 'terms', title: 'Terms', dataIndex: 'terms', width: 100, optional: true },
    { key: 'tin', title: 'TIN', dataIndex: 'tin', width: 140, optional: true },
    { key: 'gross_taxable', title: 'Vatable Sales', dataIndex: 'gross_taxable', width: 140, render: formatNumber, optional: true },
    { key: 'vat_amount', title: 'VAT Amount', dataIndex: 'vat_amount', width: 130, render: formatNumber, optional: true },
    { key: 'total_gross_amount', title: 'Total Gross Amount', dataIndex: 'total_gross_amount', width: 160, render: formatNumber, optional: true },

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
              icon: '/svgs/edit.svg',
              href: `/bookkeeper/books_of_accounts/sales/add?draft=${record.id}`,
            }] : []),
            {
              label: 'Delete',
              icon: '/svgs/delete.svg',
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

      <FilterBar>
        <CustomContainer scss={filterFieldScss} width={33} label="Filter by Client">
          <ClientsDropdown
            doc={doc}
            clients={clientArr}
            loader={clientLoader}
            displayClients={displayClients}
            setDisplayClients={setDisplayClients}
            handleChange={handleChange}
            handleToggle={handleToggle}
            handleSelectClient={handleSelectClient}
            handleClearSelected={handleClearSelected}
          />
        </CustomContainer>
        <CustomContainer scss={filterFieldScss} width={33} label="Taxable Month Range">
          <DatePicker
            placeholder="Month - Year From"
            picker="month"
            value={doc.taxable_month_from}
            onChange={(date) => handleDateChange(date, 'taxable_month_from')}
          />
          &nbsp;&nbsp;
          <DatePicker
            placeholder="Month - Year To"
            picker="month"
            disabled={!doc.taxable_month_from}
            value={doc.taxable_month_to}
            onChange={(date) => handleDateChange(date, 'taxable_month_to')}
          />
        </CustomContainer>
      </FilterBar>

      <ListToolbar
        action={
          <Link href='/bookkeeper/books_of_accounts/sales/add'>
            + Add Record
          </Link>
        }
        search={{
          value: search,
          placeholder: 'Search by TIN, Name or Invoice Number...',
          onChange: handleSearch,
          onKeyUp: handleBlur,
          onSubmit: handleSubmitSearch,
        }}
      />

      <ColumnFilterTable
        rowKey='id'
        columns={columns}
        dataSource={dataSource}
        loading={salesLoader}
        width={tableWidth || undefined}
        pagination={{
          current: currentPage,
          pageSize: recordsLimit,
          total: totalSales,
          onChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
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

SalesManual_V.getLayout = (page: ReactElement) => <CMS_Layout spacious>{page}</CMS_Layout>

export default SalesManual_V;

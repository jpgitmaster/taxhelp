import dayjs from 'dayjs'
import Link from 'next/link'
import { ReactElement, useState } from 'react'
import { DatePicker } from 'antd'
import { signOut, getSession } from 'next-auth/react'
import useSalesManual from '@/controllers/salesManual/useSalesManual'
import ListToolbar from '@/components/reusables/ListToolbar'
import ActiveFilterChips from '@/components/reusables/ActiveFilterChips'
import CMS_Layout from '@/components/layouts/CMS_Layout'
import SuccessMessage from '@/components/reusables/SuccessMessage'
import RowActionsMenu from '@/components/reusables/RowActionsMenu'
import ColumnsDropdownButton from '@/components/reusables/ColumnsDropdownButton'
import FilterPopoverButton from '@/components/reusables/FilterPopoverButton'
import filterPopoverScss from '@/components/reusables/styles/FilterPopoverButton.module.scss'
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
  const [selectedOptionalKeys, setSelectedOptionalKeys] = useState<string[]>([])
  const toggleOptionalColumn = (key: string) => {
    setSelectedOptionalKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const {
    doc,
    message,
    search,
    currentPage,
    recordsLimit,
    tableWidth,
    sortBy,
    sortOrder,
    appliedFilters,

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
    handleApplyFilters,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
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

  const columns: ColumnFilterTableColumn<ManualSalesRow>[] = [
    { key: 'invoice_number', title: 'Invoice No.', dataIndex: 'invoice_number', flexible: true, minWidth: 130, frozen: 'left', sorter: true },
    { key: 'invoice_date', title: 'Invoice Date', dataIndex: 'invoice_date', flexible: true, minWidth: 150, sorter: true },
    { key: 'tin', title: 'TIN', dataIndex: 'tin', flexible: true, minWidth: 140, sorter: true },
    { key: 'customer_name', title: 'Customer', dataIndex: 'customer_name', flexible: true, minWidth: 260, sorter: true },
    {
      key: 'classification',
      title: 'Classification',
      dataIndex: 'classification',
      flexible: true,
      minWidth: 160,
      sorter: true,
      render: (value: string) => value ? value.charAt(0) + value.slice(1).toLowerCase() : '',
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      flexible: true,
      minWidth: 110,
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

    { key: 'taxable_month', title: 'Taxable Month', dataIndex: 'taxable_month', flexible: true, minWidth: 160, sorter: true, optional: true },
    { key: 'terms', title: 'Terms', dataIndex: 'terms', flexible: true, minWidth: 100, sorter: true, optional: true },
    { key: 'gross_taxable', title: 'Vatable Sales', dataIndex: 'gross_taxable', flexible: true, minWidth: 140, sorter: true, render: formatNumber, optional: true },
    { key: 'vat_amount', title: 'VAT Amount', dataIndex: 'vat_amount', flexible: true, minWidth: 130, sorter: true, render: formatNumber, optional: true },
    { key: 'total_gross_amount', title: 'Total Gross Amount', dataIndex: 'total_gross_amount', flexible: true, minWidth: 160, sorter: true, render: formatNumber, optional: true },

    {
      key: 'actions',
      title: 'Actions',
      flexible: true,
      minWidth: 80,
      align: 'center',
      frozen: 'right',
      render: (_: unknown, record: ManualSalesRow) =>
        <RowActionsMenu
          actions={[
            ...(record.status === 'draft' ? [{
              label: 'Resume',
              icon: '/svgs/edit.svg',
              href: `/bookkeeper/books_of_accounts/sales/add?draft=${record.id}`,
            }] : [{
              label: 'View',
              icon: '/svgs/eyecon.svg',
              href: `/bookkeeper/books_of_accounts/sales/view?id=${record.id}`,
            }]),
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

      <ActiveFilterChips
        chips={[
          ...(appliedFilters.clientId ? [{
            key: 'client',
            label: `Client: ${doc.client.registered_name || [doc.client.first_name, doc.client.last_name].filter(Boolean).join(' ')}`,
            onClear: () => handleClearSelected('client'),
          }] : []),
          ...(appliedFilters.taxableMonthFrom ? [{
            key: 'taxable_month',
            label: `Taxable Month: ${appliedFilters.taxableMonthFrom}${appliedFilters.taxableMonthTo ? ` – ${appliedFilters.taxableMonthTo}` : ''}`,
            onClear: () => handleClearSelected('taxable_month'),
          }] : []),
          ...(appliedFilters.invoiceDateFrom ? [{
            key: 'invoice_date',
            label: `Invoice Date: ${appliedFilters.invoiceDateFrom}${appliedFilters.invoiceDateTo ? ` – ${appliedFilters.invoiceDateTo}` : ''}`,
            onClear: () => handleClearSelected('invoice_date'),
          }] : []),
          ...(appliedFilters.status ? [{
            key: 'status',
            label: `Status: ${appliedFilters.status.charAt(0).toUpperCase() + appliedFilters.status.slice(1)}`,
            onClear: () => handleClearSelected('status'),
          }] : []),
          ...(appliedFilters.tin ? [{
            key: 'tin',
            label: `TIN: ${appliedFilters.tin}`,
            onClear: () => handleClearSelected('tin'),
          }] : []),
        ]}
      />

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
        extra={
          <>
            <FilterPopoverButton
              active={!!(appliedFilters.clientId || appliedFilters.taxableMonthFrom || appliedFilters.invoiceDateFrom || appliedFilters.status || appliedFilters.tin)}
              onSearch={handleApplyFilters}
              onClear={() => {
                handleClearSelected('client')
                handleClearSelected('taxable_month')
                handleClearSelected('invoice_date')
                handleClearSelected('status')
                handleClearSelected('tin')
              }}
            >
              <div className={filterPopoverScss.fieldRow}>
                <span className={filterPopoverScss.fieldLabel}>Client</span>
                <div className={filterPopoverScss.fieldValue}>
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
                </div>
              </div>
              <div className={filterPopoverScss.fieldRow}>
                <span className={filterPopoverScss.fieldLabel}>Status</span>
                <div className={filterPopoverScss.fieldValue}>
                  <select
                    name="status"
                    value={doc.status}
                    onChange={handleChange}
                    className={filterPopoverScss.select}
                  >
                    <option value="">All</option>
                    <option value="draft">Draft</option>
                    <option value="posted">Posted</option>
                  </select>
                </div>
              </div>
              <div className={filterPopoverScss.fieldRow}>
                <span className={filterPopoverScss.fieldLabel}>TIN</span>
                <div className={filterPopoverScss.fieldValue}>
                  <input
                    type="text"
                    name="tin"
                    placeholder="000-000-000"
                    value={doc.tin}
                    onChange={handleChange}
                    className={filterPopoverScss.textInput}
                  />
                </div>
              </div>
              <div className={filterPopoverScss.fieldRow}>
                <span className={filterPopoverScss.fieldLabel}>Taxable Month</span>
                <div className={filterPopoverScss.fieldValue}>
                  <DatePicker
                    placeholder="MM/YYYY"
                    picker="month"
                    value={doc.taxable_month_from}
                    onChange={(date) => handleDateChange(date, 'taxable_month_from')}
                  />
                  <DatePicker
                    placeholder="MM/YYYY"
                    picker="month"
                    disabled={!doc.taxable_month_from}
                    value={doc.taxable_month_to}
                    onChange={(date) => handleDateChange(date, 'taxable_month_to')}
                  />
                </div>
              </div>
              <div className={filterPopoverScss.fieldRow}>
                <span className={filterPopoverScss.fieldLabel}>Invoice Date</span>
                <div className={filterPopoverScss.fieldValue}>
                  <DatePicker
                    placeholder="Date From"
                    value={doc.invoice_date_from}
                    onChange={(date) => handleDateChange(date, 'invoice_date_from')}
                  />
                  <DatePicker
                    placeholder="Date To"
                    disabled={!doc.invoice_date_from}
                    value={doc.invoice_date_to}
                    onChange={(date) => handleDateChange(date, 'invoice_date_to')}
                  />
                </div>
              </div>
            </FilterPopoverButton>
            <ColumnsDropdownButton
              options={columns.filter(c => c.optional).map(c => ({ key: c.key, title: c.title }))}
              selectedKeys={selectedOptionalKeys}
              onToggle={toggleOptionalColumn}
            />
          </>
        }
      />

      <ColumnFilterTable
        rowKey='id'
        columns={columns}
        dataSource={dataSource}
        loading={salesLoader}
        width={tableWidth || undefined}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        selectedOptionalKeys={selectedOptionalKeys}
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

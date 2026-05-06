import dayjs from 'dayjs'
import Link from 'next/link'
import Image from 'next/image'
import scss from './styles/Sales.module.scss'
import type { ColumnsType } from 'antd/es/table'
import useSales from '@/controllers/sales/useSales'
import { signOut, getSession } from 'next-auth/react'
import { SalesTableRow } from '@/controllers/sales/types'
import Loader from '@/components/reusables/RotatingLoader'
import { Table, Pagination, DatePicker, Popconfirm } from 'antd'
import SuccessMessage from '@/components/reusables/SuccessMessage'
import CustomContainer from '@/components/reusables/CustomContainer'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import ClientsDropdown from '@/components/pages/bookkeeper/documents/ClientsDropdown'
import DocumentsDropdown from '@/components/pages/bookkeeper/documents/DocumentsDropdown'

const Sales_V = () => {
  const {
    doc,
    sales,
    status,
    clientArr,
    tableWidth,
    salesFilter,
    salesloader,
    documentArr,
    rowSelection,
    clientLoader,
    documentLoader,
    displayClients,
    selectedRowKeys,
    displayDocuments,
    
    setDisplayClients,
    setDisplayDocuments,
    
    handleBlur,
    handleChange,
    handleToggle,
    handleSearch,
    handleResubmit,
    handleDateChange,
    handlePageChange,
    handleToggleDelete,
    handleSelectClient,
    handleDeleteRecord,
    handleSubmitSearch,
    handleClearSelected,
    handleSelectDocument,
  } = useSales()
  const { message } = status
  const { salesArr } = sales
  // console.log(salesArr)
  const dataSource = salesArr?.length ? salesArr.map(sales => (
      {
        id: sales.id,
        atc: sales.atc,
        terms: sales.terms,
        toDelete: sales.toDelete,
        ewt_rate: sales.ewt_rate,
        vat_rate: sales.vat_rate,
        tax_amount: sales.tax_amount,
        vat_amount: sales.vat_amount,
        particulars: sales.particulars,
        exempt_sales: sales.exempt_sales,
        account_name: sales.account_name,
        tin: sales.customer?.tin,
        gross_amount: sales.gross_amount,
        gross_taxable: sales.gross_taxable,
        vatable_sales: sales.vatable_sales,
        invoice_number: sales.invoice_number,
        zero_rated_sales: sales.zero_rated_sales,
        branch_code: sales.customer?.branch_code,
        first_address: sales.customer?.first_address,
        second_address: sales.customer?.second_address,
        registered_name: sales.customer?.registered_name,
        created_date: sales.created_at ? dayjs(sales.created_at)?.format('MM/DD/YYYY') : '',
        invoice_date: sales.invoice_date ? dayjs(sales.invoice_date)?.format('MM/DD/YYYY') : '',
        taxable_month: sales.taxable_month ? dayjs(sales.taxable_month)?.format('MM/DD/YYYY') : '',
        business_owner: 
          (sales.customer?.first_name ? sales.customer.first_name+' ' : '')+
          (sales.customer?.middle_name ? sales.customer.middle_name+' ' : '')+
          (sales.customer?.last_name ? sales.customer.last_name : ''),
      }
  )) : []
  const columns: ColumnsType<SalesTableRow> = [
    {
      title: 'Taxable Month',
      key: 'taxable_month',
      dataIndex: 'taxable_month',
      render: (value) => dayjs(value)?.format('YYYY-MM'),
    },
    // {
    //   title: 'Invoice Date',
    //   key: 'invoice_date',
    //   dataIndex: 'invoice_date',
    // },
    // {
    //   title: 'Invoice No.',
    //   key: 'invoice_number',
    //   dataIndex: 'invoice_number',
    // },
    {
      title: 'TIN No.',
      key: 'tin',
      dataIndex: 'tin',
    },
    {
      title: 'Branch Code',
      key: 'branch_code',
      dataIndex: 'branch_code',
    },
    {
      title: 'Registered Name',
      key: 'registered_name',
      dataIndex: 'registered_name',
    },
    {
      title: 'Business Owner',
      key: 'business_owner',
      dataIndex: 'business_owner',
    },
    {
      title: 'Address 1',
      key: 'first_address',
      dataIndex: 'first_address',
    },
    {
      title: 'Address 2',
      key: 'second_address',
      dataIndex: 'second_address',
    },
    // {
    //   title: 'Particulars',
    //   key: 'particulars',
    //   dataIndex: 'particulars',
    // },
    // {
    //   title: 'Terms',
    //   key: 'terms',
    //   dataIndex: 'terms',
    // },
    // {
    //   title: 'Account Name',
    //   key: 'account_name',
    //   dataIndex: 'account_name',
    // },
    {
      title: 'Exempt Sales',
      key: 'exempt_sales',
      dataIndex: 'exempt_sales',
    },
    {
      title: 'Zero Rated Sales',
      key: 'zero_rated_sales',
      dataIndex: 'zero_rated_sales',
    },
    {
      title: 'Vatable Sales',
      key: 'vatable_sales',
      dataIndex: 'vatable_sales',
    },
    {
      title: 'Gross Amount',
      key: 'gross_amount',
      dataIndex: 'gross_amount',
    },
    {
      title: 'VAT Rate',
      key: 'vat_rate',
      dataIndex: 'vat_rate',
    },
    {
      title: 'Vat Amount',
      key: 'vat_amount',
      dataIndex: 'vat_amount',
    },
    {
      title: 'Gross Taxable',
      key: 'gross_taxable',
      dataIndex: 'gross_taxable',
    },
    // {
    //   title: 'ATC',
    //   key: 'atc',
    //   dataIndex: 'atc',
    // },
    // {
    //   title: 'EWT Rate',
    //   key: 'ewt_rate',
    //   dataIndex: 'ewt_rate',
    // },
    // {
    //   title: 'Tax Amount',
    //   key: 'tax_amount',
    //   dataIndex: 'tax_amount',
    // },
    {
      title: 'Created Date',
      key: 'created_date',
      dataIndex: 'created_date',
    },
    {
      width: 100,
      fixed: 'right',
      title: 'Actions',
      align: 'center',
      render: (record: SalesTableRow) =>
          <div className={scss.actions}>
              <Link href={'/bookkeeper/sales/'+record.id} className={scss.action+' '+scss.purchases}>
                  <Image src='/svgs/eyecon_check.svg' alt='Purchases' priority width={22} height={22} unoptimized={true} />
                  <span style={{top: '-2px'}}>
                      View
                  </span>
              </Link>
              <Link href={'/bookkeeper/sales/'+record.id+'/edit'} className={scss.action+' '+scss.edit}>
                  <Image src='/svgs/edit.svg' alt='Edit' priority width={20} height={20} unoptimized={true} />
                  <span>
                      Edit
                  </span>
              </Link>
              <Popconfirm
                title="Delete the record"
                description="Are you sure to delete this record?"
                onConfirm={() => handleDeleteRecord(Number(record.id))}
                onCancel={() => handleToggleDelete(Number(record.id))}
                okText="Yes"
                cancelText="No"
              >
                <button type='button'
                  onClick={() => handleToggleDelete(Number(record.id))}
                  className={scss.action+' '+scss.delete}>
                    <Image src='/svgs/delete.svg' alt='Delete' priority width={18} height={18} unoptimized={true} />
                    <span>
                        Delete
                    </span>
                </button>
              </Popconfirm>
          </div>
    },
  ];
  return (
      <div>
        {
          message &&
          <SuccessMessage message={message} />
        }
        <div className={scss.filters}>
          <div className={scss.cards}>
              <CustomContainer
                  scss={scss}
                  width={33}
                  className={scss.btmDate}
                  label='Filter by Document'
              >
                <DocumentsDropdown
                    doc={doc}
                    documents={documentArr}
                    loader={documentLoader}
                    displayDocuments={displayDocuments}

                    setDisplayDocuments={setDisplayDocuments}

                    handleChange={handleChange}
                    handleToggle={handleToggle}
                    handleClearSelected={handleClearSelected}
                    handleSelectDocument={handleSelectDocument}
                />
              </CustomContainer>
              <CustomContainer
                  scss={scss}
                  width={33}
                  className={scss.btmDate}
                  label='Filter by Client'
              >
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
              <CustomContainer
                  scss={scss}
                  width={33}
                  label='Tax Month Range'
              >
                <DatePicker placeholder='Month - Year From' picker="month" value={doc.tax_month_start} onChange={(e) => handleDateChange(e, 'tax_month_start')} />
                &nbsp;&nbsp;
                <DatePicker disabled={!doc.tax_month_start} placeholder='Month - Year To' picker="month" value={doc.tax_month_end} onChange={(e) => handleDateChange(e, 'tax_month_end')} />
              </CustomContainer>
              <CustomContainer
                  scss={scss}
                  width={33}
                  className={scss.btmDate}
                  label='Invoice Date Range'
              >
                <DatePicker placeholder='Date From' value={doc.invoice_date_start} onChange={(e) => handleDateChange(e, 'invoice_date_start')} />
                &nbsp;&nbsp;
                <DatePicker disabled={!doc.invoice_date_start} placeholder='Date To' value={doc.invoice_date_end} onChange={(e) => handleDateChange(e, 'invoice_date_end')} />
              </CustomContainer>
              <CustomContainer
                  scss={scss}
                  width={33}
                  className={scss.btmDate}
                  label='Created Date Range'
              >
                <DatePicker placeholder='Date From' value={doc.created_date_start} onChange={(e) => handleDateChange(e, 'created_date_start')} />
                &nbsp;&nbsp;
                <DatePicker disabled={!doc.created_date_start} placeholder='Date To' value={doc.created_date_end} onChange={(e) => handleDateChange(e, 'created_date_end')} />
              </CustomContainer>
              <div className={scss.card+' '+scss.w33}></div>
          </div>
        </div>
        <div className={scss.header}>
          <Link href='/bookkeeper/sales/add' className={scss.button+' '+scss.btnblue}>
            Add Record
          </Link>
          <button
              type='button'
              className={scss.button + ' ' + scss.btnred}
              // onClick={handleDeleteSelected}
              disabled={!selectedRowKeys.length}
          >
              Delete Selected
          </button>
          <form className={scss.searchComponent}
            onSubmit={handleSubmitSearch}
          >
              <input id='search' type='text' name='search' maxLength={50} autoComplete='search' placeholder='Search by TIN, Name or Invoice Number...'
                  value={doc.search} onKeyUp={handleBlur} onChange={handleSearch}
              />
              <button type='submit' className={`${scss.button} ${scss.btnblue}`}
                  onKeyDown={handleResubmit}
              >
              Search
              </button>
          </form>
        </div>
        <div className={scss.tableRecords} style={{width:tableWidth+'px'}}>
            { salesloader && <Loader scss={scss} position='absolute' />}
            <Table
                rowKey='id'
                columns={columns}
                pagination={false}
                dataSource={dataSource}
                rowClassName={(record) =>
                  record.toDelete ? scss.activeRow : ''
                }
                rowSelection={rowSelection}
                scroll={{ x: 'max-content', y: 60 * 5 }}
            />
        </div>
        <div className={scss.pagination}>
            {
                sales.totalSales != 0 &&
                <div className={scss.total_records}>
                {'Total Document'+ (sales.totalSales > 1 ? 's' : '')}: <strong>{sales.totalSales}</strong>
                </div>
            }
            <div className={scss.paginationComponent}>
                {
                sales.totalSales ?
                <Pagination
                  current={salesFilter.currentPage}
                  pageSize={salesFilter.recordsLimit}
                  total={sales.totalSales}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
                : ''
                }
            </div>
        </div>
        <br />
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
export default Sales_V;
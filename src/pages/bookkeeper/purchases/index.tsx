import dayjs from 'dayjs'
import Link from 'next/link'
import Image from 'next/image'
import type { ColumnsType } from 'antd/es/table'
import scss from './styles/Purchases.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import usePurchases from '@/controllers/purchases/usePurchases'
import { Table, Pagination, DatePicker, Popconfirm } from 'antd'
import { PurchasesTableRow } from '@/controllers/purchases/types'
import SuccessMessage from '@/components/reusables/SuccessMessage'
import CustomContainer from '@/components/reusables/CustomContainer'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import ClientsDropdown from '@/components/pages/bookkeeper/documents/ClientsDropdown'
import DocumentsDropdown from '@/components/pages/bookkeeper/documents/DocumentsDropdown'

const Purchases_V = () => {
  const {
    doc,
    status,
    purchases,
    clientArr,
    tableWidth,
    documentArr,
    rowSelection,
    clientLoader,
    documentLoader,
    displayClients,
    purchasesFilter,
    purchasesLoader,
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
  } = usePurchases()
  const { message } = status
  const { purchasesArr } = purchases
  // console.log(purchasesArr)
  const dataSource = purchasesArr?.length ? purchasesArr.map(purchases => (
      {
        id: purchases.id,
        atc: purchases.atc,
        terms: purchases.terms,
        toDelete: purchases.toDelete,
        vat_rate: purchases.vat_rate,
        wtax_rate: purchases.wtax_rate,
        vat_amount: purchases.vat_amount,
        wtax_amount: purchases.wtax_amount,
        particulars: purchases.particulars,
        tin: purchases.supplier?.tin,
        account_name: purchases.account_name,
        gross_amount: purchases.gross_amount,
        gross_taxable: purchases.gross_taxable,
        invoice_number: purchases.invoice_number,
        exempt_purchases: purchases.exempt_purchases,
        vatable_purchases: purchases.vatable_purchases,
        zero_rated_purchases: purchases.zero_rated_purchases,
        branch_code: purchases.supplier?.branch_code,
        first_address: purchases.supplier?.first_address,
        second_address: purchases.supplier?.second_address,
        registered_name: purchases.supplier?.registered_name,
        vatable_purchase_of_services: purchases.vatable_purchase_of_services,
        vatable_purchase_of_other_goods: purchases.vatable_purchase_of_other_goods,
        vatable_purchase_of_capital_goods: purchases.vatable_purchase_of_capital_goods,
        invoice_date: purchases.invoice_date ? dayjs(purchases.invoice_date)?.format('MM/DD/YYYY') : '',
        taxable_month: purchases.taxable_month ? dayjs(purchases.taxable_month)?.format('MM/DD/YYYY') : '',
        business_owner: 
          (purchases.supplier?.first_name ? purchases.supplier.first_name+' ' : '')+
          (purchases.supplier?.middle_name ? purchases.supplier.middle_name+' ' : '')+
          (purchases.supplier?.last_name ? purchases.supplier.last_name : ''),
      }
  )) : []
  const columns: ColumnsType<PurchasesTableRow> = [
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
      title: 'Exempt Purchases',
      key: 'exempt_purchases',
      dataIndex: 'exempt_purchases',
    },
    {
      title: 'Zero Rated Purchases',
      key: 'zero_rated_purchases',
      dataIndex: 'zero_rated_purchases',
    },
    {
      title: 'Vatable Purchases',
      key: 'vatable_purchases',
      dataIndex: 'vatable_purchases',
    },
    {
      width: 150,
      title: 'Vatable Purchase of Services',
      key: 'vatable_purchase_of_services',
      dataIndex: 'vatable_purchase_of_services',
    },
    {
      width: 150,
      title: 'Vatable Purchase of Capital Goods',
      key: 'vatable_purchase_of_capital_goods',
      dataIndex: 'vatable_purchase_of_capital_goods',
    },
    {
      width: 150,
      title: 'Vatable Purchase of Other Goods',
      key: 'vatable_purchase_of_other_goods',
      dataIndex: 'vatable_purchase_of_other_goods',
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
    //   title: 'W/ Tax Rate',
    //   key: 'wtax_rate',
    //   dataIndex: 'wtax_rate',
    // },
    // {
    //   title: 'W/ Tax Amount',
    //   key: 'wtax_amount',
    //   dataIndex: 'wtax_amount',
    // },
    {
      width: 100,
      fixed: 'right',
      title: 'Actions',
      align: 'center',
      render: (record: PurchasesTableRow) =>
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
          {/* <Link href='/bookkeeper/purchases/add' className={scss.button+' '+scss.btnblue}>
            Add Record
          </Link> */}
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
            { purchasesLoader && <Loader scss={scss} position='absolute' />}
            <Table
                rowKey='id'
                columns={columns}
                pagination={false}
                dataSource={dataSource}
                rowSelection={rowSelection}
                rowClassName={(record) =>
                  record.toDelete ? scss.activeRow : ''
                }
                scroll={{ x: 'max-content', y: 90 * 5 }}
            />
        </div>
        <div className={scss.pagination}>
            {
                purchases.totalPurchases != 0 &&
                <div className={scss.total_records}>
                {'Total Document'+ (purchases.totalPurchases > 1 ? 's' : '')}: <strong>{purchases.totalPurchases}</strong>
                </div>
            }
            <div className={scss.paginationComponent}>
                {
                purchases.totalPurchases ? <Pagination defaultPageSize={purchasesFilter.recordsLimit} total={purchases.totalPurchases} onChange={handlePageChange} />
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
export default Purchases_V;
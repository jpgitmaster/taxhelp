import dayjs from 'dayjs'
import Link from 'next/link'
import Image from 'next/image'
import { useMemo } from 'react'
import type { ColumnsType } from 'antd/es/table'
import scss from './../styles/DatFile.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import { Record_Obj } from '@/controllers/file_generator/types'
import { Table, DatePicker, Pagination, Popconfirm } from 'antd'
import CustomContainer from '@/components/reusables/CustomContainer'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import useFileGenerator from '@/controllers/file_generator/useFileGenerator'
import ClientsDropdown from '@/components/pages/bookkeeper/documents/ClientsDropdown'
import DocumentsTableDropdown from '@/components/pages/bookkeeper/documents/DocumentsTableDropdown'

const DAT_File_V = () => {
    const {
      doc,
      status,
      filter,
      record,
      loader,
      clientArr,
      tableWidth,
      clientLoader,
      displayClients,
      displayDocsTbl,
      datFileOptions,

      setDisplayClients,
      setDisplayDocsTbl,

      handleToggle,
      handleChange,
      handlePageChange,
      handleDateChange,
      handleSelectTable,
      handleToggleDelete,
      handleDeleteRecord,
      handleSelectClient,
      handleDownloadSales,
      handleClearSelected,
      handleDownloadPurchases,
    } = useFileGenerator()
    const { loader: statLoader } = status
    const docType = doc.selectedTable.value
    const actionColumn: ColumnsType<Record_Obj>[number] = {
      width: 100,
      fixed: 'right',
      title: 'Actions',
      align: 'center',
      render: (record: Record_Obj) => (
          <div className={scss.actions}>
              <Link href={'/bookkeeper/clients/' + record.id} className={scss.action + ' ' + scss.purchases}>
                  <Image src='/svgs/eyecon_check.svg' alt='View' width={22} height={22} />
                  <span style={{ top: '-2px' }}>View</span>
              </Link>

              <Link href={'/bookkeeper/clients/' + record.id} className={scss.action + ' ' + scss.edit}>
                  <Image src='/svgs/edit.svg' alt='Edit' width={20} height={20} />
                  <span>Edit</span>
              </Link>

              <Popconfirm
                  title="Delete the record"
                  description="Are you sure to delete this record?"
                  onConfirm={() => handleDeleteRecord(Number(record.id))}
                  onCancel={() => handleToggleDelete(Number(record.id))}
                  okText="Yes"
                  cancelText="No"
              >
                  <button
                      type='button'
                      onClick={() => handleToggleDelete(Number(record.id))}
                      className={scss.action + ' ' + scss.delete}
                  >
                      <Image src='/svgs/delete.svg' alt='Delete' width={18} height={18} />
                      <span>Delete</span>
                  </button>
              </Popconfirm>
          </div>
      )
  }
    const dataSource: Record_Obj[] = record.recordArr?.map(doc => {
      const base = {
        id: doc.id,
        toDelete: false,
        taxable_month: doc.taxable_month,
      }

      if (docType === 'SALES') {
        return {
          ...base,
          customer: doc.customer,
          name:
            (doc.customer?.first_name || '') + ' ' +
            (doc.customer?.middle_name || '') + ' ' +
            (doc.customer?.last_name || ''),
          // exempt_sales: doc.exempt_sales,
          // zero_rated_sales: doc.zero_rated_sales,
          // vatable_sales: doc.vatable_sales,
          // gross_amount: doc.gross_amount,
          // vat_rate: doc.vat_rate,
          // vat_amount: doc.vat_amount,
          // gross_taxable: doc.gross_taxable,
        }
      }

      if (docType === 'PURCHASES') {
        return {
          ...base,
          supplier: doc.supplier,
          name:
            (doc.supplier?.first_name || '') + ' ' +
            (doc.supplier?.middle_name || '') + ' ' +
            (doc.supplier?.last_name || ''),
          // exempt_purchases: doc.exempt_purchases,
          // zero_rated_purchases: doc.zero_rated_purchases,
          // vatable_services: doc.vatable_services,
          // capital_goods: doc.capital_goods,
          // other_goods: doc.other_goods,
          // gross_amount: doc.gross_amount,
          // vat_rate: doc.vat_rate,
          // vat_amount: doc.vat_amount,
          // gross_taxable: doc.gross_taxable,
        }
      }

      if (docType === 'SAWT' || docType === 'QAP') {
        return {
          ...base,
          // atc_code: doc.atc_code,
          // income_payment: doc.income_payment,
          // tax_rate: doc.tax_rate,
          // tax_withheld: doc.tax_withheld,
        }
      }

      return base
    }) ?? []

    // const columns: ColumnsType<Record_Obj> = [
    //   {
    //     title: 'Taxable Month',
    //     key: 'taxable_month',
    //     dataIndex: 'taxable_month',
    //     render: (value) => dayjs(value)?.format('YYYY-MM'),
    //   },
    //   {
    //     title: 'Invoice Date',
    //     key: 'invoice_date',
    //     dataIndex: 'invoice_date',
    //     render: (value) => dayjs(value)?.format('M/DD/YYYY'),
    //   },
    //   {
    //     title: 'TIN Number',
    //     key: 'tin',
    //     dataIndex: 'business_profile',
    //     render: (bp) => bp?.tin,
    //   },
    //   {
    //     title: 'Branch Code',
    //     key: 'branch_code',
    //     dataIndex: 'business_profile',
    //     render: (bp) => bp?.branch_code,
    //   },
    //   {
    //     title: 'Registered Name',
    //     key: 'registered_name',
    //     dataIndex: 'business_profile',
    //     render: (bp) => bp?.registered_name,
    //   },
    //   {
    //     title: 'Name',
    //     key: 'name',
    //     dataIndex: 'name',
    //   },
    //   {
    //     title: 'Particulars',
    //     key: 'particulars',
    //     dataIndex: 'particulars',
    //   },
    //   {
    //     title: 'Terms',
    //     key: 'terms',
    //     dataIndex: 'terms',
    //   },
    //   {
    //     title: 'Account Name',
    //     key: 'account_name',
    //     dataIndex: 'account_name',
    //   },
    //   {
    //     width: 100,
    //     fixed: 'right',
    //     title: 'Actions',
    //     align: 'center',
    //     render: (record) =>
    //         <div className={scss.actions}>
    //             <Link href={'/bookkeeper/clients/'+record.id} className={scss.action+' '+scss.purchases}>
    //                 <Image src='/svgs/eyecon_check.svg' alt='Purchases' priority width={22} height={22} unoptimized={true} />
    //                 <span style={{top: '-2px'}}>
    //                     View
    //                 </span>
    //             </Link>
    //             <Link href={'/bookkeeper/clients/'+record.id} className={scss.action+' '+scss.edit}>
    //                 <Image src='/svgs/edit.svg' alt='Edit' priority width={20} height={20} unoptimized={true} />
    //                 <span>
    //                     Edit
    //                 </span>
    //             </Link>
    //             <Popconfirm
    //               title="Delete the record"
    //               description="Are you sure to delete this record?"
    //               onConfirm={() => handleDeleteRecord(Number(record.id))}
    //               onCancel={() => handleToggleDelete(Number(record.id))}
    //               okText="Yes"
    //               cancelText="No"
    //             >
    //               <button type='button'
    //                 onClick={() => handleToggleDelete(Number(record.id))}
    //                 className={scss.action+' '+scss.delete}>
    //                   <Image src='/svgs/delete.svg' alt='Delete' priority width={18} height={18} unoptimized={true} />
    //                   <span>
    //                       Delete
    //                   </span>
    //               </button>
    //             </Popconfirm>
    //         </div>
    // },
    // ]

    const getColumns = (): ColumnsType<Record_Obj> => {
        const base = [
            {
                title: 'Taxable Month',
                dataIndex: 'taxable_month',
                render: (value: string) => dayjs(value)?.format('YYYY-MM'),
            },
            {
                title: 'TIN',
                dataIndex: ['business_profile', 'tin'],
            },
            {
                title: 'Branch Code',
                dataIndex: ['business_profile', 'branch_code'],
            },
            {
                title: 'Registered Name',
                dataIndex: ['business_profile', 'registered_name'],
            },
            {
                title: 'Name',
                dataIndex: 'name',
            },
            {
                title: 'Address 1',
                dataIndex: ['business_profile', 'address_one'],
            },
            {
                title: 'Address 2',
                dataIndex: ['business_profile', 'address_two'],
            },
        ]

        switch (doc.selectedTable.value) {
            case 'SALES':
                return [
                    ...base,
                    { title: 'Exempt Sales', dataIndex: 'exempt_sales' },
                    { title: 'Zero-rated Sales', dataIndex: 'zero_rated_sales' },
                    { title: 'Vatable Sales', dataIndex: 'vatable_sales' },
                    { title: 'Gross Amount', dataIndex: 'gross_amount' },
                    { title: 'VAT Rate', dataIndex: 'vat_rate' },
                    { title: 'VAT Amount', dataIndex: 'vat_amount' },
                    { title: 'Gross Taxable', dataIndex: 'gross_taxable' },
                    actionColumn
                ]

            case 'PURCHASES':
                return [
                    ...base,
                    { title: 'Exempt Purchases', dataIndex: 'exempt_purchases' },
                    { title: 'Zero-rated Purchases', dataIndex: 'zero_rated_purchases' },
                    { title: 'Vatable Services', dataIndex: 'vatable_services' },
                    { title: 'Capital Goods', dataIndex: 'capital_goods' },
                    { title: 'Other Goods', dataIndex: 'other_goods' },
                    { title: 'Gross Amount', dataIndex: 'gross_amount' },
                    { title: 'VAT Rate', dataIndex: 'vat_rate' },
                    { title: 'VAT Amount', dataIndex: 'vat_amount' },
                    { title: 'Gross Taxable', dataIndex: 'gross_taxable' },
                    actionColumn
                ]

            case 'SAWT':
            case 'QAP':
                return [
                    ...base,
                    { title: 'ATC Code', dataIndex: 'atc_code' },
                    { title: 'Income Payment', dataIndex: 'income_payment' },
                    { title: 'Tax Rate', dataIndex: 'tax_rate' },
                    { title: 'Tax Withheld', dataIndex: 'tax_withheld' },
                    actionColumn
                ]

            default:
                return [...base, actionColumn]
        }
    }
    const columns = useMemo(() => getColumns(), [doc.selectedTable.value])
    return (
        <div>
            <div className={scss.cards+' '+scss.filters}>
              <CustomContainer
                  scss={scss}
                  width={20}
                  required={true}
                  label='Select Reporting Type'
              >
                <DocumentsTableDropdown
                  doc={doc}
                  options={datFileOptions}
                  displayDocsTbl={displayDocsTbl}
                  setDisplayDocsTbl={setDisplayDocsTbl}
                  handleToggle={handleToggle}
                  handleSelectTable={handleSelectTable}
                />
              </CustomContainer>
              <CustomContainer
                  scss={scss}
                  width={40}
                  required={true}
                  label='Select Client'
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
                  width={20}
                  required={true}
                  label='Taxable Month & Year'
              >
                  <DatePicker picker="month" value={doc.period} onChange={handleDateChange} />
              </CustomContainer>
              <div className={scss.card+' '+scss.w20}>
                <button type='button' disabled={!record.recordArr?.length} className={scss.button+' '+scss.btnblue} onClick={() => {
                  if(doc.selectedTable.value === 'SALES'){
                    handleDownloadSales('dat')
                  }
                  if(doc.selectedTable.value === 'PURCHASES'){
                    handleDownloadPurchases('dat')
                  }
                  if(doc.selectedTable.value === 'QAP'){
                    // handleDownloadPurchases('dat', '1601E')
                  }
                }}>
                    Download DAT File
                </button>
              </div>
          </div>
          <div className={scss.tableRecords} style={{width:tableWidth+'px'}}>
            { (loader || statLoader) && <Loader scss={scss} position='absolute' />}
            <Table
                rowKey='id'
                columns={columns}
                pagination={false}
                dataSource={dataSource}
                scroll={{ x: 'max-content', y: 90 * 5 }}
            />
          </div>
          <div className={scss.pagination}>
            {
              record.totalRecords != 0 &&
              <div className={scss.total_records}>
                {'Total Document'+ (record.totalRecords > 1 ? 's' : '')}: <strong>{record.totalRecords}</strong>
              </div>
            }
            <div className={scss.paginationComponent}>
              {
                record.totalRecords ? 
                <Pagination
                  current={filter.currentPage}
                  pageSize={filter.recordsLimit}
                  total={record.totalRecords}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
                : ''
              }
            </div>
          </div>
          <br /><br />
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
export default DAT_File_V;
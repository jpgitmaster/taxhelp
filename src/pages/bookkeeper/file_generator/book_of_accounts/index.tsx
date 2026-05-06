import dayjs from 'dayjs'
import Link from 'next/link'
import Image from 'next/image'
import type { ColumnsType } from 'antd/es/table'
import scss from './../styles/DatFile.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import { Record_Obj } from '@/controllers/file_generator/types'
import { Table, DatePicker, Pagination, Popconfirm } from 'antd'
import SuccessMessage from '@/components/reusables/SuccessMessage'
import CustomContainer from '@/components/reusables/CustomContainer'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import useFileGenerator from '@/controllers/file_generator/useFileGenerator'
import ClientsDropdown from '@/components/pages/bookkeeper/documents/ClientsDropdown'
import DocumentsTableDropdown from '@/components/pages/bookkeeper/documents/DocumentsTableDropdown'

const BookOfAccounts_V = () => {
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
      booksOfAccountsOptions,

      setDisplayClients,
      setDisplayDocsTbl,

      handleToggle,
      handleChange,
      handlePageChange,
      handleDateChange,
      handleSelectTable,
      handleDeleteRecord,
      handleToggleDelete,
      handleSelectClient,
      handleDownloadSales,
      handleClearSelected,
      handleDownloadPurchases,
    } = useFileGenerator()
    const { message, loader: statLoader } = status
    const dataSource: Record_Obj[] = record.recordArr?.map(doc => ({
      id: doc.id,
      // terms: doc.terms,
      toDelete: doc.toDelete,
      // particulars: doc.particulars,
      // account_name: doc.account_name,
      // invoice_date: doc.invoice_date,
      taxable_month: doc.taxable_month,
      // business_profile: doc.business_profile,
      // name: (doc.business_profile?.first_name || '') + ' ' + (doc.business_profile?.middle_name || '') + ' ' + (doc.business_profile?.last_name || ''),
    })) ?? []

    const columns: ColumnsType<Record_Obj> = [
      // {
      //   title: 'ID',
      //   key: 'id',
      //   dataIndex: 'id',
      // },
      {
        title: 'Taxable Month',
        key: 'taxable_month',
        dataIndex: 'taxable_month',
        render: (value) => dayjs(value)?.format('YYYY-MM'),
      },
      {
        title: 'Invoice Date',
        key: 'invoice_date',
        dataIndex: 'invoice_date',
        render: (value) => dayjs(value)?.format('M/DD/YYYY'),
      },
      {
        title: 'TIN Number',
        key: 'tin',
        dataIndex: 'business_profile',
        render: (bp) => bp?.tin,
      },
      {
        title: 'Branch Code',
        key: 'branch_code',
        dataIndex: 'business_profile',
        render: (bp) => bp?.branch_code,
      },
      {
        title: 'Registered Name',
        key: 'registered_name',
        dataIndex: 'business_profile',
        render: (bp) => bp?.registered_name,
      },
      {
        title: 'Name',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: 'Particulars',
        key: 'particulars',
        dataIndex: 'particulars',
      },
      {
        title: 'Terms',
        key: 'terms',
        dataIndex: 'terms',
      },
      {
        title: 'Account Name',
        key: 'account_name',
        dataIndex: 'account_name',
      },
      {
        width: 100,
        fixed: 'right',
        title: 'Actions',
        align: 'center',
        render: (record) =>
            <div className={scss.actions}>
                <Link href={'/bookkeeper/clients/'+record.id} className={scss.action+' '+scss.purchases}>
                    <Image src='/svgs/eyecon_check.svg' alt='Purchases' priority width={22} height={22} unoptimized={true} />
                    <span style={{top: '-2px'}}>
                        View
                    </span>
                </Link>
                <Link href={'/bookkeeper/clients/'+record.id} className={scss.action+' '+scss.edit}>
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
    ]
    return (
        <div>
            {
              message &&
              <SuccessMessage message={message} />
            }
            <div className={scss.cards+' '+scss.filters}>
              <CustomContainer
                  scss={scss}
                  width={20}
                  required={true}
                  label='Select Reporting Type'
              >
                <DocumentsTableDropdown
                  doc={doc}
                  displayDocsTbl={displayDocsTbl}
                  options={booksOfAccountsOptions}
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
                  <button disabled={!record.recordArr?.length} type='button' className={scss.button+' '+scss.btnblue} onClick={() => {
                    if(doc.selectedTable.value === 'SALES'){
                      handleDownloadSales('journal')
                    }
                    if(doc.selectedTable.value === 'PURCHASES'){
                      handleDownloadPurchases('journal')
                    }
                  }}>
                      Download Journal
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
                rowClassName={(record) =>
                  record.toDelete ? scss.activeRow : ''
                }
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
export default BookOfAccounts_V;
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
import SuccessMessage from '@/components/reusables/SuccessMessage'
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
      handleDownload,
      handlePageChange,
      handleDateChange,
      handleSelectTable,
      handleToggleDelete,
      handleDeleteRecord,
      handleSelectClient,
      handleClearSelected,
    } = useFileGenerator()
    const { loader: statLoader, message } = status
    const docType = doc.selectedTable.parentValue || doc.selectedTable.value
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
        toDelete: doc.toDelete,
        taxable_month: doc.taxable_month,
      }

      if (docType === 'SALES') {
        return {
          ...base,
          customer: doc.customer,
          tin: doc.customer?.tin,
          branch_code: doc.customer?.branch_code,
          registered_name: doc.customer?.registered_name,
          first_address: doc.customer?.first_address,
          name:
            (doc.customer?.first_name || '') + ' ' +
            (doc.customer?.middle_name || '') + ' ' +
            (doc.customer?.last_name || ''),
          exempt_sales: Number(doc.exempt_sales || 0),
          vatable_sales: Number(doc.vatable_sales || 0),
          zero_rated_sales: Number(doc.zero_rated_sales || 0),
          gross_amount: Number(doc.gross_amount || 0),
          vat_rate: Number(doc.vat_rate || 0),
          vat_amount: Number(doc.vat_amount || 0),
          gross_taxable: Number(doc.gross_taxable || 0),
        }
      }

      if (docType === 'PURCHASES') {
        return {
          ...base,
          supplier: doc.supplier,
          tin: doc.supplier?.tin,
          branch_code: doc.supplier?.branch_code,
          registered_name: doc.supplier?.registered_name,
          first_address: doc.supplier?.first_address,
          name:
            (doc.supplier?.first_name || '') + ' ' +
            (doc.supplier?.middle_name || '') + ' ' +
            (doc.supplier?.last_name || ''),
          exempt_purchases: doc.exempt_purchases,
          zero_rated_purchases: doc.zero_rated_purchases,
          vatable_purchases: Number(doc.vatable_purchases || 0),
          vatable_purchase_of_services: Number(doc.vatable_purchase_of_services || 0),
          vatable_purchase_of_capital_goods: Number(doc.vatable_purchase_of_capital_goods || 0),
          vatable_purchase_of_other_goods: Number(doc.vatable_purchase_of_other_goods || 0),
          gross_amount: Number(doc.gross_amount || 0),
          vat_rate: Number(doc.vat_rate || 0),
          vat_amount: Number(doc.vat_amount || 0),
          gross_taxable: Number(doc.gross_taxable || 0),
        }
      }
      if (docType === 'IMPORTATION') {
        return {
          ...base,
        }
      }

      if (docType === 'SAWT' || docType === 'QAP') {
        return {
          ...base,
          customer: doc.customer,
          tin: doc.customer?.tin,
          branch_code: doc.customer?.branch_code,
          first_address: doc.customer?.first_address,
          second_address: doc.customer?.second_address,
          registered_name: doc.customer?.registered_name,
          name:
            (doc.customer?.first_name || '') + ' ' +
            (doc.customer?.middle_name || '') + ' ' +
            (doc.customer?.last_name || ''),
          atc_code: doc.atc_code,
          income_payment: Number(doc.income_payment || 0)?.toLocaleString(
                                              navigator.language,
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            ),
          tax_rate: doc.tax_rate,
          // income_payment: doc.income_payment,
          // tax_rate: doc.tax_rate,
          tax_amount: Number(doc.tax_amount || 0)?.toLocaleString(
                                              navigator.language,
                                              {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }
                                            ),
        }
      }

      return base
    }) ?? []
    
    const getColumns = (): ColumnsType<Record_Obj> => {
        const base = [
            {
                title: 'Taxable Month',
                dataIndex: 'taxable_month',
                render: (value: string) => dayjs(value)?.format('YYYY-MM'),
            },
            {
                title: 'Taxpayer Identification Number',
                dataIndex: 'tin',
            },
            {
                title: 'Branch Code',
                dataIndex: 'branch_code',
            },
            {
                title: 'Registered Name',
                dataIndex: 'registered_name',
            },
            {
                title: 'Business Owner',
                dataIndex: 'name',
            },
            {
                title: 'Address 1',
                dataIndex: 'first_address',
            },
            {
                title: 'Address 2',
                dataIndex: 'second_address',
            },
        ]

        switch (docType) {
            case 'SALES':
                return [
                    ...base,
                    { title: 'Exempt Sales', dataIndex: 'exempt_sales', render: (value) => formatNumber(value) },
                    { title: 'Zero-Rated Sales', dataIndex: 'zero_rated_sales', render: (value) => formatNumber(value) },
                    { title: 'Vatable Sales', dataIndex: 'vatable_sales', render: (value) => formatNumber(value) },
                    { title: 'Gross Amount', dataIndex: 'gross_amount', render: (value) => formatNumber(value) },
                    { title: 'VAT Rate', dataIndex: 'vat_rate', render: (value) => formatNumber(value) },
                    { title: 'VAT Amount', dataIndex: 'vat_amount', render: (value) => formatNumber(value) },
                    { title: 'Gross Taxable', dataIndex: 'gross_taxable', render: (value) => formatNumber(value) },
                    actionColumn
                ]

            case 'PURCHASES':
                return [
                    ...base,
                    { title: 'Exempt Purchases', dataIndex: 'exempt_purchases', render: (value) => formatNumber(value) },
                    { title: 'Zero-Rated Purchases', dataIndex: 'zero_rated_purchases', render: (value) => formatNumber(value) },
                    { title: 'Vatable Purchases', dataIndex: 'vatable_purchases', render: (value) => formatNumber(value) },
                    { title: 'Vatable Purchase of Services', dataIndex: 'vatable_purchase_of_services', width: 140, render: (value) => formatNumber(value) },
                    { title: 'Vatable Purchase of Capital Goods', dataIndex: 'vatable_purchase_of_capital_goods', width: 140, render: (value) => formatNumber(value) },
                    { title: 'Vatable Purchase of Goods other than Capital Goods', dataIndex: 'vatable_purchase_of_other_goods', width: 200, render: (value) => formatNumber(value) },
                    { title: 'Gross Amount', dataIndex: 'gross_amount', render: (value) => formatNumber(value) },
                    { title: 'VAT Rate', dataIndex: 'vat_rate', render: (value) => formatNumber(value) },
                    { title: 'VAT Amount', dataIndex: 'vat_amount', render: (value) => formatNumber(value) },
                    { title: 'Gross Taxable', dataIndex: 'gross_taxable', render: (value) => formatNumber(value) },
                    actionColumn
                ]
              case 'IMPORTATION':
                return [
                    {
                        title: 'Taxable Month',
                        dataIndex: 'taxable_month',
                        render: (value: string) => dayjs(value)?.format('YYYY-MM'),
                    },
                    { title: 'Import Entery No.', dataIndex: 'exempt_purchases', width: 140, align: 'center' },
                    { title: 'Assessment or Release Date', dataIndex: 'exempt_purchases', width: 140, align: 'center' },
                    { title: 'Name of Seller', dataIndex: 'exempt_purchases' },
                    { title: 'Date of Importation', dataIndex: 'exempt_purchases' },
                    { title: 'Country of Origin', dataIndex: 'exempt_purchases' },
                    { title: 'Total Landed Cost', dataIndex: 'exempt_purchases' },
                    { title: 'Dutiable Value', dataIndex: 'exempt_purchases' },
                    { title: 'Charges', dataIndex: 'exempt_purchases' },
                    { title: 'Taxable Imports', dataIndex: 'exempt_purchases' },
                    { title: 'Exempt Imports', dataIndex: 'exempt_purchases' },
                    { title: 'Vat Rate', dataIndex: 'exempt_purchases' },
                    { title: 'Vat Amount', dataIndex: 'exempt_purchases' },
                    { title: 'OR Number', dataIndex: 'exempt_purchases' },
                    { title: 'Date of VAT Payment', dataIndex: 'exempt_purchases' },
                    actionColumn
                ]

            case 'SAWT':
            case 'QAP':
                return [
                    ...base,
                    { title: 'ATC Code', dataIndex: 'atc_code' },
                    { title: 'Amount of Income Payment', dataIndex: 'income_payment' },
                    { title: 'Tax Rate', dataIndex: 'tax_rate' },
                    { title: 'Amount of Tax Withheld', dataIndex: 'tax_amount', width: 140, align: 'center' },
                    actionColumn
                ]

            default:
                return [...base, actionColumn]
        }
    }
    const columns = useMemo(() => getColumns(), [doc.selectedTable.value])
    type NumericFields =
    | 'exempt_sales'
    | 'zero_rated_sales'
    | 'vatable_sales'
    | 'gross_amount'
    | 'vat_amount'
    | 'gross_taxable'
    | 'exempt_purchases'
    | 'zero_rated_purchases'
    | 'vatable_purchases'
    | 'vatable_purchase_of_services'
    | 'vatable_purchase_of_other_goods'
    | 'vatable_purchase_of_capital_goods'
    const total = (field: NumericFields) =>
      dataSource.reduce(
        (sum, row) => sum + Number(row[field] || 0),
        0
      )
    const formatNumber = (value: number) =>
      Number(value || 0).toLocaleString(navigator.language, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
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
                <button
                    type='button'
                    disabled={!record.recordArr?.length}
                    className={`${scss.button} ${scss.btnblue}`}
                    onClick={() =>
                        handleDownload(
                            'dat',
                            doc.selectedTable.value,
                            doc.selectedTable.parentValue
                        )
                    }
                >
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
              rowClassName={(record) =>
                record.toDelete ? scss.activeRow : ''
              }
              scroll={{ x: 'max-content', y: 90 * 5 }}

              summary={() => {
                if (!record.recordArr?.length) return null

                if (docType === 'SALES') {
                  return (
                    <Table.Summary fixed>
                      <Table.Summary.Row className={scss.summaryRow}>
                        <Table.Summary.Cell index={0}>TOTAL</Table.Summary.Cell>

                        {/* empty base columns */}
                        {[1,2,3,4,5,6].map(i => (
                          <Table.Summary.Cell key={i} index={i} />
                        ))}
                        <Table.Summary.Cell index={9}>
                          {formatNumber(total('exempt_sales'))}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={9}>
                          {formatNumber(total('zero_rated_sales'))}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={9}>
                          {formatNumber(total('vatable_sales'))}
                        </Table.Summary.Cell>

                        <Table.Summary.Cell index={10}>
                          {formatNumber(total('gross_amount'))}
                        </Table.Summary.Cell>

                        <Table.Summary.Cell index={11} />

                        <Table.Summary.Cell index={12}>
                          {formatNumber(total('vat_amount'))}
                        </Table.Summary.Cell>

                        <Table.Summary.Cell index={13}>
                          {formatNumber(total('gross_taxable'))}
                        </Table.Summary.Cell>

                        <Table.Summary.Cell index={14} />
                      </Table.Summary.Row>
                    </Table.Summary>
                  )
                }

                if (docType === 'PURCHASES') {
                  return (
                    <Table.Summary fixed>
                      <Table.Summary.Row className={scss.summaryRow}>
                        <Table.Summary.Cell index={0}>TOTAL</Table.Summary.Cell>

                        {/* empty base columns */}
                        {[1,2,3,4,5,6].map(i => (
                          <Table.Summary.Cell key={i} index={i} />
                        ))}
                        <Table.Summary.Cell index={7}>
                          {formatNumber(total('exempt_purchases'))}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={8}>
                          {formatNumber(total('zero_rated_purchases'))}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={9}>
                          {formatNumber(total('vatable_purchases'))}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={10}>
                          {formatNumber(total('vatable_purchase_of_services'))}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={11}>
                          {formatNumber(total('vatable_purchase_of_capital_goods'))}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={12}>
                          {formatNumber(total('vatable_purchase_of_other_goods'))}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={13}>
                          {formatNumber(total('gross_amount'))}
                        </Table.Summary.Cell>

                        <Table.Summary.Cell index={13} />

                        <Table.Summary.Cell index={14}>
                          {formatNumber(total('vat_amount'))}
                        </Table.Summary.Cell>

                        <Table.Summary.Cell index={15}>
                          {formatNumber(total('gross_taxable'))}
                        </Table.Summary.Cell>

                        <Table.Summary.Cell index={16} />
                      </Table.Summary.Row>
                    </Table.Summary>
                  )
                }

                return null
              }}
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
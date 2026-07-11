import dayjs from 'dayjs'
import Link from 'next/link'
import Image from 'next/image'
import { useMemo } from 'react'
import type { ColumnsType } from 'antd/es/table'
import scss from './../styles/DatFile.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import ProComponent from '@/components/reusables/ProComponent'
import { Record_Obj } from '@/controllers/file_generator/types'
import { Table, DatePicker, Pagination, Popconfirm } from 'antd'
import SuccessMessage from '@/components/reusables/SuccessMessage'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import useFileGenerator from '@/controllers/file_generator/useFileGenerator'
import ClientsDropdown from '@/components/pages/bookkeeper/documents/ClientsDropdown'
import DocumentsTableDropdown from '@/components/pages/bookkeeper/documents/DocumentsTableDropdown'
import DocumentsChildTableDropdown from '@/components/pages/bookkeeper/documents/DocumentsChildTableDropdown'
const DAT_File_V = () => {
    const {
      doc,
      user,
      status,
      filter,
      record,
      loader,
      clientArr,
      tableWidth,
      clientLoader,
      childOptions,
      displayClients,
      displayDocsTbl,
      datFileOptions,
      displayChildDocsTbl,

      setDisplayClients,
      setDisplayDocsTbl,
      setDisplayChildDocsTbl,

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
      handleSelectChildTable
    } = useFileGenerator()
    const { loader: statLoader, message } = status
    const docType = doc.selectedChildTable.parentValue || doc.selectedTable.value
    const requiresChildSelection =
      ['QAP', 'SAWT'].includes(doc.selectedTable.value)

    const canDownload =
      !requiresChildSelection || !!doc.selectedChildTable.value
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
          second_address: doc.customer?.second_address,
          individual_name:
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
        console.log(doc)
        return {
          ...base,
          supplier: doc.supplier,
          tin: doc.supplier?.tin,
          branch_code: doc.supplier?.branch_code,
          registered_name: doc.supplier?.registered_name,
          first_address: doc.supplier?.first_address,
          individual_name:
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

      if (docType === 'SAWT') {
        return {
          ...base,
          customer: doc.customer,
          tin: doc.customer?.tin,
          branch_code: doc.customer?.branch_code,
          first_address: doc.customer?.first_address,
          second_address: doc.customer?.second_address,
          registered_name: doc.customer?.registered_name,
          individual_name:
            (doc.customer?.first_name || '') + ' ' +
            (doc.customer?.middle_name || '') + ' ' +
            (doc.customer?.last_name || ''),
          atc_code: doc.atc_code,
          tax_rate: doc.tax_rate,
          income_payment: Number(doc.income_payment || 0),
          tax_amount: Number(doc.tax_amount || 0),
        }
      }

      if (docType === 'QAP') {
          return {
              ...base,
              supplier: doc.supplier,
              tin: doc.supplier?.tin,
              branch_code: doc.supplier?.branch_code,
              registered_name: doc.supplier?.registered_name,
              first_address: doc.supplier?.first_address,
              second_address: doc.supplier?.second_address,
              individual_name:
                  `${doc.supplier?.first_name ?? ''} ${doc.supplier?.middle_name ?? ''} ${doc.supplier?.last_name ?? ''}`.trim(),
              atc_code: doc.atc_code,
              tax_rate: doc.tax_rate,
              income_payment: Number(doc.income_payment || 0),
              tax_amount: Number(doc.tax_amount || 0),
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
                title: 'Individual Name',
                dataIndex: 'individual_name',
            },
            {
                title: 'First Address',
                dataIndex: 'first_address',
            },
            {
                title: 'Second Address',
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
                    { title: 'Amount of Tax Withheld', dataIndex: 'tax_amount', width: 140 },
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
      | 'income_payment'      // ✅ FIX
      | 'tax_amount'          // ✅ FIX
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
    const isReady = !!user
    const hasPermission = user?.app_type !== 'dat'
    return (
        <ProComponent loading={isReady} hasPermission={hasPermission} featureType='Custom Solution'>
            {
              message &&
              <SuccessMessage message={message} />
            }
            <div className={scss.cards+' '+scss.customFilters}>
              <div className={scss.selectedClient}>
                <label className={scss.lbl}>
                    Selected Client
                </label>
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
              <div className={scss.monthYear}>
                <label className={scss.lbl}>
                    Taxable Month & Year
                </label>
                <DatePicker picker="month" value={doc.period} onChange={handleDateChange} style={{ border: "1px solid #c4c3c3" }} />
              </div>
              <div className={scss.selectParentDat}>
                <label className={scss.lbl}>
                    Select Table
                </label>
                <DocumentsTableDropdown
                  doc={doc}
                  options={datFileOptions}
                  displayDocsTbl={displayDocsTbl}
                  setDisplayDocsTbl={setDisplayDocsTbl}
                  handleToggle={handleToggle}
                  handleSelectTable={handleSelectTable}
                />
              </div>
              <div className={scss.selectedChildDat}>
                  <label className={scss.lbl}>
                      {childOptions?.length ? doc.selectedTable.label : <>&nbsp;</>}
                  </label>
                  <DocumentsChildTableDropdown
                      doc={doc}
                      options={childOptions}
                      displayDocsTbl={displayChildDocsTbl}
                      handleToggle={handleToggle}
                      handleSelectTable={handleSelectChildTable}
                      setDisplayDocsTbl={setDisplayChildDocsTbl}
                  />
              </div>
          </div>
          <div className={scss.tblBtns}>
            <button
              type="button"
              disabled={!record.recordArr?.length || !canDownload}
              className={`${scss.button} ${scss.btnblue}`}
              onClick={() => {
                if (!canDownload) return;
                console.log({
                  parent: doc.selectedTable,
                  child: doc.selectedChildTable,
                });
                handleDownload(
                  'dat',
                  doc.selectedChildTable.value || doc.selectedTable.value,
                  doc.selectedTable.value
                )
              }}
            >
              Download as DAT File
            </button>
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

                return (
                  <Table.Summary fixed>
                    <Table.Summary.Row className={scss.summaryRow}>

                      {/* BASE COLUMNS */}
                      <Table.Summary.Cell index={0}>
                        TOTAL
                      </Table.Summary.Cell>

                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <Table.Summary.Cell key={i} index={i} />
                      ))}

                      {/* ================= SALES ================= */}
                      {doc.selectedTable.value === 'SALES' && (
                        <>
                          <Table.Summary.Cell index={7}>
                            {formatNumber(total('exempt_sales'))}
                          </Table.Summary.Cell>

                          <Table.Summary.Cell index={8}>
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
                        </>
                      )}

                      {/* ================= PURCHASES ================= */}
                      {doc.selectedTable.value === 'PURCHASES' && (
                        <>
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

                          <Table.Summary.Cell index={14} />

                          <Table.Summary.Cell index={15}>
                            {formatNumber(total('vat_amount'))}
                          </Table.Summary.Cell>

                          <Table.Summary.Cell index={16}>
                            {formatNumber(total('gross_taxable'))}
                          </Table.Summary.Cell>
                        </>
                      )}

                      {/* ================= SAWT / QAP ================= */}
                      {(doc.selectedTable.value === 'SAWT' || doc.selectedTable.value === 'QAP') && (
                        <>
                          <Table.Summary.Cell index={7}>
                            {/* ATC CODE (empty) */}
                          </Table.Summary.Cell>

                          <Table.Summary.Cell index={8}>
                            {formatNumber(total('income_payment'))}
                          </Table.Summary.Cell>

                          <Table.Summary.Cell index={9} />

                          <Table.Summary.Cell index={10}>
                            {formatNumber(total('tax_amount'))}
                          </Table.Summary.Cell>
                        </>
                      )}

                    </Table.Summary.Row>
                  </Table.Summary>
                )
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
        </ProComponent>
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
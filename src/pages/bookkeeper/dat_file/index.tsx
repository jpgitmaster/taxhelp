import Image from 'next/image'
import { DatePicker, Table } from 'antd'
import scss from './styles/DatFile.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import CustomContainer from '@/components/reusables/CustomContainer'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import useUploadDocuments from '@/controllers/documents/useUploadDocument'
import ClientsDropdown from '@/components/pages/bookkeeper/documents/ClientsDropdown'
import DocumentsTableDropdown from '@/components/pages/bookkeeper/documents/DocumentsTableDropdown'
import DocumentsChildTableDropdown from '@/components/pages/bookkeeper/documents/DocumentsChildTableDropdown'
const DAT_File_V = () => {
    const {
        doc,
        rows,
        status,
        width_,
        options,
        clientArr,
        childOptions,
        rowSelection,
        clientLoader,
        displayDocsTbl,
        displayClients,
        selectedRowKeys,
        displayChildDocsTbl,

        setRows,
        setDisplayClients,
        setDisplayDocsTbl,
        setDisplayChildDocsTbl,

        getColumns,
        
        handleUpload,
        handleChange,
        handleToggle,
        handleFileChange,
        handleSelectTable,
        handleSelectClient,
        handleDeleteSelected,
        handleSelectChildTable
    } = useUploadDocuments()
    const { loader } = status
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
        | 'amount_of_income_payment'
        | 'amount_of_tax_withheld'
    const total = (field: NumericFields) =>
      rows.reduce(
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
                rows?.length ?
                <form onSubmit={handleUpload}>
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
                            />
                        </div>
                        <div className={scss.monthYear}>
                            <label className={scss.lbl}>
                                Taxable Month & Year
                            </label>
                            <DatePicker
                                picker="month"
                                style={{ border: "1px solid #c4c3c3" }}
                            />
                        </div>
                        <div className={scss.selectParentDat}>
                            <label className={scss.lbl}>
                                Select Table
                            </label>
                            <DocumentsTableDropdown
                                doc={doc}
                                options={options}
                                displayDocsTbl={displayDocsTbl}
                                handleToggle={handleToggle}
                                setDisplayDocsTbl={setDisplayDocsTbl}
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
                        <button type='submit' className={scss.button+' '+scss.btnblue} disabled={!doc.selectedTable.value}>
                            Download as DAT File
                        </button>
                        <button
                            type='button'
                            className={scss.button + ' ' + scss.btnred}
                            onClick={handleDeleteSelected}
                            disabled={!selectedRowKeys.length}
                        >
                            Delete Selected
                        </button>
                        <button type='button' className={scss.button+' '+scss.btnorange} onClick={() => setRows([])}>
                            Cancel
                        </button>
                    </div>
                    <div className={scss.tableRecords} style={{width:width_+'px', marginTop: '15px'}}>
                        { loader && <Loader scss={scss} position='absolute' />}
                        <Table
                            rowKey='id'
                            dataSource={rows}
                            pagination={false}
                            columns={getColumns()}
                            rowSelection={rowSelection}
                            scroll={{ x: 'max-content', y: 90 * 5 }}
                            summary={() => {
                                return (
                                    <Table.Summary fixed>
                                        <Table.Summary.Row className={scss.summaryRow}>
                                            {/* Checkbox column */}
                                            <Table.Summary.Cell index={0} />

                                            {/* TOTAL */}
                                            <Table.Summary.Cell index={1}>
                                            TOTAL
                                            </Table.Summary.Cell>
                                            {/* Empty text columns */}
                                            {[2,3,4,5,6,7].map(i => (
                                            <Table.Summary.Cell key={i} index={i} />
                                            ))}
                                            {doc.selectedTable.value === 'SALES' ? (
                                                <>
                                                    <Table.Summary.Cell index={8}>
                                                        {formatNumber(total('exempt_sales'))}
                                                    </Table.Summary.Cell>

                                                    <Table.Summary.Cell index={9}>
                                                        {formatNumber(total('zero_rated_sales'))}
                                                    </Table.Summary.Cell>

                                                    <Table.Summary.Cell index={10}>
                                                        {formatNumber(total('vatable_sales'))}
                                                    </Table.Summary.Cell>

                                                    <Table.Summary.Cell index={11}>
                                                        {formatNumber(total('gross_amount'))}
                                                    </Table.Summary.Cell>

                                                    <Table.Summary.Cell index={12} />

                                                    <Table.Summary.Cell index={13}>
                                                        {formatNumber(total('vat_amount'))}
                                                    </Table.Summary.Cell>

                                                    <Table.Summary.Cell index={14}>
                                                        {formatNumber(total('gross_taxable'))}
                                                    </Table.Summary.Cell>
                                                </>
                                            ) : doc.selectedTable.value === 'PURCHASES' ? (
                                                <>
                                                    <Table.Summary.Cell index={8}>
                                                        {formatNumber(total('exempt_purchases'))}
                                                    </Table.Summary.Cell>

                                                    <Table.Summary.Cell index={9}>
                                                        {formatNumber(total('zero_rated_purchases'))}
                                                    </Table.Summary.Cell>

                                                    <Table.Summary.Cell index={10}>
                                                        {formatNumber(total('vatable_purchases'))}
                                                    </Table.Summary.Cell>

                                                    <Table.Summary.Cell index={11}>
                                                        {formatNumber(total('vatable_purchase_of_services'))}
                                                    </Table.Summary.Cell>

                                                    <Table.Summary.Cell index={12}>
                                                        {formatNumber(total('vatable_purchase_of_capital_goods'))}
                                                    </Table.Summary.Cell>

                                                    <Table.Summary.Cell index={13}>
                                                        {formatNumber(total('vatable_purchase_of_other_goods'))}
                                                    </Table.Summary.Cell>

                                                    <Table.Summary.Cell index={14}>
                                                        {formatNumber(total('gross_amount'))}
                                                    </Table.Summary.Cell>

                                                    <Table.Summary.Cell index={15} />

                                                    <Table.Summary.Cell index={16}>
                                                        {formatNumber(total('vat_amount'))}
                                                    </Table.Summary.Cell>

                                                    <Table.Summary.Cell index={17}>
                                                        {formatNumber(total('gross_taxable'))}
                                                    </Table.Summary.Cell>
                                                </>
                                            ) : (
                                                <>
                                                    {/* ATC Code */}
                                                    <Table.Summary.Cell index={8} />

                                                    {/* Amount of Income Payment */}
                                                    <Table.Summary.Cell index={9}>
                                                        {formatNumber(total('amount_of_income_payment'))}
                                                    </Table.Summary.Cell>

                                                    {/* Tax Rate */}
                                                    <Table.Summary.Cell index={10} />

                                                    {/* Amount of Tax Withheld */}
                                                    <Table.Summary.Cell index={11}>
                                                        {formatNumber(total('amount_of_tax_withheld'))}
                                                    </Table.Summary.Cell>
                                                </>
                                            )}
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                )
                            }}
                        />
                    </div>
                </form>
                :
                <>
                    <br />
                    <div className={scss.cards+' '+scss.uploader}>
                        <CustomContainer
                            scss={scss}
                            width={100}
                            required={true}
                            label='Select Client'
                            className={scss.selectedClient}
                        >
                            <ClientsDropdown
                                doc={doc}
                                clients={clientArr}
                                loader={clientLoader}
                                displayClients={displayClients}

                                setDisplayClients={setDisplayClients}

                                handleChange={handleChange}
                                handleSelectClient={handleSelectClient}
                                handleToggle={handleToggle}
                            />
                        </CustomContainer>
                    </div>
                    <div className={scss.customFile}>
                        <div className={scss.customFileUpload + (!doc.client.id ? ' '+scss.disabled : '')}>
                            <label className={scss.customFile}>
                                <input
                                    name="file"
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileChange}
                                />
                                <div className={scss.empty_image}>
                                    <Image
                                        src="/svgs/reports.svg"
                                        alt="Empty Image"
                                        width={26}
                                        height={26}
                                        unoptimized
                                    />
                                </div>
                                <>
                                    <p>Browse or upload your file here</p>
                                    <span>
                                        Supported formats: .xls, .xlsx<br />
                                        Maximum file size: 5 MB
                                    </span>
                                </>
                            </label>
                        </div>
                    </div>
                </>
            }
            <br />
            {/* <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Converting...' : 'Convert to DAT'}
            </button> */}
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
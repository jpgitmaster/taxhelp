
import { Table } from 'antd'
import Image from 'next/image'
import scss from './styles/Documents.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import CustomContainer from '@/components/reusables/CustomContainer'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import useUploadDocuments from '@/controllers/documents/useUploadDocument'
import ClientsDropdown from '@/components/pages/bookkeeper/documents/ClientsDropdown'
import DocumentsTableDropdown from '@/components/pages/bookkeeper/documents/DocumentsTableDropdown'

const UploadNewDocument_V = () => {
    const {
        doc,
        rows,
        status,
        width_,
        options,
        clientArr,
        rowSelection,
        clientLoader,
        displayDocsTbl,
        displayClients,
        selectedRowKeys,

        setRows,
        setDisplayClients,
        setDisplayDocsTbl,

        getColumns,
        
        handleUpload,
        handleChange,
        handleToggle,
        handleFileChange,
        handleSelectTable,
        handleSelectClient,
        handleDeleteSelected,
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
                    <div className={scss.pageHeader+' '+scss.form} style={{marginTop: '10px'}}>
                        {/* <button onClick={handleUpload} type='button' className={scss.button+' '+scss.btnorange}>
                            Convert to DAT File
                        </button> */}
                        <div className={scss.cards+' '+scss.customCards}>
                            <CustomContainer
                                scss={scss}
                                width={33}
                                required={true}
                                label='Select Table'
                                className={scss.selectedTable}
                            >
                                <DocumentsTableDropdown
                                    doc={doc}
                                    options={options}
                                    displayDocsTbl={displayDocsTbl}
                                    setDisplayDocsTbl={setDisplayDocsTbl}
                                    handleToggle={handleToggle}
                                    handleSelectTable={handleSelectTable}
                                />
                            </CustomContainer>
                            <CustomContainer
                                scss={scss}
                                width={33}
                                required={true}
                                label='Selected Client'
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
                                />
                            </CustomContainer>
                            <div className={scss.card+' '+scss.w33}>
                                {/* <div className={scss.searchComponent}
                                    // onSubmit={handleSubmitSearch}
                                >
                                    <input id='search' type='text' name='search' maxLength={50} autoComplete='search' placeholder='Enter keyword...'
                                        // value={filter.search} onKeyUp={handleBlur} onChange={handleSearch}
                                    />
                                    <button type='submit' className={`${scss.button} ${scss.btnblue}`}
                                        // onKeyDown={handleResubmit}
                                    >
                                    Search
                                    </button>
                                </div> */}
                            </div>
                        </div>
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
                        <div className={scss.tblBtns}>
                            <button type='submit' className={scss.button+' '+scss.btnblue}>
                                Save Document
                            </button>
                            <button type='button' className={scss.button+' '+scss.btnorange} onClick={() => setRows([])}>
                                Cancel
                            </button>
                            <button
                                type='button'
                                className={scss.button + ' ' + scss.btnred}
                                onClick={handleDeleteSelected}
                                disabled={!selectedRowKeys.length}
                            >
                                Delete Selected
                            </button>
                        </div>
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
                                    <p>Browse or upload your report here</p>
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
export default UploadNewDocument_V;
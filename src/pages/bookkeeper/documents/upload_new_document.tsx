
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
        clientLoader,
        displayDocsTbl,
        displayClients,

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
    } = useUploadDocuments()
    const { loader } = status
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
                                <div className={scss.searchComponent}
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
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={scss.tableRecords} style={{width:width_+'px'}}>
                        { loader && <Loader scss={scss} position='absolute' />}
                        <Table
                            rowKey='id'
                            dataSource={rows}
                            pagination={false}
                            columns={getColumns()}
                            scroll={{ x: 'max-content' }}
                        />
                        <div className={scss.tblBtns}>
                            <button type='submit' className={scss.button+' '+scss.btnblue}>
                                Save Document
                            </button>
                            <button type='button' className={scss.button+' '+scss.btnorange} onClick={() => setRows([])}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
                :
                <>
                    <br />
                    <div className={scss.cards} style={{width: '500px', margin: '0 auto'}}>
                        <CustomContainer
                            scss={scss}
                            width={100}
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
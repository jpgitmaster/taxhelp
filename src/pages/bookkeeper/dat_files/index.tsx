
import scss from './styles/DatFile.module.scss'
import type { ColumnsType } from 'antd/es/table'
import { Table, DatePicker, Pagination } from 'antd'
import { signOut, getSession } from 'next-auth/react'
import { Record_Obj } from '@/controllers/dat_file/types'
import useDatFile from '@/controllers/dat_file/useDatFile'
import Loader from '@/components/reusables/RotatingLoader'
import CustomContainer from '@/components/reusables/CustomContainer'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import ClientsDropdown from '@/components/pages/bookkeeper/documents/ClientsDropdown'
import DocumentsTableDropdown from '@/components/pages/bookkeeper/documents/DocumentsTableDropdown'
import dayjs from 'dayjs'

const Documents_V = () => {
    const {
      doc,
      record,
      loader,
      clientArr,
      tableWidth,
      clientLoader,
      displayClients,
      displayDocsTbl,

      setDisplayClients,
      setDisplayDocsTbl,

      handleToggle,
      handleChange,
      handleDateChange,
      handleSelectTable,
      handleSelectClient
    } = useDatFile()
    const dataSource: Record_Obj[] = record.recordArr?.map(doc => ({
      id: doc.id,
      account_name: doc.account_name,
      invoice_date: doc.invoice_date,
      taxable_month: doc.taxable_month
    })) ?? []
    const columns: ColumnsType<Record_Obj> = [
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
      },
      {
        title: 'Taxable Month',
        key: 'taxable_month',
        dataIndex: 'taxable_month',
        render: (value) => dayjs(value)?.format('M/DD/YYYY'),
      },
      {
        title: 'Invoice Date',
        key: 'invoice_date',
        dataIndex: 'invoice_date',
        render: (value) => dayjs(value)?.format('M/DD/YYYY'),
      },
      {
        title: 'Account Name',
        key: 'account_name',
        dataIndex: 'account_name',
      },
    ]
    return (
        <div>
            <div className={scss.cards+' '+scss.filters}>
              <CustomContainer
                  scss={scss}
                  width={25}
                  required={true}
                  label='Select Reporting Type'
              >
                <DocumentsTableDropdown
                  doc={doc}
                  scss={scss}
                  displayDocsTbl={displayDocsTbl}
                  setDisplayDocsTbl={setDisplayDocsTbl}
                  handleToggle={handleToggle}
                  handleSelectTable={handleSelectTable}
                />
                  {/* <select>
                      <option>
                          SUMMARY LIST OF SALES (SLS)
                      </option>
                      <option>
                          SUMMARY LIST OF PURCHASES (SLP)
                      </option>
                      <option>
                          IMPORTATION
                      </option>
                      <option>
                          QUARTERLY ALPHALIST OF PAYEES (QAP)
                      </option>
                  </select> */}
              </CustomContainer>
              <CustomContainer
                  scss={scss}
                  width={25}
                  required={true}
                  label='Select Client'
              >
                <ClientsDropdown
                    doc={doc}
                    scss={scss}
                    clients={clientArr}
                    search={doc.search}
                    loader={clientLoader}
                    displayClients={displayClients}

                    setDisplayClients={setDisplayClients}

                    handleChange={handleChange}
                    handleToggle={handleToggle}
                    handleSelectClient={handleSelectClient}
                />
              </CustomContainer>
              <CustomContainer
                  scss={scss}
                  width={25}
                  required={true}
                  label='Month & Year'
              >
                  <DatePicker picker="month" value={doc.period} onChange={handleDateChange} />
              </CustomContainer>
              <CustomContainer
                  scss={scss}
                  width={25}
                  required={true}
                  label='DAT File Generator'
              >
                <button className={scss.button+' '+scss.btnorange} disabled={doc.client.id && doc.selectedTable.value && doc.period ? false : true}>
                    Generate DAT File
                </button>
              </CustomContainer>
          </div>
          <div className={scss.tableRecords} style={{width:tableWidth+'px'}}>
            { loader && <Loader scss={scss} position='absolute' />}
            <Table
                rowKey='id'
                columns={columns}
                pagination={false}
                dataSource={dataSource}
                scroll={{ x: 'max-content' }}
            />
          </div>
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
export default Documents_V;
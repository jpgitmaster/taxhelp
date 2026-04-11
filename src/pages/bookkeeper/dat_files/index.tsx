
import scss from './styles/DatFile.module.scss'
import { Table, DatePicker, Pagination } from 'antd'
import { signOut, getSession } from 'next-auth/react'
import useDatFile from '@/controllers/dat_file/useDatFile'
import CustomContainer from '@/components/reusables/CustomContainer'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import ClientsDropdown from '@/components/pages/bookkeeper/documents/ClientsDropdown'
import DocumentsTableDropdown from '@/components/pages/bookkeeper/documents/DocumentsTableDropdown'
const Documents_V = () => {
    const {
      doc,
      clientArr,
      clientLoader,
      displayClients,
      displayDocsTbl,

      setDisplayClients,
      setDisplayDocsTbl,

      handleToggle,
      handleChange,
      handleSelectTable,
      handleSelectClient
    } = useDatFile()
    const clients = [
        {
            id: 1,
            name: 'RB ACCOUNTING OFFICE',
        },
        {
            id: 2,
            name: 'VALCITY VIRTUAL OFFICE',
        },
        {
            id: 3,
            name: 'QCITY VIRTUAL OFFICE'
        }
    ]

    return (
        <div>
            <div className={scss.cards} style={{width: '800px', margin: '0 auto'}}>
              <CustomContainer
                  scss={scss}
                  width={33}
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
                  width={33}
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
                  width={33}
                  required={true}
                  label='Month & Year'
              >
                  <DatePicker picker="month" />
              </CustomContainer>
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
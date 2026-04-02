import Link from 'next/link'
import { Table, Pagination } from 'antd'
import { useEffect, useState } from 'react'
import scss from './styles/Customers.module.scss'
import { signOut, getSession } from 'next-auth/react'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const Customers_V = () => {
    const [width_, setWidth] = useState(0)
    useEffect(() => {
        if(typeof window !== 'undefined'){
        setWidth(window.innerWidth - 240)
        }
    },[])
    const dataSource = [
        {
            masterlistID: '1',
            tin: '006807251',
            name: '',
            branchCode: '',
            registeredName: 'SAN MIGUEL BREWERLY INC',
            registeredAddress: '40 SAN MIGUEL AVE MANDALUYONG CITY',
        },
        {
            masterlistID: '2',
            tin: '741855060',
            name: '',
            branchCode: '',
            registeredName: 'CD1 DELIVERY SERVICES CORPORATION',
            registeredAddress: '888 HEROES DEL BRGY 73 CALOOCAN CITY',
        },
        {
            masterlistID: '3',
            tin: '205412358',
            name: '',
            branchCode: '',
            registeredName: 'LANDMARK SUPERMARKET CITYSUPER INC',
            registeredAddress: 'EDSA COR MIN AVE EXT PAG ASA QUEZON CITY',
        },
        {
            masterlistID: '4',
            tin: '211072434',
            name: '',
            branchCode: '',
            registeredName: 'PUMPPRIME ENTERPRISES',
            registeredAddress: 'SITIO SULOK MINDANAO AVE EXT BRGY UGONG EXIT VALENZUELA CITY',
        },
        {
            masterlistID: '5',
            tin: '108664829',
            name: '',
            branchCode: '',
            registeredName: 'AEGIS CALTES SERVICE CENTER AND CONVENIENCE STORE',
            registeredAddress: 'G ARANETA AVE COR NS AMORANTO TALAYAN 1 QUEZON CITY',
        },
        {
            masterlistID: '6',
            tin: '009192878',
            name: '',
            branchCode: '',
            registeredName: 'WILCON DEPOT INC',
            registeredAddress: 'L119 C 1 MINDANAO AVE  NEAR QUIRINO HIWAY TALIPAPA NOVALICHES QUEZON CITY',
        },
        {
            masterlistID: '7',
            tin: '000299299',
            name: '',
            branchCode: '',
            registeredName: 'ABACUS BOOK AND CARD CORP  NATIONAL BOOK STORE',
            registeredAddress: 'SM CITY FAIRVIEW QUIRINO HIWAY NOVALICHES GREATER LAGRO QUEZON CITY',
        },
        {
            masterlistID: '8',
            tin: '000299299',
            name: '',
            branchCode: '',
            registeredName: 'ABACUS BOOK AND CARD CORP  NATIONAL BOOK STORE',
            registeredAddress: '2F UNIT 235 239 SM CITY CALOOCAN DEPARO RD  CORNER SARANAY RD EXIT BRGY 171 CALOOCAN CITY',
        },
        {
            masterlistID: '9',
            tin: '156466935',
            name: '',
            branchCode: '',
            registeredName: 'ULTIMA SERVICE STATION',
            registeredAddress: 'MINDANAO AVE COR MWSS RD TALIPAPA NOVALICHES QUEZON CITY',
        },
        {
            masterlistID: '10',
            tin: '209609185',
            name: '',
            branchCode: '',
            registeredName: 'SUPER SHOPPING MARKET INC',
            registeredAddress: 'SM HYPERMARKET NOVALICHES  402 QUIRINO HIWAY TALIPAPA NOVALICHES QUEZON CITY',
        },
        // {
        //     masterlistID: '11',
        //     tin: '123854789',
        //     name: '',
        //     branchCode: '',
        //     registeredName: 'ANCHOR INSURANCE BROKERAGE CORP',
        //     registeredAddress: 'SM HYPERMARKET NOVALICHES  402 QUIRINO HIWAY TALIPAPA NOVALICHES QUEZON CITY',
        // },
        // {
        //     masterlistID: '12',
        //     tin: '303916736',
        //     name: '',
        //     branchCode: '',
        //     registeredName: 'ORIONPH FUEL STATION',
        //     registeredAddress: 'LOT 38 AND LOT 2B MINDANAO AVE TALIPAPA QUEZON CITY',
        // },
        // {
        //     masterlistID: '13',
        //     tin: '000000000',
        //     name: '',
        //     branchCode: '',
        //     registeredName: 'SECURITIES AND EXCHANGE COMMISSION',
        //     registeredAddress: '',
        // },
        // {
        //     masterlistID: '14',
        //     tin: '000000000',
        //     name: '',
        //     branchCode: '',
        //     registeredName: 'PAYROLL',
        //     registeredAddress: '',
        // },
        // {
        //     masterlistID: '15',
        //     tin: '318378721',
        //     name: 'BACUD RACHELLE OCLARES',
        //     branchCode: '',
        //     registeredName: '',
        //     registeredAddress: 'PH4B PKG7 BLK109 LOT17 BRGY 176A CALOOCAN CITY',
        // },
        // {
        //     masterlistID: '16',
        //     tin: '318378721',
        //     name: 'BACUD RACHELLE OCLARES',
        //     branchCode: '00000',
        //     registeredName: '',
        //     registeredAddress: '4225 S BAUTISTA ST BRGY MAPULANG LUPA VALENZUELA CITY',
        // },
    ];

    const columns = [
        {
            title: 'Masterlist ID',
            dataIndex: 'masterlistID',
            key: 'masterlistID',
        },
        {
            title: 'TIN',
            dataIndex: 'tin',
            key: 'tin',
        },
        {
            title: 'Branch Code',
            dataIndex: 'branchCode',
            key: 'branchCode',
        },
        {
            title: 'Registered Name',
            dataIndex: 'registeredName',
            key: 'registeredName',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 300
        },
        {
            title: 'Registered Address',
            dataIndex: 'registeredAddress',
            key: 'registeredAddress',
        },
    ];
    return (
        <div>
            <div className={scss.header}>
                <Link href='/bookkeeper/clients/add_client' className={scss.button+' '+scss.btnblue}>
                    Add Client
                </Link>
                <Link href='/bookkeeper/clients/add_client' className={scss.button+' '+scss.btnorange}>
                    Export Table
                </Link>
                <form className={scss.searchComponent}
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
                </form>
            </div>
            <div style={{width:width_+'px'}}>
                <Table
                    rowKey='id'
                    columns={columns}
                    pagination={false}
                    dataSource={dataSource}
                    scroll={{ x: 'max-content' }}
                />
            </div>
            {/* { loader && <Loader scss={scss} position='fixed' />}*/}
            <div className={scss.pagination}>
                <div className={scss.total_records}>
                    Total Users: <strong>{16}</strong>
                </div>
                    <div className={scss.paginationComponent}>
                    <Pagination defaultPageSize={10} total={16}
                        // onChange={handlePageChange}
                    />
                </div>
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
export default Customers_V;
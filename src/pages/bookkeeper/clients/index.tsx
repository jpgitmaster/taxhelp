import dayjs from 'dayjs'
import Link from 'next/link'
import Image from 'next/image'
import { Table, Pagination } from 'antd'
import scss from './styles/Clients.module.scss'
import type { ColumnsType } from 'antd/es/table'
import { signOut, getSession } from 'next-auth/react'
import useClients from '@/controllers/clients/useClients'
import Loader from '@/components/reusables/RotatingLoader'
import { ClientTableRow } from '@/controllers/clients/types'
import SuccessMessage from '@/components/reusables/SuccessMessage'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const Clients_V = () => {
    const {
        loader,
        filter,
        status,
        client,
        tableWidth,

        handlePageChange
    } = useClients()
    const { message } = status
    const { clientArr } = client
    const dataSource = clientArr?.length ? clientArr.map(client => (
        {
            id: client.id,
            tin: client.tin,
            period: client.period,
            rdo_code: client.rdo_code,
            month_end: client.month_end,
            trade_name: client.trade_name,
            classification: client.classification,
            registered_name: client.registered_name,
            taxpayer_name: client.first_name+' '+client.last_name,
            created_at: client.created_at ? dayjs(client.created_at).format('MM/DD/YYYY h:mm A') : '',
            representative_name: client.representative?.first_name+' '+client.representative?.last_name,
            address: client.street+', '+client.sub_street+', '+client.barangay+', '+client.district+', '+client.city+', '+client.zip_code
        }
    )) : []

    const columns: ColumnsType<ClientTableRow> = [
        // {
        //     title: 'ID',
        //     key: 'ud',
        //     dataIndex: 'id',
        // },
        {
            title: 'Classification',
            key: 'classification',
            dataIndex: 'classification',
            render: (text: string) => <span style={{textTransform: 'capitalize'}}>{text?.toLowerCase()}</span>
        },
        {
            title: 'TIN',
            key: 'tin',
            dataIndex: 'tin',
        },
        {
            title: 'RDO Code',
            key: 'rdo_code',
            dataIndex: 'rdo_code',
        },
        {
            title: 'Representative Name',
            dataIndex: 'representative_name',
            key: 'representative_name',
            width: 300
        },
        {
            title: 'Registered Name',
            key: 'registered_name',
            dataIndex: 'registered_name',
        },
        {
            title: 'Trade Name',
            key: 'trade_name',
            dataIndex: 'trade_name',
        },
        {
            title: 'Accounting Period',
            key: 'period',
            dataIndex: 'period',
            render: (_, record: ClientTableRow) => `${record.period === 'CALENDAR' ? 'Calendar' : 'Fiscal'} (${record.month_end})`
        },
        {
            title: 'Taxpayer Name',
            dataIndex: 'taxpayer_name',
            key: 'taxpayer_name',
            width: 300
        },
        {
            title: 'Registered Address',
            key: 'address',
            dataIndex: 'address',
        },
        {
            title: 'Date & Time Created',
            key: 'created_at',
            dataIndex: 'created_at',
        },
        {
            width: 100,
            fixed: 'right',
            title: 'Actions',
            align: 'center',
            render: (record: ClientTableRow) =>
                <div className={scss.actions}>
                    <Link href={'/bookkeeper/clients/'+record.id} className={scss.action+' '+scss.purchases}>
                        <Image src='/svgs/eyecon_check.svg' alt='Purchases' priority width={22} height={22} unoptimized={true} />
                        <span style={{top: '-2px'}}>
                            View
                        </span>
                    </Link>
                    <Link href={'/bookkeeper/clients/'+record.id+'/edit'} className={scss.action+' '+scss.edit}>
                        <Image src='/svgs/edit.svg' alt='Edit' priority width={20} height={20} unoptimized={true} />
                        <span>
                            Edit
                        </span>
                    </Link>
                    <Link href={''} className={scss.action+' '+scss.delete}>
                        <Image src='/svgs/delete.svg' alt='Delete' priority width={18} height={18} unoptimized={true} />
                        <span>
                            Delete
                        </span>
                    </Link>
                </div>
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
            {
                message &&
                <SuccessMessage message={message} />
            }
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
            <div className={scss.pagination}>
                {
                    client.totalClients != 0 &&
                    <div className={scss.total_records}>
                    {'Total Document'+ (client.totalClients > 1 ? 's' : '')}: <strong>{client.totalClients}</strong>
                    </div>
                }
                <div className={scss.paginationComponent}>
                    {
                    client.totalClients ? <Pagination defaultPageSize={filter.recordsLimit} total={client.totalClients} onChange={handlePageChange} />
                    : ''
                    }
                </div>
            </div>
            <br />
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
export default Clients_V;
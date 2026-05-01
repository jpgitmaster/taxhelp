import dayjs from 'dayjs'
import Link from 'next/link'
import Image from 'next/image'
import { Table, Pagination } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import scss from './styles/Customers.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import { CustomerRow } from '@/controllers/customers/types'
import useCustomers from '@/controllers/customers/useCustomers'
import SuccessMessage from '@/components/reusables/SuccessMessage'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const Customers_V = () => {
  const {
    loader,
    filter,
    status,
    customer,
    tableWidth,

    handlePageChange
  } = useCustomers()
  const { message } = status
    const { customerArr } = customer
    const dataSource = customerArr?.length ? customerArr.map(customer => (
        {
            id: customer.id,
            tin: customer.tin,
            city: customer.city,
            email: customer.email,
            phone: customer.phone,
            street: customer.street,
            zip_code: customer.zip_code,
            district: customer.district,
            barangay: customer.barangay,
            sub_street: customer.sub_street,
            trade_name: customer.trade_name,
            classification: customer.classification,
            registered_name: customer.registered_name,
            customer_name: customer.first_name+' '+customer.last_name,
            created_at: customer.created_at ? dayjs(customer.created_at).format('MM/DD/YYYY h:mm A') : '',
        }
    )) : []
    const columns: ColumnsType<CustomerRow> = [
        {
            title: 'Taxpayer Classification',
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
            title: 'Customer Name',
            dataIndex: 'customer_name',
            key: 'customer_name',
            width: 300
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
            render: (record: CustomerRow) =>
                <div className={scss.actions}>
                    <Link href={'/bookkeeper/users/customers/'+record.id} className={scss.action+' '+scss.purchases}>
                        <Image src='/svgs/eyecon_check.svg' alt='Purchases' priority width={22} height={22} unoptimized={true} />
                        <span style={{top: '-2px'}}>
                            View
                        </span>
                    </Link>
                    <Link href={'/bookkeeper/users/customers/'+record.id+'/edit'} className={scss.action+' '+scss.edit}>
                        <Image src='/svgs/edit.svg' alt='Edit' priority width={20} height={20} unoptimized={true} />
                        <span>
                            Edit
                        </span>
                    </Link>
                    {/* <Link href={''} className={scss.action+' '+scss.delete}>
                        <Image src='/svgs/delete.svg' alt='Delete' priority width={18} height={18} unoptimized={true} />
                        <span>
                            Delete
                        </span>
                    </Link> */}
                </div>
        },
    ];
  return (
      <div>
        <div className={scss.header}>
            <Link href='/bookkeeper/users/customers/add_customer' className={scss.button+' '+scss.btnblue}>
              Add Customer
            </Link>
            {/* <Link href='/bookkeeper/users/customers' className={scss.button+' '+scss.btnorange}>
              Export Customers
            </Link> */}
            <form className={scss.searchComponent}
                // onSubmit={handleSubmitSearch}
            >
                <input id='search' type='text' name='search' maxLength={50} autoComplete='search' placeholder='Search by Name or TIN...'
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
        <div className={scss.tableRecords} style={{width:tableWidth+'px', marginTop: '15px'}}>
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
                customer.totalCustomers != 0 &&
                <div className={scss.total_records}>
                {'Total Document'+ (customer.totalCustomers > 1 ? 's' : '')}: <strong>{customer.totalCustomers}</strong>
                </div>
            }
            <div className={scss.paginationComponent}>
                {
                customer.totalCustomers ? <Pagination defaultPageSize={filter.recordsLimit} total={customer.totalCustomers} onChange={handlePageChange} />
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
export default Customers_V;
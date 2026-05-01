import dayjs from 'dayjs'
import Link from 'next/link'
import Image from 'next/image'
import { Table, Pagination } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import scss from './styles/Suppliers.module.scss'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import { SupplierRow } from '@/controllers/suppliers/types'
import useSuppliers from '@/controllers/suppliers/useSuppliers'
import SuccessMessage from '@/components/reusables/SuccessMessage'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const Suppliers_V = () => {
  const {
    loader,
    filter,
    status,
    supplier,
    tableWidth,

    handlePageChange
  } = useSuppliers()
  const { message } = status
    const { supplierArr } = supplier
    const dataSource = supplierArr?.length ? supplierArr.map(supplier => (
        {
            id: supplier.id,
            tin: supplier.tin,
            city: supplier.city,
            email: supplier.email,
            phone: supplier.phone,
            street: supplier.street,
            zip_code: supplier.zip_code,
            district: supplier.district,
            barangay: supplier.barangay,
            sub_street: supplier.sub_street,
            trade_name: supplier.trade_name,
            classification: supplier.classification,
            registered_name: supplier.registered_name,
            supplier_name: supplier.first_name+' '+supplier.last_name,
            created_at: supplier.created_at ? dayjs(supplier.created_at).format('MM/DD/YYYY h:mm A') : '',
        }
    )) : []
    const columns: ColumnsType<SupplierRow> = [
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
            title: 'Supplier Name',
            dataIndex: 'supplier_name',
            key: 'supplier_name',
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
            render: (record: SupplierRow) =>
                <div className={scss.actions}>
                    <Link href={'/bookkeeper/users/suppliers/'+record.id} className={scss.action+' '+scss.purchases}>
                        <Image src='/svgs/eyecon_check.svg' alt='Purchases' priority width={22} height={22} unoptimized={true} />
                        <span style={{top: '-2px'}}>
                            View
                        </span>
                    </Link>
                    <Link href={'/bookkeeper/users/suppliers/'+record.id+'/edit'} className={scss.action+' '+scss.edit}>
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
            <Link href='/bookkeeper/users/suppliers/add_supplier' className={scss.button+' '+scss.btnblue}>
              Add Supplier
            </Link>
            {/* <Link href='/bookkeeper/users/suppliers' className={scss.button+' '+scss.btnorange}>
              Export Suppliers
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
                supplier.totalSuppliers != 0 &&
                <div className={scss.total_records}>
                {'Total Document'+ (supplier.totalSuppliers > 1 ? 's' : '')}: <strong>{supplier.totalSuppliers}</strong>
                </div>
            }
            <div className={scss.paginationComponent}>
                {
                supplier.totalSuppliers ? <Pagination defaultPageSize={filter.recordsLimit} total={supplier.totalSuppliers} onChange={handlePageChange} />
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
export default Suppliers_V;
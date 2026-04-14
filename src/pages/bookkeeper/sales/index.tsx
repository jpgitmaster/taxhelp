import Link from 'next/link'
import Image from 'next/image'
import { Table, Pagination } from 'antd'
import scss from './styles/Sales.module.scss'
import type { ColumnsType } from 'antd/es/table'
import useSales from '@/controllers/sales/useSales'
import { signOut, getSession } from 'next-auth/react'
import { SalesTableRow } from '@/controllers/sales/types'
import Loader from '@/components/reusables/RotatingLoader'
import SuccessMessage from '@/components/reusables/SuccessMessage'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
import dayjs from 'dayjs'

const Sales_V = () => {
  const {
    sales,
    status,
    filter,
    loader,
    tableWidth,
    handlePageChange
  } = useSales()
  const { message } = status
  const { salesArr } = sales
  console.log(salesArr)
  const dataSource = salesArr?.length ? salesArr.map(sales => (
      {
        id: sales.id,
        atc: sales.atc,
        terms: sales.terms,
        ewt_rate: sales.ewt_rate,
        vat_rate: sales.vat_rate,
        tax_amount: sales.tax_amount,
        vat_amount: sales.vat_amount,
        particulars: sales.particulars,
        exempt_sales: sales.exempt_sales,
        account_name: sales.account_name,
        tin: sales.business_profile?.tin,
        gross_amount: sales.gross_amount,
        gross_taxable: sales.gross_taxable,
        vatable_sales: sales.vatable_sales,
        invoice_number: sales.invoice_number,
        zero_rated_sales: sales.zero_rated_sales,
        branch_code: sales.business_profile?.branch_code,
        first_address: sales.business_profile?.first_address,
        second_address: sales.business_profile?.second_address,
        registered_name: sales.business_profile?.registered_name,
        invoice_date: sales.invoice_date ? dayjs(sales.invoice_date)?.format('MM/DD/YYYY') : '',
        taxable_month: sales.taxable_month ? dayjs(sales.taxable_month)?.format('MM/DD/YYYY') : '',
        business_owner: 
          (sales.business_profile?.first_name ? sales.business_profile.first_name+' ' : '')+
          (sales.business_profile?.middle_name ? sales.business_profile.middle_name+' ' : '')+
          (sales.business_profile?.last_name ? sales.business_profile.last_name : ''),
      }
  )) : []
  const columns: ColumnsType<SalesTableRow> = [
    {
      title: 'Taxable Month',
      key: 'taxable_month',
      dataIndex: 'taxable_month',
    },
    {
      title: 'Invoice Date',
      key: 'invoice_date',
      dataIndex: 'invoice_date',
    },
    {
      title: 'Invoice No.',
      key: 'invoice_number',
      dataIndex: 'invoice_number',
    },
    {
      title: 'TIN No.',
      key: 'tin',
      dataIndex: 'tin',
    },
    {
      title: 'Branch Code',
      key: 'branch_code',
      dataIndex: 'branch_code',
    },
    {
      title: 'Registered Name',
      key: 'registered_name',
      dataIndex: 'registered_name',
    },
    {
      title: 'Business Owner',
      key: 'business_owner',
      dataIndex: 'business_owner',
    },
    {
      title: 'Address 1',
      key: 'first_address',
      dataIndex: 'first_address',
    },
    {
      title: 'Address 2',
      key: 'second_address',
      dataIndex: 'second_address',
    },
    {
      title: 'Particulars',
      key: 'particulars',
      dataIndex: 'particulars',
    },
    {
      title: 'Terms',
      key: 'terms',
      dataIndex: 'terms',
    },
    {
      title: 'Account Name',
      key: 'account_name',
      dataIndex: 'account_name',
    },
    {
      title: 'Gross Amount',
      key: 'gross_amount',
      dataIndex: 'gross_amount',
    },
    {
      title: 'Exempt Sales',
      key: 'exempt_sales',
      dataIndex: 'exempt_sales',
    },
    {
      title: 'Zero Rated Sales',
      key: 'zero_rated_sales',
      dataIndex: 'zero_rated_sales',
    },
    {
      title: 'Vatable Sales',
      key: 'vatable_sales',
      dataIndex: 'vatable_sales',
    },
    {
      title: 'VAT Rate',
      key: 'vat_rate',
      dataIndex: 'vat_rate',
    },
    {
      title: 'Vat Amount',
      key: 'vat_amount',
      dataIndex: 'vat_amount',
    },
    {
      title: 'Gross Taxable',
      key: 'gross_taxable',
      dataIndex: 'gross_taxable',
    },
    {
      title: 'ATC',
      key: 'atc',
      dataIndex: 'atc',
    },
    {
      title: 'EWT Rate',
      key: 'ewt_rate',
      dataIndex: 'ewt_rate',
    },
    {
      title: 'Tax Amount',
      key: 'tax_amount',
      dataIndex: 'tax_amount',
    },
    {
      width: 100,
      fixed: 'right',
      title: 'Actions',
      align: 'center',
      render: (record: SalesTableRow) =>
          <div className={scss.actions}>
              <Link href={'/bookkeeper/sales/'+record.id} className={scss.action+' '+scss.purchases}>
                  <Image src='/svgs/eyecon_check.svg' alt='Purchases' priority width={22} height={22} unoptimized={true} />
                  <span style={{top: '-2px'}}>
                      View
                  </span>
              </Link>
              <Link href={'/bookkeeper/sales/'+record.id+'/edit'} className={scss.action+' '+scss.edit}>
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
        {
          message &&
          <SuccessMessage message={message} />
        }
        <div className={scss.header}>
            <Link href='/bookkeeper/sales/add_sales' className={scss.button+' '+scss.btnblue}>
                Add Sales
            </Link>
            <Link href='/bookkeeper/sales/add_sales' className={scss.button+' '+scss.btnorange}>
                Export Sales
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
                sales.totalSales != 0 &&
                <div className={scss.total_records}>
                {'Total Document'+ (sales.totalSales > 1 ? 's' : '')}: <strong>{sales.totalSales}</strong>
                </div>
            }
            <div className={scss.paginationComponent}>
                {
                sales.totalSales ? <Pagination defaultPageSize={filter.recordsLimit} total={sales.totalSales} onChange={handlePageChange} />
                : ''
                }
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
export default Sales_V;
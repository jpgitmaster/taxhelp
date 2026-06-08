import dayjs from 'dayjs'
import Link from 'next/link'
import { Modal } from 'antd'
import Image from 'next/image'
import type { ColumnsType } from 'antd/es/table'
import scss from './styles/Documents.module.scss'
import { signOut, getSession } from 'next-auth/react'
import { TableRow } from '@/controllers/documents/types'
import Loader from '@/components/reusables/RotatingLoader'
import useDocuments from '@/controllers/documents/useDocuments'
import { Table, Dropdown, Pagination, type MenuProps } from 'antd'
import SuccessMessage from '@/components/reusables/SuccessMessage'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const Documents_V = () => {
  const {
    doc,
    status,
    filter,
    loader,
    checkedTpl,
    tableWidth,
    activeRowId,
    isModalOpen,

    setActiveRowId,

    handleBlur,
    handleResubmit,
    handleSubmitTpl,
    handleOpenModal,
    handleCloseModal,
    handlePageChange,
    handleCheckedTpls,
  } = useDocuments()
  const { message, loader:tplLoader } = status
  const dataSource: TableRow[] = doc.docArr?.map(doc => ({
    id: doc.id,
    file_name: doc.file_name,
    has_sales: doc.has_sales,
    created_at: doc.created_at,
    has_purchases: doc.has_purchases,
    trade_name: doc.client?.trade_name,
    last_name: doc.client?.last_name,
    first_name: doc.client?.first_name,
    registered_name: doc.client?.registered_name,
  })) ?? []
  const linkItems = (id: number): MenuProps['items'] => [
		{
			key: '1',
			label: (
			<Link href={'/bookkeeper/sales?documentID='+id} className={scss.actionItem}>
				Sales
			</Link>
			),
		},
		{
			key: '2',
			label: (
			<Link href={'/bookkeeper/purchases?documentID='+id} className={scss.actionItem}>
				Purchases
			</Link>
			),
		},
    {
			key: '3',
			label: (
			<Link href={'/bookkeeper/receipts'} className={scss.actionItem}>
				Receipts
			</Link>
			),
		},
    {
			key: '4',
			label: (
			<Link href={'/bookkeeper/disbursements'} className={scss.actionItem}>
				Disbursements
			</Link>
			),
		},
    {
			key: '5',
			label: (
			<Link href={'/bookkeeper/general_journal'} className={scss.actionItem}>
				General Journal
			</Link>
			),
		},
    {
			key: '6',
			label: (
			<Link href={'/bookkeeper/book_of_accounts'} className={scss.actionItem}>
				Book of Accounts
			</Link>
			),
		},
	];
  const downloadItems = (): MenuProps['items'] => [
		{
			key: '1',
			label: (
			<Link href={'/bookkeeper/sales'} className={scss.actionItem}>
				Sales
			</Link>
			),
		},
		{
			key: '2',
			label: (
			<Link href={'/bookkeeper/purchases'} className={scss.actionItem}>
				Purchases
			</Link>
			),
		},
    {
			key: '3',
			label: (
			<Link href={'/bookkeeper/receipts'} className={scss.actionItem}>
				Receipts
			</Link>
			),
		},
    {
			key: '4',
			label: (
			<Link href={'/bookkeeper/disbursements'} className={scss.actionItem}>
				Disbursements
			</Link>
			),
		},
    {
			key: '5',
			label: (
			<Link href={'/bookkeeper/general_journal'} className={scss.actionItem}>
				General Journal
			</Link>
			),
		},
    {
			key: '6',
			label: (
			<Link href={'/bookkeeper/book_of_accounts'} className={scss.actionItem}>
				Book of Accounts
			</Link>
			),
		},
	];
  const columns: ColumnsType<TableRow> = [
    {
      width: 350,
      title: 'Client',
      render: (_, record) => (
        <div className={scss.client}>
          <strong>
            {record.registered_name || (record.first_name+' '+record.last_name)}
          </strong>
          <p>{record.trade_name}</p>
        </div>
      )
    },
    {
      title: 'File',
      key: 'file_name',
      dataIndex: 'file_name',
    },
    {
      title: 'Sales',
      align: 'center',
      key: 'has_sales',
      dataIndex: 'has_sales',
      render: (has_sales: boolean) => has_sales && <Image src='/svgs/check.svg' alt='Check' unoptimized={true} priority height={20} width={20} className={scss.check} />
    },
    {
      align: 'center',
      title: 'Purchases',
      key: 'has_purchases',
      dataIndex: 'has_purchases',
      render: (has_purchases: boolean) => has_purchases && <Image src='/svgs/check.svg' alt='Check' unoptimized={true} priority height={20} width={20} className={scss.check} />
    },
    {
      align: 'center',
      title: 'Imports Transaction',
    },
    {
      align: 'center',
      title: 'QAP',
    },
    {
      align: 'center',
      title: 'SAWT',
    },
    {
      title: 'Uploaded Time & Date',
      key: 'created_at',
      dataIndex: 'created_at',
      render: (created_at: Date) => dayjs(created_at).format('MM/DD/YYYY HH:mm A')
    },
    {
      key: 'id',
      width: 100,
      fixed: 'right',
      title: 'Actions',
      align: 'center',
      dataIndex: 'id',
      render: (id: number) =>
      <div className={scss.actions}>
        <Dropdown 
          menu={{ items: linkItems(id) }}
          placement="bottomRight" trigger={['click']}
        >
          <div className={scss.action+' '+scss.purchases} onClick={() => setActiveRowId(id)}>
            <Image src='/svgs/eyecon_check.svg' alt='Purchases' priority width={22} height={22} unoptimized={true} />
            <span style={{top: '-2px'}}>
              View
            </span>
          </div>
        </Dropdown>
        <Dropdown 
          menu={{ items: downloadItems() }}
          placement="bottomRight" trigger={['click']}
        >
          <div className={scss.action+' '+scss.download} onClick={() => setActiveRowId(id)}>
            <Image src='/svgs/download.svg' alt='Download' priority width={17} height={17} unoptimized={true} />
            <span>
              Download
            </span>
          </div>
        </Dropdown>
      </div>
    },
  ]
  const templates = [
    {
        value: 'template1',
        label: 'DAT File Only',
        icon: 'doc.svg',
        description: 'Generate and export only the DAT file required for submission. Best for users who already maintain their own books of accounts.'
    },
    {
        value: 'template2',
        label: 'DAT File and Books of Accounts',
        icon: 'docs.svg',
        description: 'Generate the DAT file along with complete books of accounts, including organized financial records for reporting and compliance.'
    },
  ];
  return (
      <div>
        {
          message &&
          <SuccessMessage message={message} />
        }
        <div className={scss.header}>
              <Link href='/bookkeeper/documents/upload_new_document' className={scss.button+' '+scss.btnblue}>
                Upload New Document
              </Link>
              <button type='button' className={scss.button+' '+scss.btnorange}
                onClick={handleOpenModal}
              >
                Select Template
              </button>
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
        <div className={scss.tableRecords} style={{width:tableWidth+'px', marginTop: '15px'}}>
          { loader && <Loader scss={scss} position='absolute' />}
            <Table
              rowKey='id'
              columns={columns}
              pagination={false}
              dataSource={dataSource}
              rowClassName={(record) =>
                record.id === activeRowId ? scss.activeRow : ''
              }
              scroll={{ x: 'max-content' }}
            />
        </div>
        <div className={scss.pagination}>
          {
            doc.totalDocs != 0 &&
            <div className={scss.total_records}>
              {'Total Document'+ (doc.totalDocs > 1 ? 's' : '')}: <strong>{doc.totalDocs}</strong>
            </div>
          }
          <div className={scss.paginationComponent}>
            {
              doc.totalDocs ? <Pagination defaultPageSize={filter.recordsLimit} total={doc.totalDocs} onChange={handlePageChange} />
              : ''
            }
          </div>
        </div>

        <Modal
          footer={null}
          open={isModalOpen}
          onCancel={() => {
              handleCloseModal()
          }}
        >
          <form onSubmit={handleSubmitTpl} className={scss.tpls}>
            { tplLoader && <Loader scss={scss} position='absolute' />}
            <h3>
              Document Templates
            </h3>
            {
                templates.map((template, index) => (
                    <div key={index} className={scss.tpl}>
                        <label className={scss.tpltype
                            + (checkedTpl.includes(template.value) ? ' '+scss.checked : '')
                        }>
                            <Image src={'/svgs/'+template.icon} alt={template.label} priority width={40} height={40} />
                            <div>
                                <strong>
                                    {template.label}
                                </strong>
                                <p>
                                    {template.description}
                                </p>
                            </div>
                            <input type='checkbox'
                                name='user_account'
                                onKeyUp={handleBlur}
                                value={template.value}
                                checked={checkedTpl.includes(template.value)}
                                onChange={handleCheckedTpls}
                            />
                            <span className={scss.checkmark}></span>
                        </label>
                    </div>
                )
                )
            }
            <button type='submit' className={scss.button+' '+scss.btnblue} disabled={!checkedTpl?.length} onKeyDown={handleResubmit}>
              Download Template
            </button>
          </form>
        </Modal>
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
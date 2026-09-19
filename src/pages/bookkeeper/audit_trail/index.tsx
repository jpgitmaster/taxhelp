import dayjs from 'dayjs'
import Image from 'next/image'
import { Table, Pagination } from 'antd'
import scss from './styles/AuditTrail.module.scss'
import type { ColumnsType } from 'antd/es/table'
import { signOut, getSession } from 'next-auth/react'
import useAuditTrail from '@/controllers/audit_trail/useAuditTrail'
import Loader from '@/components/reusables/RotatingLoader'
import { AuditLogTableRow } from '@/controllers/audit_trail/types'
import { AUDIT_ACTIONS, AUDIT_RESOURCE_TYPES } from '@/controllers/audit_trail/constants'
import AuditTrailDropdown from '@/components/pages/bookkeeper/audit_trail/AuditTrailDropdown'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const AuditTrail_V = () => {
    const {
        data,
        loader,
        filter,
        searchInput,
        setSearchInput,
        handlePageChange,
        handleSearch,
        handleActionSelect,
        handleResourceTypeSelect,
        handleResetFilters
    } = useAuditTrail()

    const totalRecords = data?.total ?? 0
    const auditLogs = data?.auditLogs ?? []

    const dataSource: AuditLogTableRow[] = auditLogs.length ? auditLogs.map((log, index) => (
        {
            id: log.id,
            no: (filter.currentPage - 1) * filter.recordsLimit + index + 1,
            action: log.action,
            resource_type: log.resource_type ?? '',
            description: log.description,
            created_at: log.created_at ? dayjs(log.created_at).format('MM/DD/YYYY h:mm A') : '',
        }
    )) : []

    const descriptionWidth = auditLogs.length
        ? Math.min(
            620,
            Math.max(
                240,
                ...auditLogs.map((log) => (log.description?.length || 0) * 8 + 48)
            )
        )
        : 280

    const columns: ColumnsType<AuditLogTableRow> = [
        {
            title: 'No.',
            key: 'no',
            dataIndex: 'no',
            width: 80,
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            width: 140,
            render: (action: string) =>
                <span className={scss.actionBadge + ' ' + (scss[action?.toLowerCase()] || '')}>
                    {action}
                </span>
        },
        {
            title: 'Resource',
            key: 'resource_type',
            dataIndex: 'resource_type',
            width: 180,
            render: (resourceType: string) =>
                resourceType
                ? <span className={scss.resource}>{resourceType.replace(/_/g, ' ')}</span>
                : <span className={scss.resource}>—</span>
        },
        {
            title: 'Description',
            key: 'description',
            dataIndex: 'description',
            width: descriptionWidth,
            render: (description: string) =>
                <span className={scss.description}>{description}</span>
        },
        {
            title: 'Date & Time',
            key: 'created_at',
            dataIndex: 'created_at',
            width: 190,
            fixed: 'right',
        },
    ]

    return (
        <>
            <div className={scss.heroBanner}>
                <div className={scss.left}>
                    <span className={scss.badge}>
                        🔍 Audit Trail
                    </span>

                    <h1>Track Every System Action in Real Time</h1>

                    <p>
                        Monitor user activity, system changes, and critical actions
                        across your platform. Maintain full transparency and ensure
                        accountability across your organization.
                    </p>

                    <div className={scss.features}>
                        <span>
                            <Image
                                src="/svgs/check.svg"
                                alt="Check"
                                width={22}
                                height={22}
                                unoptimized
                                className={scss.check}
                            />
                            Complete Activity Logs
                        </span>

                        <span>
                            <Image
                                src="/svgs/check.svg"
                                alt="Check"
                                width={22}
                                height={22}
                                unoptimized
                                className={scss.check}
                            />
                            User & System Tracking
                        </span>

                        <span>
                            <Image
                                src="/svgs/check.svg"
                                alt="Check"
                                width={22}
                                height={22}
                                unoptimized
                                className={scss.check}
                            />
                            Private to You
                        </span>
                    </div>
                </div>

                <div className={scss.right}>
                    <div className={scss.imageContainer}>
                        <Image src='/images/taxhelp_image2_.JPG' alt="Track Every System Action in Real Time" width={400} height={200} />
                    </div>
                </div>
            </div>

            <div className={scss.stats}>
                <div className={scss.statCard}>
                    <h2>{totalRecords}</h2>
                    <span>Total Record{totalRecords > 1 ? 's' : ''}</span>
                </div>

                <div className={scss.statCard}>
                    <h2>Personal</h2>
                    <span>Only Your Activity</span>
                </div>

                <div className={scss.statCard}>
                    <h2>Real-time</h2>
                    <span>Logged Instantly</span>
                </div>

                <div className={scss.statCard}>
                    <h2>Searchable</h2>
                    <span>Filterable Records</span>
                </div>
            </div>

            <div className={scss.filters}>
                <div className={scss.dropdowns}>
                    <AuditTrailDropdown
                        label='Action'
                        placeholder='Filter by action'
                        options={AUDIT_ACTIONS}
                        value={filter.action}
                        onSelect={handleActionSelect}
                    />
                    <AuditTrailDropdown
                        label='Resource'
                        placeholder='Filter by resource'
                        options={AUDIT_RESOURCE_TYPES}
                        value={filter.resourceType}
                        onSelect={handleResourceTypeSelect}
                    />
                </div>
                <button type='button' onClick={handleResetFilters} className={`${scss.button} ${scss.btnorange} ${scss.resetButton}`}>
                    Reset Filters
                </button>
                <div className={scss.searchWrapper}>
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleSearch()
                        }}
                        className={scss.searchComponent}
                    >
                        <input id='search' type='text' name='search' maxLength={50} autoComplete='search' placeholder='Search by description...'
                            value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <button type='submit' className={`${scss.button} ${scss.btnblue}`}>
                            Search
                        </button>
                    </form>
                </div>
            </div>

            <div className={scss.tableRecords} style={{ marginTop: '15px' }}>
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
                <div className={scss.paginationComponent}>
                    {
                    totalRecords ? <Pagination defaultPageSize={filter.recordsLimit} total={totalRecords} onChange={handlePageChange} showSizeChanger={false} />
                    : ''
                    }
                </div>
            </div>
            <br />
        </>
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

export default AuditTrail_V
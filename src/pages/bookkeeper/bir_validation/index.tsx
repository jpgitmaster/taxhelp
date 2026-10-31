import dayjs from 'dayjs'
import { Table, Pagination } from 'antd'
import scss from './styles/BirValidation.module.scss'
import type { ColumnsType } from 'antd/es/table'
import { signOut, getSession } from 'next-auth/react'
import useBirValidation from '@/controllers/bir_validation/useBirValidation'
import Loader from '@/components/reusables/RotatingLoader'
import { BirValidationTableRow } from '@/controllers/bir_validation/types'
import { BIR_VALIDATION_STATUSES } from '@/controllers/bir_validation/constants'
import BirValidationStatusDropdown from '@/components/pages/bookkeeper/bir_validation/BirValidationStatusDropdown'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const stringifyError = (value: unknown): string =>
    typeof value === 'string' ? value.trim() : JSON.stringify(value) ?? String(value)

const formatErrors = (errors: unknown): string[] => {
    if (errors === null || errors === undefined) return []

    if (Array.isArray(errors)) {
        return errors.reduce<string[]>((accumulator, error) => accumulator.concat(formatErrors(error)), [])
    }

    if (typeof errors === 'object') {
        return Object.entries(errors as Record<string, unknown>)
            .map(([field, message]) => `${field}: ${stringifyError(message)}`)
            .filter(Boolean)
    }

    const message = stringifyError(errors)
    return message ? [message] : []
}

const BirValidation_V = () => {
    const {
        data,
        loader,
        filter,
        searchInput,
        setSearchInput,
        handlePageChange,
        handleSearch,
        handleStatusSelect,
        handleResetFilters
    } = useBirValidation()

    const totalRecords = data?.total ?? 0
    const validations = data?.birValidations ?? []

    const dataSource: BirValidationTableRow[] = validations.map((validation) => ({
        job_id: validation.job_id,
        user_id: validation.user_id,
        filename: validation.filename,
        status: validation.status,
        errors: validation.errors,
        created_at: validation.created_at ? dayjs(validation.created_at).format('MM/DD/YYYY h:mm A') : '',
    }))

    const columns: ColumnsType<BirValidationTableRow> = [
        {
            title: 'Job Id',
            key: 'job_id',
            dataIndex: 'job_id',
            width: 320,
            render: (jobId: string) =>
                <span className={scss.jobId} title={jobId}>{jobId}</span>
        },
        {
            title: 'Filename',
            key: 'filename',
            dataIndex: 'filename',
            width: 260,
            render: (filename: string) =>
                <span className={scss.filename}>{filename}</span>
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            width: 120,
            render: (status: string) =>
                <span className={scss.statusBadge + ' ' + (scss[status?.toLowerCase()] || '')}>
                    {status}
                </span>
        },
        {
            title: 'Errors',
            key: 'errors',
            dataIndex: 'errors',
            width: 420,
            render: (errors: unknown, row) => {
                const errorList = formatErrors(errors)

                return errorList.length
                    ? <ul className={scss.errorList}>
                        {errorList.map((error, index) =>
                            <li key={`${row.job_id}-${index}`}>{error}</li>
                        )}
                    </ul>
                    : <span className={scss.noErrors}>No errors</span>
            }
        },
        {
            title: 'User Id',
            key: 'user_id',
            dataIndex: 'user_id',
            width: 100,
            render: (userId: number) =>
                <span className={scss.userId}>{userId}</span>
        },
        {
            title: 'Validated At',
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
                        🧾 BIR Validation
                    </span>

                    <h1>Review Every Validated BIR File</h1>

                    <p>
                        Each row is one validation job, with the job id, the file that was
                        checked, its result, and every error reported while validating it.
                    </p>

                    <div className={scss.features}>
                        <span>Job Id per validation</span>
                        <span>Passed, Failed or Processing</span>
                        <span>Errors listed per file</span>
                    </div>
                </div>
            </div>

            <div className={scss.filters}>
                <div className={scss.dropdowns}>
                    <BirValidationStatusDropdown
                        label='Status'
                        placeholder='Filter by status'
                        options={BIR_VALIDATION_STATUSES}
                        value={filter.status}
                        onSelect={handleStatusSelect}
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
                        <input id='search' type='text' name='search' maxLength={50} autoComplete='search' placeholder='Search by filename...'
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
                    rowKey='job_id'
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

export default BirValidation_V

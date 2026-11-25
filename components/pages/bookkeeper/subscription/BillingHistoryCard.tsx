import { useEffect, useRef, useState } from 'react'
import SubscriptionCard from './SubscriptionCard'
import ColumnFilterTable, { ColumnFilterTableColumn } from '@/components/reusables/ColumnFilterTable'
import { Payment } from '@/controllers/subscriptions/types'
import { formatDate, formatAmount } from '@/controllers/subscriptions/format'

const columns: ColumnFilterTableColumn<Payment>[] = [
    {
        key: 'date',
        title: 'Date',
        flexible: true,
        minWidth: 130,
        render: (_value, record) => formatDate(record.paid_at ?? record.created_at),
    },
    {
        key: 'plan',
        title: 'Plan',
        flexible: true,
        minWidth: 110,
        render: (_value, record) => <span style={{textTransform: 'capitalize'}}>{record.plan}</span>,
    },
    {
        key: 'billing_cycle',
        title: 'Billing Cycle',
        flexible: true,
        minWidth: 130,
        render: (_value, record) => <span style={{textTransform: 'capitalize'}}>{record.billing_cycle}</span>,
    },
    {
        key: 'amount',
        title: 'Amount',
        flexible: true,
        minWidth: 110,
        render: (_value, record) => formatAmount(record.amount, record.currency),
    },
    {
        key: 'status',
        title: 'Status',
        flexible: true,
        minWidth: 120,
    },
]

export default function BillingHistoryCard(props: {
    payments: Payment[] | undefined
    scss: { [key: string]: string }
}) {
    const { payments, scss } = props
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [tableWidth, setTableWidth] = useState(0)
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = wrapperRef.current
        if (!el) return
        const observer = new ResizeObserver((entries) => {
            setTableWidth(entries[0].contentRect.width)
        })
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const total = payments?.length ?? 0
    const pageData = (payments ?? []).slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const statusColumns: ColumnFilterTableColumn<Payment>[] = columns.map(col =>
        col.key === 'status'
            ? {
                ...col,
                render: (_value: any, record: Payment) => (
                    <span className={scss.statusPill+' '+scss['status_'+record.status]} style={{textTransform: 'capitalize'}}>
                        {record.status}
                    </span>
                ),
            }
            : col
    )

    return (
        <SubscriptionCard
            scss={scss}
            title='Billing History'
            description='A record of your past payments and their status.'
        >
            <div ref={wrapperRef}>
                {total > 0 ? (
                    <ColumnFilterTable
                        rowKey='id'
                        columns={statusColumns}
                        dataSource={pageData}
                        width={tableWidth}
                        pagination={{
                            current: currentPage,
                            pageSize,
                            total,
                            onChange: setCurrentPage,
                            onPageSizeChange: (size) => {
                                setPageSize(size)
                                setCurrentPage(1)
                            },
                        }}
                    />
                ) : (
                    <p className={scss.emptyState}>No billing history yet.</p>
                )}
            </div>
        </SubscriptionCard>
    )
}

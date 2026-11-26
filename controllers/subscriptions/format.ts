const formatDate = (value: string | null | undefined) => {
    if (!value) return 'N/A'
    return new Date(value).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatAmount = (amount: string, currency: string) => {
    const symbol = currency === 'PHP' ? '₱' : `${currency} `
    return `${symbol}${Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`
}

const PLAN_ICON: Record<string, string> = {
    basic: '◻',
    pro: '◆',
    enterprise: '⬢',
}

export { formatDate, formatAmount, PLAN_ICON }

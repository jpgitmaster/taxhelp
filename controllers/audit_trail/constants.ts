const AUDIT_ACTIONS = [
    { value: 'CREATE', label: 'Created' },
    { value: 'UPDATE', label: 'Updated' },
    { value: 'DELETE', label: 'Deleted' },
    { value: 'LOGIN', label: 'Login' },
    { value: 'LOGOUT', label: 'Logout' },
    { value: 'UPLOAD', label: 'Upload' },
    { value: 'DOWNLOAD', label: 'Download' },
]

const AUDIT_RESOURCE_TYPES = [
    { value: 'user', label: 'User' },
    { value: 'client', label: 'Client' },
    { value: 'supplier', label: 'Supplier' },
    { value: 'customer', label: 'Customer' },
    { value: 'sale', label: 'Sale' },
    { value: 'purchase', label: 'Purchase' },
    { value: 'sales_tax', label: 'Sales Tax' },
    { value: 'purchase_tax', label: 'Purchase Tax' },
    { value: 'schedule', label: 'Schedule' },
    { value: 'schedule_category', label: 'Schedule Category' },
    { value: 'payment', label: 'Payment' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'review', label: 'Review' },
    { value: 'upload', label: 'Upload' },
    { value: 'contact_us', label: 'Contact Us' },
]

export {
    AUDIT_ACTIONS,
    AUDIT_RESOURCE_TYPES
}
import { NavLink } from "../types/cms_types";

const initCustomLinks: NavLink[] = [
    {
        active: false,
        key: 'dashboard',
        name: 'Dashboard',
        icon: 'dashboard.svg',
        iconWidth: 20,
        url: '/bookkeeper/dashboard',
    },
    {
        active: false,
        key: 'users',
        name: 'Users',
        icon: 'users.svg',
        iconWidth: 20,
        url: '',
        children: [
            {
                active: false,
                key: 'clients',
                name: 'Clients',
                url: '/bookkeeper/users/clients',
            },
            {
                active: false,
                key: 'customers',
                name: 'Customers',
                url: '/bookkeeper/users/customers',
            },
            {
                active: false,
                key: 'suppliers',
                name: 'Suppliers',
                url: '/bookkeeper/users/suppliers',
            },
        ]
    },
    // {
    //     active: false,
    //     key: 'clients',
    //     name: 'Clients',
    //     icon: 'users.svg',
    //     iconWidth: 20,
    //     url: '/bookkeeper/clients',
    // },
    {
        active: false,
        key: 'documents',
        name: 'Documents',
        icon: 'documents.svg',
        iconWidth: 20,
        url: '/bookkeeper/documents',
    },
    {
        active: false,
        key: 'sales',
        name: 'Sales',
        icon: 'sales.svg',
        iconWidth: 20,
        url: '/bookkeeper/sales',
    },
    {
        active: false,
        key: 'purchases',
        name: 'Purchases',
        icon: 'purchase.svg',
        iconWidth: 20,
        url: '/bookkeeper/purchases',
    },
    {
        active: false,
        key: 'receipts',
        name: 'Receipts',
        icon: 'receipts.svg',
        iconWidth: 20,
        url: '/bookkeeper/receipts',
    },
    {
        active: false,
        key: 'disbursements',
        name: 'Disbursements',
        icon: 'disbursements.svg',
        iconWidth: 20,
        url: '/bookkeeper/disbursements',
    },
    {
        active: false,
        key: 'general_journal',
        name: 'General Journal',
        icon: 'journal.svg',
        iconWidth: 20,
        url: '/bookkeeper/general_journal',
    },
    {
        active: false,
        key: 'general_ledger',
        name: 'General Ledger',
        icon: 'ledger.svg',
        iconWidth: 20,
        url: '/bookkeeper/general_ledger',
    },
    // {
    //     active: false,
    //     key: 'books_of_accounts',
    //     name: 'Book of Accounts',
    //     icon: 'book.svg',
    //     iconWidth: 20,
    //     url: '/bookkeeper/book_of_accounts',
    // },
    {
        active: false,
        key: 'file_generator',
        name: 'File Generator',
        icon: 'file_generator.svg',
        iconWidth: 20,
        url: '',
        children: [
            {
                active: false,
                key: 'book_of_accounts',
                name: 'Book of Accounts',
                url: '/bookkeeper/file_generator/book_of_accounts',
            },
            {
                active: false,
                key: 'dat_file',
                name: 'DAT File',
                url: '/bookkeeper/file_generator/dat_file',
            },
        ]
    },
]
const initDatLinks: NavLink[] = [
    {
        active: false,
        key: 'dashboard',
        name: 'Dashboard',
        icon: 'dashboard.svg',
        iconWidth: 20,
        url: '/bookkeeper/dashboard',
    },
    {
        active: false,
        key: 'clients',
        name: 'Clients',
        icon: 'users.svg',
        iconWidth: 20,
        url: '/bookkeeper/clients',
    },
    {
        active: false,
        key: 'dat_file',
        name: 'DAT File',
        icon: 'dat_file.svg',
        iconWidth: 20,
        url: '/bookkeeper/dat_file',
    },
    {
        active: false,
        key: 'audit_trail',
        name: 'Audit Trail',
        icon: 'audit_trail.svg',
        iconWidth: 20,
        url: '/bookkeeper/audit_trail',
    },
]
export {
    initDatLinks,
    initCustomLinks
};
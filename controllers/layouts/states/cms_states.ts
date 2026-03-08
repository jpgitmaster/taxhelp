import { NavLink } from "../types/cms_types";

const initLinks: NavLink[] = [
    {
        active: false,
        key: 'dashboard',
        name: 'Dashboard',
        icon: 'dashboard.svg',
        iconWidth: 20,
        url: '/bookkeeper/dashboard',
    },
    // {
    //     active: false,
    //     key: 'web',
    //     name: 'Web',
    //     icon: 'navigation.svg',
    //     iconWidth: 20,
    //     url: '',
    //     children: [
    //         {
    //             active: false,
    //             key: 'masterpage',
    //             name: 'Masterpage',
    //             url: '/bookkeeper/web/masterpage',
    //         },
    //         {
    //             active: false,
    //             key: 'navigation',
    //             name: 'Navigation',
    //             url: '/bookkeeper/web/navigation',
    //         },
    //         {
    //             active: false,
    //             key: 'pages',
    //             name: 'Pages',
    //             url: '/bookkeeper/web/pages',
    //         },
    //         {
    //             active: false,
    //             key: 'posts',
    //             name: 'Posts',
    //             url: '/bookkeeper/web/posts',
    //         },
    //         {
    //             active: false,
    //             key: 'images',
    //             name: 'Images',
    //             url: '/bookkeeper/web/images',
    //         },
    //     ]
    // },
    {
        active: false,
        key: 'clients',
        name: 'Clients',
        icon: 'users.svg',
        iconWidth: 20,
        url: '/bookkeeper/clients',
        // children: [
        //     // {
        //     //     active: false,
        //     //     key: 'create_user',
        //     //     name: 'Create User',
        //     //     url: '/bookkeeper/users/create_user',
        //     // },
        //     // {
        //     //     active: false,
        //     //     key: 'taxhelp_users',
        //     //     name: 'TaxHelp Users',
        //     //     url: '/bookkeeper/users/taxhelp_users',
        //     // },
        //     // {
        //     //     active: false,
        //     //     key: 'bookkeepers',
        //     //     name: 'Bookkeepers',
        //     //     url: '/bookkeeper/users/bookkeepers',
        //     // },
        //     // {
        //     //     active: false,
        //     //     key: 'customers',
        //     //     name: 'Customers',
        //     //     url: '/bookkeeper/users/customers',
        //     // },
        // ]
    },
    // {
    //     active: false,
    //     key: 'sales',
    //     name: 'Sales',
    //     icon: 'sales.svg',
    //     iconWidth: 20,
    //     url: '/bookkeeper/sales',
    // },
    // {
    //     active: false,
    //     key: 'purchases',
    //     name: 'Purchases',
    //     icon: 'purchase.svg',
    //     iconWidth: 20,
    //     url: '/bookkeeper/purchases',
    // },
    // {
    //     active: false,
    //     key: 'receipts',
    //     name: 'Receipts',
    //     icon: 'receipts.svg',
    //     iconWidth: 20,
    //     url: '/bookkeeper/receipts',
    // },
    // {
    //     active: false,
    //     key: 'disbursements',
    //     name: 'Disbursements',
    //     icon: 'disbursements.svg',
    //     iconWidth: 20,
    //     url: '/bookkeeper/disbursements',
    // },
    // {
    //     active: false,
    //     key: 'general_journal',
    //     name: 'General Journal',
    //     icon: 'journal.svg',
    //     iconWidth: 20,
    //     url: '/bookkeeper/general_journal',
    // },
    // {
    //     active: false,
    //     key: 'books_of_accounts',
    //     name: 'Book of Accounts',
    //     icon: 'journal.svg',
    //     iconWidth: 20,
    //     url: '/bookkeeper/books_of_accounts',
    // },
    {
        active: false,
        key: 'dat_file',
        name: 'DAT File',
        icon: 'journal.svg',
        iconWidth: 20,
        url: '/bookkeeper/dat_file',
    },
    // {
    //     active: false,
    //     key: 'reports',
    //     name: 'Reports',
    //     icon: 'reports.svg',
    //     iconWidth: 20,
    //     url: '/bookkeeper/reports',
    //     children: [
    //         {
    //             active: false,
    //             key: 'books_of_accounts',
    //             name: 'Book of Accounts',
    //             url: '/bookkeeper/reports/books_of_accounts',
    //         },
    //         {
    //             active: false,
    //             key: 'financial_statements',
    //             name: 'Financial Statements',
    //             url: '/bookkeeper/reports/financial_statements',
    //         },
    //         {
    //             active: false,
    //             key: 'dat_file',
    //             name: 'DAT File',
    //             url: '/bookkeeper/reports/dat_file',
    //         },
    //     ]
    // },
    // {
    //     active: false,
    //     key: 'roles',
    //     name: 'Roles',
    //     icon: 'task.svg',
    //     iconWidth: 20,
    //     url: '/bookkeeper/roles',
    //     children: [
    //         {
    //             active: false,
    //             key: 'create_role',
    //             name: 'Create Role',
    //             url: '/bookkeeper/roles/create_role',
    //         },
    //     ]
    // },
]
export {
    initLinks
};
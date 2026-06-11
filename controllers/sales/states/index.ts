import { initCustomerObj } from '@/controllers/customers/states'
const initSalesObj = {
    id: null,
    atc: '',
    terms: '',
    vat_type: 'INCLUSIVE',
    ewt_rate: '',
    vat_rate: '12%',
    tax_amount: '',
    vat_amount: '',
    toDelete: false,
    particulars: '',
    account_name: '',
    gross_amount: '',
    exempt_sales: '',
    invoice_date: '',
    gross_taxable: '',
    vatable_sales: '',
    taxable_month: null,
    invoice_number: '',
    zero_rated_sales: '',
    total_gross_amount: '',
    customer: {
        ...initCustomerObj,
        classification: ''
    }
}
const initSales = {
    salesArr: [],
    salesErr: {

    },
    totalSales: 0,
    salesObj: initSalesObj,
}

export {
    initSales
};
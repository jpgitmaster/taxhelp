const initSalesObj = {
    id: null,
    atc: '',
    terms: '',
    ewt_rate: '',
    vat_rate: '',
    tax_amount: '',
    vat_amount: '',
    particulars: '',
    gross_amount: '',
    account_name: '',
    exempt_sales: '',
    invoice_date: '',
    gross_taxable: '',
    vatable_sales: '',
    taxable_month: '',
    first_address: '',
    invoice_number: '',
    second_address: '',
    zero_rated_sales: '',
    business_profile: {
        tin: '',
        last_name: '',
        first_name: '',
        middle_name: '',
        branch_code: '',
        registered_name: ''
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
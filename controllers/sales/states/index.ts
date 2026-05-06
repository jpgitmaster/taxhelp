const initSalesObj = {
    id: null,
    atc: '',
    terms: '',
    vat_type: 'INCLUSIVE',
    ewt_rate: '',
    vat_rate: '',
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
        tin: '',
        last_name: '',
        first_name: '',
        trade_name: '',
        middle_name: '',
        branch_code: '',
        first_address: '',
        classification: '',
        second_address: '',
        registered_name: '',
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
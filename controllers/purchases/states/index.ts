const initPurchasesObj = {
    id: null,
    atc: '',
    terms: '',
    vat_rate: '',
    wtax_rate: '',
    vat_amount: '',
    wtax_amount: '',
    particulars: '',
    toDelete: false,
    invoice_date: '',
    account_name: '',
    gross_amount: '',
    gross_taxable: '',
    taxable_month: '',
    invoice_number: '',
    exempt_purchases: '',
    vatable_purchases: '',
    zero_rated_purchases: '',
    vatable_purchase_of_services: '',
    vatable_purchase_of_other_goods: '',
    vatable_purchase_of_capital_goods: '',
    business_profile: {
        tin: '',
        last_name: '',
        first_name: '',
        middle_name: '',
        branch_code: '',
        first_address: '',
        second_address: '',
        registered_name: '',
    }
}
const initPurchases = {
    purchasesArr: [],
    purchasesErr: {

    },
    totalPurchases: 0,
    purchasesObj: initPurchasesObj,
}

export {
    initPurchases
};
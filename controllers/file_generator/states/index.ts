const initRecordObj = {
    id: null,
    terms: '',
    particulars: '',
    account_name: '',
    invoice_date: null,
    taxable_month: null,
    business_profile: {
        tin: '',
        name: '',
        branch_code: '',
        registered_name: ''
    }
}
const initRecord = {
    recordArr: [],
    recordErr: {
        
    },
    totalRecords: 0,
    recordObj: initRecordObj,
}

export {
    initRecord
};
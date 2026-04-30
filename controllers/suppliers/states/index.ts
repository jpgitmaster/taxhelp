const initSupplierObj = {
    id: null,
    tin: '',
    email: '',
    last_name: '',
    trade_name: '',
    first_name: '',
    middle_name: '',
    registered_name: '',
    classification: 'INDIVIDUAL',
}
const initSupplier = {
    supplierArr: [],
    supplierErr: {
        tin: '',
        email: '',
        last_name: '',
        trade_name: '',
        first_name: '',
        middle_name: '',
        classification: 'INDIVIDUAL',
    },
    totalSuppliers: 0,
    supplierObj: initSupplierObj,
}

export {
    initSupplier
};
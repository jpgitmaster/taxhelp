const initSupplierObj = {
    id: null,
    tin: '',
    email: '',
    phone: '',
    last_name: '',
    trade_name: '',
    first_name: '',
    middle_name: '',
    first_address: '',
    second_address: '',
    registered_name: '',
    classification: 'INDIVIDUAL',
}
const initSupplier = {
    supplierArr: [],
    supplierErr: {
        tin: '',
        email: '',
        phone: '',
        last_name: '',
        trade_name: '',
        first_name: '',
        middle_name: '',
        first_address: '',
        second_address: '',
        registered_name: '',
        classification: '',
    },
    totalSuppliers: 0,
    supplierObj: initSupplierObj,
}

export {
    initSupplier
};
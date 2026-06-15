const initSupplierObj = {
    id: null,
    tin: '',
    email: '',
    last_name: '',
    trade_name: '',
    first_name: '',
    postal_code: '',
    middle_name: '',
    phone_number: '',
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
        last_name: '',
        trade_name: '',
        first_name: '',
        postal_code: '',
        middle_name: '',
        phone_number: '',
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
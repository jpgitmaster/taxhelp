const initSupplierObj = {
    id: null,
    tin: '',
    city: '',
    email: '',
    phone: '',
    street: '',
    zip_code: '',
    barangay: '',
    district: '',
    last_name: '',
    sub_street: '',
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
        city: '',
        email: '',
        phone: '',
        street: '',
        zip_code: '',
        barangay: '',
        district: '',
        last_name: '',
        sub_street: '',
        trade_name: '',
        first_name: '',
        middle_name: '',
        registered_name: '',
        classification: '',
    },
    totalSuppliers: 0,
    supplierObj: initSupplierObj,
}

export {
    initSupplier
};
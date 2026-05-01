const initCustomerObj = {
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
const initCustomer = {
    customerArr: [],
    customerErr: {
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
    totalCustomers: 0,
    customerObj: initCustomerObj,
}

export {
    initCustomer
};
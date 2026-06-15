const initCustomerObj = {
    id: null,
    tin: '',
    email: '',
    last_name: '',
    trade_name: '',
    first_name: '',
    middle_name: '',
    postal_code: '',
    phone_number: '',
    first_address: '',
    second_address: '',
    registered_name: '',
    classification: 'INDIVIDUAL',
}
const initCustomer = {
    customerArr: [],
    customerErr: {
        tin: '',
        email: '',
        last_name: '',
        trade_name: '',
        first_name: '',
        middle_name: '',
        postal_code: '',
        phone_number: '',
        first_address: '',
        second_address: '',
        registered_name: '',
        classification: '',
    },
    totalCustomers: 0,
    customerObj: initCustomerObj,
}

export {
    initCustomer,
    initCustomerObj
};
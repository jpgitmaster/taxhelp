const initCustomerObj = {
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
const initCustomer = {
    customerArr: [],
    customerErr: {
        tin: '',
        email: '',
        last_name: '',
        trade_name: '',
        first_name: '',
        middle_name: '',
        classification: 'INDIVIDUAL',
    },
    totalCustomers: 0,
    customerObj: initCustomerObj,
}

export {
    initCustomer
};
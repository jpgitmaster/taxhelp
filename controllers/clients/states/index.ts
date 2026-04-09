const initClientObj = {
    id: null,
    tin: '',
    city: '',
    email: '',
    phone: '',
    fiscal: '12',
    street: '',
    zip_code: '',
    district: '',
    barangay: '',
    last_name: '',
    sub_street: '',
    first_name: '',
    middle_name: '',
    branch_code: '',
    classification: '',
    corporate_email: '',
    registered_name: '',
    
}
const initClient = {
    clientArr: [],
    clientErr: {
        tin: '',
        city: '',
        email: '',
        phone: '',
        fiscal: '',
        street: '',
        zip_code: '',
        district: '',
        barangay: '',
        last_name: '',
        sub_street: '',
        first_name: '',
        middle_name: '',
        branch_code: '',
        classification: '',
        corporate_email: '',
        registered_name: '',
    },
    totalClients: 0,
    clientObj: initClientObj,
}

export {
    initClient
};
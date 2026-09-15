const initUserObj = {
    id: null,
    email: '',
    lastName: '',
    firstName: '',
    middleName: '',
    isActive: null,
    role: [],
    password: '',
    birthdate: '',
    newPassword: '',
    confirmPassword: '',
    confirmNewPassword: ''
}
const initUser = {
    userArr: [],
    userErr: {
        role: '',
        email: '',
        lastName: '',
        password: '',
        firstName: '',
        birthdate: '',
        confirmPassword: '',
    },
    totalUsers: 0,
    userObj: initUserObj,
}

export {
    initUser
};
const initUserObj = {
    id: null,
    email: '',
    lastName: '',
    firstName: '',
    isActive: null,
    role: [],
    password: '',
    birthdate: '',
    confirmPassword: '',
    
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
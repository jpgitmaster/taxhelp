const initUserObj = {
    id: null,
    email: '',
    lastName: '',
    firstName: '',
    isActive: null,
    role: {
        id: null,
        name: '',
        color: '210, 213, 214',
    },
    password: '',
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
        confirmPassword: '',
    },
    totalUsers: 0,
    userObj: initUserObj,
}

export {
    initUser
};
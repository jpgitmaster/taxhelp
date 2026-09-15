interface UserObj{
  email: string
  role: string[]
  id: number | null
  lastName: string
  firstName: string
  middleName: string
  password?: string
  birthdate: string
  newPassword?: string
  confirmPassword?: string
  isActive: boolean | null
  confirmNewPassword?: string
}

interface User{
    userObj: UserObj
    userArr: UserObj[]
    totalUsers: number
    userErr: Record<string, string | { value: string; }>
}

export type {
    User,
    UserObj,
}
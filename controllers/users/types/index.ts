interface UserObj{
  email: string
  role: string[]
  id: number | null
  firstName: string
  lastName: string
  password?: string
  birthdate: string
  confirmPassword?: string
  isActive: boolean | null
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
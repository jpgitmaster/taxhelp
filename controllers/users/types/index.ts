interface UserObj{
  email: string
  id: number | null
  firstName: string
  lastName: string
  role: {
    id: number | null
    name: string
    color: string
  }
  isActive: boolean | null
  password?: string
  confirmPassword?: string
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
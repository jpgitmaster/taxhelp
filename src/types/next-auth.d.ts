import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

interface User_ {
  email: string
  lastName: string
  firstName: string
  role: {
    name: string
    color: string
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    id?: number
    user?: User_ | unknown
    accessToken?: string
    refreshToken?: string
  }

  interface User extends DefaultUser {
    accessToken?: string
    refreshToken?: string
    user?: User_
    accessTokenExpires?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: string
    user: User_
  }
}
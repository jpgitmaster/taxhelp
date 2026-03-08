import { DefaultJWT } from 'next-auth/jwt'
import { DefaultSession } from 'next-auth'
interface User_ {
  email: string
  lastName: string
  firstName: string
  role: {
    name: string
    color: string
  }
}
declare module 'next-auth' {
  interface Session extends DefaultSession {
    id?: number
    user?: User_ | unknown
    accessToken?: string // Add your custom properties here
    refreshToken?: string // If you also need the refresh token
    // Add any other custom properties you want to expose on the session
  }
  interface User extends DefaultUser {
    accessToken?: string // Add accessToken to the User type
    refreshToken?: string
    user?: User_
    accessTokenExpires?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken?: string; // Add your custom properties here
    refreshToken?: string; // If you also need the refresh token
    accessTokenExpires?: string
    user: User_
    // Add any other custom properties you added to the token in the jwt callback
  }
}
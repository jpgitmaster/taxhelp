import { DefaultJWT } from 'next-auth/jwt'
import { DefaultSession } from 'next-auth'
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string  // ✅ ID should be inside `user`
      email?: string | null
      name?: string | null
    } & DefaultSession["user"]
    tokenType?: string
    accessToken?: string
    refreshToken?: string
    error?: string
  }
  interface User extends DefaultUser {
    tokenType?: string
    accessToken?: string // Add accessToken to the User type
    refreshToken?: string
    accessTokenExpires?: number 
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string
    error?: string
    tokenType?: string
    accessToken?: string // Add your custom properties here
    refreshToken?: string // If you also need the refresh token
    accessTokenExpires?: number // ✅ FIX: use number
    // Add any other custom properties you added to the token in the jwt callback
  }
}
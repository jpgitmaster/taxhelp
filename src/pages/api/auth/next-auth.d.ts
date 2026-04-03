import { DefaultJWT } from 'next-auth/jwt'
import { DefaultSession } from 'next-auth'
declare module 'next-auth' {
  interface Session extends DefaultSession {
    id?: number
    // Add any other custom properties you want to expose on the session
  }
  interface User extends DefaultUser {
    accessToken?: string // Add accessToken to the User type
    refreshToken?: string
    accessTokenExpiresIn?: number 
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken?: string; // Add your custom properties here
    refreshToken?: string; // If you also need the refresh token
    accessTokenExpires?: number // ✅ FIX: use number
    // Add any other custom properties you added to the token in the jwt callback
  }
}
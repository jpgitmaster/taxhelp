import Axios from 'axios'
import NextAuth from 'next-auth'
import { signOut } from 'next-auth/react'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

const env = process.env
const apiVersion = env?.NEXT_PUBLIC_API_VERSION

export default NextAuth({
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const {
            id,
            email,
            accessToken,
            refresh_token,
            accessTokenExpiresIn,
          } = credentials as {
            id:  number
            email: string
            password: string
            accessToken: string
            refresh_token: string
            accessTokenExpiresIn: number
          }
          const userDetails = {
            id: String(id),
            accessToken: accessToken,
            refreshToken: refresh_token,
            accessTokenExpiresIn: Number(accessTokenExpiresIn),
          }
          
          if (!email || !id) { // Example of basic validation
            throw new Error('Invalid credentials provided.');
          }
          return userDetails;
        } catch (error) {
          console.error("Authorization error:", error);
          // This is crucial: Returning null or throwing an error informs NextAuth.js that authentication failed.
          throw new Error("Invalid credentials"); // Or more specific error messages
        }
      }
    }),
    GoogleProvider({
        clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
        clientSecret: env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        },
    })
    // ...add more providers here
  ],
  callbacks: {
    jwt: async ({ token, user}) => {
      if (user && user.accessToken) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.accessTokenExpires = Date.now() + Number(user.accessTokenExpiresIn) * 1000
      }
      console.log('date')
      console.log(apiVersion)
      console.log(Date.now())
      console.log(token.accessTokenExpires)
      // ✅ IF TOKEN NOT EXPIRED → RETURN
      if(token.accessTokenExpires){
        if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
          return token;
        }
      }
      
      // REFRESH TOKEN
      try {
        const res = await Axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/${apiVersion}/auth/refresh`, {
          refresh_token: token.refreshToken,
        })
        console.log('results')
        console.log(res)
        const data = res.data

        token.accessToken = `${data.token_type} ${data.access_token}`
        token.accessTokenExpires = Date.now() + data.expires_in * 1000

        return token
      } catch (error) {
        console.error('Refresh token error:', error)

        // ❗ DO NOT call signOut here (server-side)
        token.error = 'RefreshAccessTokenError'
        return token
      }
    },
    session: ({ session, token }) => {
      if(token){
        session.accessToken = token.accessToken
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
  },
  // pages: {
  //   signIn: '/login'
  // },
  secret: env.NEXTAUTH_SECRET,
})
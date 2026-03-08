import Axios from 'axios'
import NextAuth from 'next-auth'
import { signOut } from 'next-auth/react'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
const env = process.env

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
            roleName,
            lastName,
            firstName,
            roleColor,
            accessToken,
            refreshToken,
            accessTokenExpiresIn,
          } = credentials as {
            id:  number
            email: string
            roleName: string
            password: string
            lastName: string
            roleColor: string
            firstName: string
            accessToken: string
            refreshToken: string
            accessTokenExpiresIn: string
          }
          const userDetails = {
            id: String(id),
            accessToken: accessToken,
            refreshToken: refreshToken,
            accessTokenExpires: accessTokenExpiresIn,
            user:  {
              email: email,
              lastName: lastName,
              firstName: firstName,
              role: {
                name: roleName,
                color: roleColor
              }
            }
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
    jwt: async ({ token, user:userDetails }) => {
      if(userDetails?.user){
        token.id = userDetails.id
        token.user = userDetails.user
        token.accessToken = userDetails.accessToken
        token.refreshToken = userDetails.refreshToken
        token.accessTokenExpiresIn = userDetails.accessTokenExpires
      }
      // RE-GENERATE NEW TOKEN
      if(token.accessTokenExpiresIn){
        if(new Date() > new Date(String(token.accessTokenExpiresIn))){
          console.log('access token expired')
          await Axios({
              method: 'POST',
              url: `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
              data: {
                  email: token.user?.email,
                  refresh: token.refreshToken
              }
          }).then((res) => {
            const { accessToken } = res?.data
            token.accessToken = accessToken
          }).catch(async (error) => {
            console.log('error')
            console.log(error.response?.data)
            return await signOut({redirect: true, callbackUrl: '/login'})
          })
        }
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token?.user) {
        session.user = token.user
        session.id = Number(token.id)
        session.accessToken = token.accessToken
        session.refreshToken = token.refreshToken
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
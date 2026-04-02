import NextAuth from 'next-auth'
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
            accessToken,
            refreshToken,
            accessTokenExpiresIn,
          } = credentials as {
            id:  number
            email: string
            password: string
            accessToken: string
            refreshToken: string
            accessTokenExpiresIn: string
          }
          const userDetails = {
            id: String(id),
            accessToken: accessToken,
            refreshToken: refreshToken,
            accessTokenExpires: accessTokenExpiresIn,
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
      }
      return token;
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
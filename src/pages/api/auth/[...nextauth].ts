import NextAuth from 'next-auth'
import api from '@/components/reusables/axios'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

const env = process.env
let refreshPromises: Record<string, Promise<any>> = {};
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
            tokenType,
            accessToken,
            refresh_token,
            accessTokenExpires,
          } = credentials as {
            id:  number
            email: string
            password: string
            tokenType: string
            accessToken: string
            refresh_token: string
            accessTokenExpires: number
          }
          const userDetails = {
            id: String(id),
            tokenType: tokenType,
            accessToken: accessToken,
            refreshToken: refresh_token,
            accessTokenExpires: Number(accessTokenExpires),
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
    jwt: async ({ token, user }) => {
      if (user && user.accessToken) {
        token.accessToken = user.accessToken;
        token.accessTokenExpires = Date.now() + Number(user.accessTokenExpires) * 1000;
        token.refreshToken = user.refreshToken;
      }

      // Token still valid
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      if (!token.refreshToken) {
        token.error = 'NoRefreshToken';
        return token;
      }

      // At this point, token.refreshToken is guaranteed to be a string
      if (!refreshPromises[token.refreshToken]) {
        refreshPromises[token.refreshToken] = (async () => {
          try {
            const response = await api.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/auth/refresh`,
              { refresh_token: token.refreshToken }
            );
            const res = response.data.data;
            token.accessToken = res.access_token;
            token.refreshToken = res.refresh_token;
            token.accessTokenExpires = Date.now() + res.expires_in * 1000;
            return token;
          } catch (err: any) {
            token.error = 'RefreshAccessTokenError';
            return token;
          } finally {
            delete refreshPromises[token.refreshToken as string]; // Safe because token.refreshToken is defined
          }
        })();
      }

      return await refreshPromises[token.refreshToken];
    },
    session: ({ session, token }) => {
      if (token) {
        session.tokenType = token.tokenType;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.error = typeof token.error === 'string' ? token.error : undefined;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  // pages: {
  //   signIn: '/login'
  // },
  secret: env.NEXTAUTH_SECRET,
})
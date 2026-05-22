import axios from 'axios';
import NextAuth from 'next-auth'
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
            refreshToken,
            accessTokenExpires,
          } = credentials as {
            id:  number
            email: string
            password: string
            tokenType: string
            accessToken: string
            refreshToken: string
            accessTokenExpires: number
          }
          const userDetails = {
            id: String(id),
            email: email,
            tokenType: tokenType,
            accessToken: accessToken,
            refreshToken: refreshToken,
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
        token.id = user.id;
        token.email = user.email;
        token.tokenType = user.tokenType;
        token.accessToken = user.accessToken;
        token.accessTokenExpires = Date.now() + Number(user.accessTokenExpires) * 1000;
        token.refreshToken = user.refreshToken;
      }
      console.log('JWT CHECK', {
        now: Date.now(),
        expires: token.accessTokenExpires,
        expired: Date.now() > Number(token.accessTokenExpires),
      });
      // Token still valid
            /**
       * No access token at all
       */
      if (!token.accessToken) {
        token.error = 'NoAccessToken';
        return token;
      }

      /**
       * Refresh 1 minute BEFORE expiry
       */
      const shouldRefresh =
        !token.accessTokenExpires ||
        Date.now() >=
          Number(token.accessTokenExpires) - 60_000;

      /**
       * Token still valid
       */
      if (!shouldRefresh) {
        return token;
      }

      /**
       * Missing refresh token
       */
      if (!token.refreshToken) {
        token.error = 'NoRefreshToken';
        return token;
      }

      // At this point, token.refreshToken is guaranteed to be a string
      const currentRefreshToken = token.refreshToken as string;

      if (!refreshPromises[currentRefreshToken]) {
        refreshPromises[currentRefreshToken] = (async () => {
          try {
            console.log('REFRESHING TOKEN');

            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/auth/refresh`,
              {
                refresh_token: currentRefreshToken,
              }
            );

            const res = response.data.user;

            token.accessToken = res.access_token;
            token.refreshToken = res.refresh_token;
            console.log('LOGIN EXPIRES RAW', user?.accessTokenExpires);
            /**
             * expires_in should be seconds remaining
             */
            token.accessTokenExpires =
              Date.now() + Number(res.expires_in) * 1000;
            
            token.error = undefined;

            console.log('TOKEN REFRESH SUCCESS');

            return token;
          } catch (err) {
            console.error('TOKEN REFRESH FAILED', err);

            token.error = 'RefreshAccessTokenError';

            return token;
          } finally {
            delete refreshPromises[currentRefreshToken];
          }
        })();
      }

      return refreshPromises[currentRefreshToken];
    },
    session: ({ session, token }) => {
      if (token) {
        session.user = {
          id: token.id ?? "",      // fallback to empty string
          email: token.email ?? "", // fallback to empty string
          name: session.user?.name ?? null
        };
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
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
} from 'axios';

import { signOut } from 'next-auth/react';
import { Session } from '@/controllers/layouts/types/cms_types';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

/**
 * Always fetch latest session from NextAuth
 * Never cache this globally
 */
const getSessionSafe = async (): Promise<Session | null> => {
  try {
    const res = await fetch('/api/auth/session', {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Failed to fetch session', error);
    return null;
  }
};

/**
 * REQUEST INTERCEPTOR
 */
api.interceptors.request.use(
  async (config) => {
    const isAuthRoute =
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/refresh');

    if (!isAuthRoute) {
      const session = await getSessionSafe();

      if (session?.accessToken) {
        config.headers = config.headers || {};

        (config.headers as Record<string, string>).Authorization =
          `${session.tokenType ?? 'Bearer'} ${session.accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 *
 * NextAuth already handles refresh.
 * If we still get 401 here,
 * session is invalid → logout.
 */
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    const isUnauthorized =
      error.response?.status === 401;

    const isRefreshRoute =
      originalRequest?.url?.includes('/auth/refresh');

    if (isUnauthorized && !isRefreshRoute) {
      try {
        const res = await fetch('/api/auth/session', {
          cache: 'no-store',
        });

        const session = await res.json();

        /**
         * Only logout if refresh already failed
         */
        if (
          session?.error === 'RefreshAccessTokenError' ||
          session?.error === 'NoRefreshToken'
        ) {
          console.log('Unauthorized → signing out');

          await signOut({
            callbackUrl: '/',
            redirect: true,
          });
        }
      } catch (err) {
        console.error('Session validation failed', err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
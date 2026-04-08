import { signOut } from 'next-auth/react';
import { Session } from '@/controllers/layouts/types/cms_types';
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let cachedSession: Session | null = null;
let refreshing: Promise<Session | null> | null = null;

const getSessionSafe = async (): Promise<Session | null> => {
  if (cachedSession) return cachedSession;

  if (!refreshing) {
    refreshing = fetch('/api/auth/session')
      .then((res) => res.json() as Promise<Session>)
      .finally(() => { refreshing = null; });
  }

  const session = await refreshing;
  cachedSession = session;
  return session;
};

// REQUEST INTERCEPTOR
api.interceptors.request.use(async (config) => {
  if (
    config.url &&
    !config.url.includes('/auth/login') &&
    !config.url.includes('/auth/refresh')
  ) {
    const session = await getSessionSafe();
    if (session?.accessToken) {
      cachedSession = session; // store the latest token
    }
    if (session?.accessToken) {
      config.headers = config.headers || {};
      (config.headers as Record<string, string>).Authorization = `${session.tokenType ?? 'Bearer'} ${session.accessToken}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    const isUnauthorized = error.response?.status === 401;

    if (
      isUnauthorized &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        // ⚠️ This does NOT refresh token — just re-gets session
        const session = await getSessionSafe();

        if (session?.accessToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization =
            `${session.tokenType ?? 'Bearer'} ${session.accessToken}`;

          return api(originalRequest);
        }
      } catch (err) {
        console.error('Retry failed', err);
      }
    }

    // ❗ FINAL fallback → FORCE LOGOUT
    if (isUnauthorized) {
      cachedSession = null;
      refreshing = null;

      console.log("Unauthorized → signing out");

      await signOut({ callbackUrl: '/' });
    }

    return Promise.reject(error);
  }
);

export default api;
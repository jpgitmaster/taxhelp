// lib/axios.ts
import { getSession, signOut } from 'next-auth/react';
import axios, { AxiosInstance, AxiosError } from 'axios';

// Create a new instance of Axios with base configurations
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g., 'https://your-backend-api.com/api'
  withCredentials: true, // Essential for sending cookies (e.g., HTTP-only refresh token)
});

// Add a request interceptor to attach the access token to outgoing requests
api.interceptors.request.use(
  async (config) => {
    // Exclude authentication-related endpoints from token attachment
    if (config.url && !config.url.includes('/auth/login')) {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration (401 Unauthorized)
api.interceptors.response.use(
  (response) => response, // If the response is successful, just return it
  async (error: AxiosError) => {
    const originalRequest = error.config;
    // Check if the error is a 401 Unauthorized and if the original request
    // was not to the refresh token endpoint (which is handled by NextAuth.js's jwt callback)
    // and if it hasn't been retried already (though less likely with this simplified flow)
    if (
      error.response?.status === 401 &&
      originalRequest?.url &&
      !originalRequest.url.includes('/auth/refresh-token')
    ) {
      // Attempt to refresh the session.
      // This will trigger the `jwt` callback in `[...nextauth].ts`
      // which should handle the actual token refresh via your backend.
      const session = await getSession();

      if (session?.accessToken) {
        // If a new access token is successfully obtained, update the original request's header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
        }
        // Retry the original request with the new token
        return api(originalRequest);
      } else {
        // If no new access token is available after attempting refresh,
        // it means the session is invalid (e.g., refresh token expired or invalid).
        // Sign out the user and redirect to login.
        if (typeof window !== 'undefined') {
          signOut({ callbackUrl: '/login' }); // Specify your login page as the callback URL
        }
        return Promise.reject(error); // Propagate the original 401 error
      }
    }

    // For any other error, just reject the promise as normal.
    return Promise.reject(error);
  }
);

// Export the custom Axios instance for use throughout your application
export default api;
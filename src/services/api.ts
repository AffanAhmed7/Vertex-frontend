import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true, // Needed for cookies (refresh tokens if used) or CORS
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach access token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // If we are sending FormData, let the browser/axios set the correct Content-Type (with boundary)
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle 401s and token refresh
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If the error status is 401 and there is no originalRequest._retry flag,
        // it means the token has expired and we need to refresh it
        // BUT don't do this for login/register/google routes as they handle their own 401s
        const isAuthRoute = originalRequest.url?.includes('/auth/login') || 
                            originalRequest.url?.includes('/auth/register') || 
                            originalRequest.url?.includes('/auth/google');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Attempt to refresh the token using another axios instance to avoid interceptor loop
                const refreshApi = axios.create({
                    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
                    headers: { 'Content-Type': 'application/json' }
                });

                const response = await refreshApi.post('/auth/refresh', { refreshToken });

                if (response.data.success) {
                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
                    
                    localStorage.setItem('accessToken', newAccessToken);
                    if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

                    // Update the authorization header and retry the original request
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } else {
                    throw new Error('Refresh token invalid');
                }
            } catch (refreshError) {
                // If refresh fails, log the user out
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/'; // Or dispatch a logout action
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

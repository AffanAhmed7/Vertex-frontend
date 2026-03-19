import api from './api';

export interface AuthResponse {
    success: boolean;
    message: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: 'CUSTOMER' | 'ADMIN';
    };
    accessToken: string;
    refreshToken: string;
}

export const authService = {
    async login(data: any): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    async register(data: any): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    async logout(refreshToken: string): Promise<{ success: boolean }> {
        const response = await api.post('/auth/logout', { refreshToken });
        return response.data;
    },

    async googleLogin(idToken: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/google', { idToken });
        return response.data;
    },
};

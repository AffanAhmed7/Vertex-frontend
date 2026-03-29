import api from './api';

export const userService = {
    async updateProfile(data: { name?: string; email?: string; twoFactorEnabled?: boolean; securityQuestion?: string; securityAnswer?: string }) {
        const response = await api.patch<{ success: boolean; data: any; message: string }>('/auth/profile', data);
        return response.data;
    },

    async changePassword(data: any) {
        const response = await api.patch<{ success: boolean; message: string }>('/auth/change-password', data);
        return response.data;
    },

    async getMe() {
        const response = await api.get<{ success: boolean; data: any }>('/auth/me');
        return response.data;
    }
};

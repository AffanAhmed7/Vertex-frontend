import api from './api';

export const userService = {
    async updateProfile(data: { name?: string; email?: string }) {
        const response = await api.patch<{ success: boolean; data: any; message: string }>('/auth/profile', data);
        return response.data;
    },

    async getMe() {
        const response = await api.get<{ success: boolean; data: any }>('/auth/me');
        return response.data;
    }
};

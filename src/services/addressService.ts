import api from './api';

export interface UserAddress {
    id: string;
    type: 'SHIPPING' | 'BILLING';
    isDefault: boolean;
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
}

export const addressService = {
    async getAddresses() {
        const response = await api.get<{ success: boolean; data: UserAddress[] }>('/addresses');
        return response.data;
    },

    async createAddress(data: Omit<UserAddress, 'id'>) {
        const response = await api.post<{ success: boolean; data: UserAddress }>('/addresses', data);
        return response.data;
    },

    async updateAddress(id: string, data: Partial<UserAddress>) {
        const response = await api.patch<{ success: boolean; data: UserAddress }>(`/addresses/${id}`, data);
        return response.data;
    },

    async deleteAddress(id: string) {
        const response = await api.delete<{ success: boolean; message: string }>(`/addresses/${id}`);
        return response.data;
    },

    async setDefaultAddress(id: string) {
        const response = await api.patch<{ success: boolean; message: string }>(`/addresses/${id}/default`);
        return response.data;
    }
};

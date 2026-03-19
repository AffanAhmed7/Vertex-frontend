import api from './api';

export const orderService = {
    async getOrders() {
        const response = await api.get<{ success: boolean; data: any[] }>('/orders');
        return response.data;
    },

    async getOrder(id: string) {
        const response = await api.get<{ success: boolean; data: any }>(`/orders/${id}`);
        return response.data;
    }
};

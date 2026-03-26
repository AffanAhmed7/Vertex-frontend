import api from './api';

export interface CartItemData {
    productId: string;
    quantity: number;
}

export const fetchDbCart = async () => {
    const res = await api.get('/cart');
    return res.data.data;
};

export const addItemToDbCart = async (data: CartItemData) => {
    const res = await api.post('/cart', data);
    return res.data.data;
};

export const updateDbCartItem = async (productId: string, quantity: number) => {
    const res = await api.put(`/cart/${productId}`, { quantity });
    return res.data.data;
};

export const removeDbCartItem = async (productId: string) => {
    const res = await api.delete(`/cart/${productId}`);
    return res.data;
};

export const createOrder = async (shippingData: any) => {
    const res = await api.post('/orders', shippingData);
    return res.data.data;
};

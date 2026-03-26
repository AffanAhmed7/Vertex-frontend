import api from './api';

// ——— Products ———

export const fetchAdminProducts = async () => {
    const res = await api.get('/products/admin');
    return res.data.data;
};

export const createAdminProduct = async (data: {
    name: string;
    description?: string;
    price: number;
    sku: string;
    stock: number;
    categoryId: string;
    isActive?: boolean;
    image?: string;
}) => {
    const res = await api.post('/products/admin', data);
    return res.data.data;
};

export const updateAdminProduct = async (id: string, data: Record<string, any>) => {
    const res = await api.put(`/products/admin/${id}`, data);
    return res.data.data;
};

export const deleteAdminProduct = async (id: string) => {
    const res = await api.delete(`/products/admin/${id}`);
    return res.data;
};

// ——— Orders ———

export const fetchAdminOrders = async () => {
    const res = await api.get('/orders/admin');
    return res.data.data;
};

export const updateAdminOrderStatus = async (id: string, status: string) => {
    // Map admin-display statuses back to DB enum values
    const statusMap: Record<string, string> = {
        'Pending': 'CREATED',
        'Processing': 'PAID',
        'Shipped': 'SHIPPED',
        'Delivered': 'DELIVERED',
        'Cancelled': 'REFUNDED',
    };
    const dbStatus = statusMap[status] || status;
    const res = await api.patch(`/orders/admin/${id}/status`, { status: dbStatus });
    return res.data.data;
};

// ——— Users ———

export const fetchAdminUsers = async () => {
    const res = await api.get('/admin/users?limit=100');
    return res.data.data;
};

export const toggleAdminUserStatus = async (id: string, isActive: boolean) => {
    const res = await api.patch(`/admin/users/${id}/status`, { isActive });
    return res.data;
};

export const changeAdminUserRole = async (id: string, role: string) => {
    const res = await api.patch(`/admin/users/${id}/role`, { role });
    return res.data;
};

// ——— Categories ———

export const fetchCategories = async () => {
    const res = await api.get('/categories');
    return res.data.data || res.data;
};

// ——— Analytics ———

export const fetchAnalyticsOverview = async () => {
    const res = await api.get('/admin/analytics/overview');
    return res.data.data;
};

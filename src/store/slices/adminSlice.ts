import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AdminStat {
    label: string;
    value: string | number;
    trend: number;
    trendDirection: 'up' | 'down';
    icon: string;
}

export interface AdminRecentOrder {
    id: string;
    customer: string;
    product: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Shipped';
    date: string;
}

export interface AdminActivity {
    id: string;
    type: 'order' | 'user' | 'product';
    message: string;
    time: string;
}

export interface AdminProduct {
    id: string;
    name: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Draft';
    image: string;
}

export interface AdminOrder {
    id: string;
    customerName: string;
    customerEmail: string;
    date: string;
    total: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    items: { id: string; name: string; quantity: number; price: number }[];
    shippingAddress: string;
    paymentStatus: 'Paid' | 'Unpaid' | 'Refunded';
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Editor' | 'Viewer' | 'Customer';
    status: 'Active' | 'Suspended';
    lastLogin: string;
}

export interface AnalyticsKPI {
    id: string;
    label: string;
    value: string | number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
    sparkline: number[];
}

export interface ChartDataPoint {
    name: string;
    value: number;
    secondary?: number;
}

export interface AnalyticsState {
    kpis: AnalyticsKPI[];
    revenueData: ChartDataPoint[];
    ordersData: ChartDataPoint[];
    trafficSources: { name: string; value: number }[];
    topProducts: { name: string; sales: number; growth: number }[];
    insights: {
        retentionRate: number;
        repeatPurchase: number;
        refundRate: number;
        inventoryHealth: number;
        insightText: string;
    };
    dateRange: '7d' | '30d' | '90d' | 'custom';
    loading: boolean;
}

interface AdminState {
    stats: AdminStat[];
    recentOrders: AdminRecentOrder[];
    recentActivity: AdminActivity[];
    analytics: AnalyticsState;
    products: AdminProduct[];
    orders: AdminOrder[];
    users: AdminUser[];
    loading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    stats: [
        { label: 'Total Revenue', value: '$124,592.00', trend: 12.5, trendDirection: 'up', icon: 'DollarSign' },
        { label: 'Active Orders', value: '1,240', trend: 8.2, trendDirection: 'up', icon: 'Package' },
        { label: 'New Users', value: '452', trend: 2.4, trendDirection: 'down', icon: 'Users' },
        { label: 'Conversion Rate', value: '3.42%', trend: 0.5, trendDirection: 'up', icon: 'Target' },
    ],
    recentOrders: [
        { id: 'ORD-7721', customer: 'Emma Thompson', product: 'Vertex Cinematic 49"', amount: 1499, status: 'Paid', date: '2 min ago' },
        { id: 'ORD-7720', customer: 'James Miller', product: 'OLED Pro Panel', amount: 899, status: 'Shipped', date: '15 min ago' },
        { id: 'ORD-7719', customer: 'Sophia Chen', product: 'Neural Link Hub', amount: 249, status: 'Paid', date: '45 min ago' },
        { id: 'ORD-7718', customer: 'Lucas Wright', product: 'Vertex Series X', amount: 1999, status: 'Pending', date: '1 hour ago' },
    ],
    recentActivity: [
        { id: '1', type: 'order', message: 'New order VTX-9921 by John Doe', time: '5m' },
        { id: '2', type: 'user', message: 'New user registration: Sarah Smith', time: '12m' },
        { id: '3', type: 'product', message: 'Inventory alert: Vertex OLED (Low Stock)', time: '20m' },
        { id: '4', type: 'order', message: 'Order VTX-9918 marked as shipped', time: '35m' },
    ],
    analytics: {
        kpis: [
            { id: 'rev', label: 'Total Revenue', value: '$124,592', change: 12.5, trend: 'up', sparkline: [30, 45, 35, 50, 40, 60, 55] },
            { id: 'prof', label: 'Net Profit', value: '$42,350', change: 8.2, trend: 'up', sparkline: [25, 30, 32, 28, 35, 38, 40] },
            { id: 'ord', label: 'Total Orders', value: '1,240', change: 2.1, trend: 'up', sparkline: [40, 35, 45, 42, 48, 44, 52] },
            { id: 'aov', label: 'Avg. Order Value', value: '$100.48', change: -1.4, trend: 'down', sparkline: [55, 52, 58, 54, 50, 48, 46] },
            { id: 'conv', label: 'Conversion Rate', value: '3.42%', change: 0.5, trend: 'up', sparkline: [20, 22, 21, 23, 24, 25, 26] },
            { id: 'users', label: 'Active Users', value: '18,402', change: 4.8, trend: 'up', sparkline: [60, 65, 62, 68, 70, 72, 75] },
        ],
        revenueData: [
            { name: 'Mon', value: 4000, secondary: 2400 },
            { name: 'Tue', value: 3000, secondary: 1398 },
            { name: 'Wed', value: 2000, secondary: 9800 },
            { name: 'Thu', value: 2780, secondary: 3908 },
            { name: 'Fri', value: 1890, secondary: 4800 },
            { name: 'Sat', value: 2390, secondary: 3800 },
            { name: 'Sun', value: 3490, secondary: 4300 },
        ],
        ordersData: [
            { name: 'Jan', value: 400 },
            { name: 'Feb', value: 300 },
            { name: 'Mar', value: 200 },
            { name: 'Apr', value: 278 },
            { name: 'May', value: 189 },
            { name: 'Jun', value: 239 },
        ],
        trafficSources: [
            { name: 'Direct', value: 45 },
            { name: 'Organic', value: 30 },
            { name: 'Social', value: 15 },
            { name: 'Referral', value: 10 },
        ],
        topProducts: [
            { name: 'Vertex Cinematic 49"', sales: 1240, growth: 12 },
            { name: 'OLED Pro Panel', sales: 850, growth: 8 },
            { name: 'Neural Link Hub', sales: 620, growth: -2 },
            { name: 'Series X Monitor', sales: 540, growth: 5 },
        ],
        insights: {
            retentionRate: 64,
            repeatPurchase: 28,
            refundRate: 1.2,
            inventoryHealth: 92,
            insightText: "Customer retention has increased by 4% compared to last week, primarily driven by the 'Vertex Loyalty' initiative."
        },
        dateRange: '30d',
        loading: false,
    },
    products: [
        { id: '1', name: 'Vertex Cinematic 49"', sku: 'VTX-49C', category: 'Displays', price: 1499, stock: 45, status: 'In Stock', image: '/products/monitor-1.jpg' },
        { id: '2', name: 'OLED Pro Panel', sku: 'OL-PRO-27', category: 'Displays', price: 899, stock: 12, status: 'Low Stock', image: '/products/monitor-2.jpg' },
        { id: '3', name: 'Neural Link Hub', sku: 'NL-HUB-01', category: 'Accessories', price: 249, stock: 0, status: 'Out of Stock', image: '/products/hub-1.jpg' },
        { id: '4', name: 'Vertex Series X', sku: 'VTX-SX', category: 'Desktop', price: 1999, stock: 8, status: 'Low Stock', image: '/products/pc-1.jpg' },
    ],
    orders: [
        {
            id: 'ORD-7721',
            customerName: 'Emma Thompson',
            customerEmail: 'emma@example.com',
            date: '2026-02-12T19:20:00Z',
            total: 1499,
            status: 'Processing',
            items: [{ id: '1', name: 'Vertex Cinematic 49"', quantity: 1, price: 1499 }],
            shippingAddress: '123 Cyber St, Neo Tokyo, JP',
            paymentStatus: 'Paid'
        },
        {
            id: 'ORD-7720',
            customerName: 'James Miller',
            customerEmail: 'james@example.com',
            date: '2026-02-12T19:05:00Z',
            total: 899,
            status: 'Shipped',
            items: [{ id: '2', name: 'OLED Pro Panel', quantity: 1, price: 899 }],
            shippingAddress: '456 Silicon Ave, Palo Alto, CA',
            paymentStatus: 'Paid'
        },
        {
            id: 'ORD-7719',
            customerName: 'Sophia Chen',
            customerEmail: 'sophia@example.com',
            date: '2026-02-12T18:30:00Z',
            total: 249,
            status: 'Pending',
            items: [{ id: '3', name: 'Neural Link Hub', quantity: 1, price: 249 }],
            shippingAddress: '789 Matrix Blvd, London, UK',
            paymentStatus: 'Unpaid'
        },
    ],
    users: [
        { id: '1', name: 'Alex Rivera', email: 'alex@vertex.com', role: 'Admin', status: 'Active', lastLogin: '2 mins ago' },
        { id: '2', name: 'Sarah Miller', email: 'sarah@example.com', role: 'Customer', status: 'Active', lastLogin: '1 hour ago' },
        { id: '3', name: 'David Chen', email: 'david@example.com', role: 'Editor', status: 'Suspended', lastLogin: '2 days ago' },
    ],
    loading: false,
    error: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setAnalyticsLoading: (state, action: PayloadAction<boolean>) => {
            state.analytics.loading = action.payload;
        },
        setDateRange: (state, action: PayloadAction<AnalyticsState['dateRange']>) => {
            state.analytics.dateRange = action.payload;
        },
        addProduct: (state, action: PayloadAction<AdminProduct>) => {
            state.products.unshift(action.payload);
        },
        updateProduct: (state, action: PayloadAction<AdminProduct>) => {
            const index = state.products.findIndex(p => p.id === action.payload.id);
            if (index !== -1) state.products[index] = action.payload;
        },
        deleteProduct: (state, action: PayloadAction<string>) => {
            state.products = state.products.filter(p => p.id !== action.payload);
        },
        updateOrderStatus: (state, action: PayloadAction<{ id: string; status: AdminOrder['status'] }>) => {
            const order = state.orders.find(o => o.id === action.payload.id);
            if (order) order.status = action.payload.status;
        },
        updateUserRole: (state, action: PayloadAction<{ id: string; role: AdminUser['role'] }>) => {
            const user = state.users.find(u => u.id === action.payload.id);
            if (user) user.role = action.payload.role;
        },
        updateUserStatus: (state, action: PayloadAction<{ id: string; status: AdminUser['status'] }>) => {
            const user = state.users.find(u => u.id === action.payload.id);
            if (user) user.status = action.payload.status;
        },
        deleteUser: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter(u => u.id !== action.payload);
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {
    setLoading,
    setAnalyticsLoading,
    setDateRange,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    updateUserRole,
    updateUserStatus,
    deleteUser,
    setError
} = adminSlice.actions;
export default adminSlice.reducer;

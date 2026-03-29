import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardAnalytics } from '../../services/adminService';

export interface AdminProduct {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    category: string;
    image: string;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface AdminOrder {
    id: string;
    customerName: string;
    customerEmail: string;
    date: string;
    subtotal: number;
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
    status: 'Active' | 'Suspended' | 'Pending';
    lastLogin: string;
}

export interface AnalyticsKPI {
    id: string;
    label: string;
    value: string;
    change: number;
    trend: 'up' | 'down' | 'neutral';
    icon: string;
    sparkline: number[];
}

export interface AnalyticsState {
    kpis: AnalyticsKPI[];
    revenueData: { name: string; value: number; secondary: number }[];
    trafficSources: { name: string; value: number }[];
    topProducts: { name: string; sales: number; growth: number; revenue: number; status: string }[];
    productMetrics?: {
        totalProductRevenue: number;
        totalProductUnitsSold: number;
    };
    insights: {
        retentionRate: number;
        repeatPurchase: number;
        refundRate: number;
        inventoryHealth: number;
        insightText: string;
    };
    totalVisitors: number;
    dateRange: '24h' | '7d' | '30d' | '1y' | 'all';
    loading: boolean;
}

interface AdminState {
    products: AdminProduct[];
    orders: AdminOrder[];
    users: AdminUser[];
    notifications: { id: string; text: string; time: string; type: 'info' | 'warning' | 'alert'; unread: boolean }[];
    analytics: AnalyticsState;
    stats: any[];
    recentOrders: any[];
    recentActivity: any[];
    searchQuery: string;
    loading: boolean;
}

const initialState: AdminState = {
    products: [],
    orders: [],
    users: [],
    notifications: [],
    analytics: {
        kpis: [
            { id: '1', label: 'Return Rate', value: '—', change: 0, trend: 'neutral', icon: 'RefreshCw', sparkline: [] },
            { id: '2', label: 'Net Profit', value: '—', change: 0, trend: 'neutral', icon: 'TrendingUp', sparkline: [] },
            { id: '3', label: 'Avg Session', value: '—', change: 0, trend: 'neutral', icon: 'Clock', sparkline: [] },
            { id: '4', label: 'Bounce Rate', value: '—', change: 0, trend: 'neutral', icon: 'MousePointer', sparkline: [] },
            { id: '5', label: 'Avg Order Value', value: '—', change: 0, trend: 'neutral', icon: 'ShoppingBag', sparkline: [] },
            { id: '6', label: 'Repeat Purchase', value: '—', change: 0, trend: 'neutral', icon: 'Repeat', sparkline: [] },
        ],
        revenueData: [],
        trafficSources: [],
        topProducts: [],
        insights: {
            retentionRate: 0,
            repeatPurchase: 0,
            refundRate: 0,
            inventoryHealth: 0,
            insightText: 'Loading analytics data...',
        },
        totalVisitors: 0,
        dateRange: '30d',
        loading: true,
    },
    stats: [
        { label: 'Total Revenue', value: '$0.00', trend: 0, icon: 'DollarSign', key: 'revenue' },
        { label: 'Active Orders', value: '0', trend: 0, icon: 'ShoppingBag', key: 'orders' },
        { label: 'Platform Reach', value: '0', trend: 0, icon: 'Users', key: 'reach' },
        { label: 'Conversion', value: '0%', trend: 0, icon: 'Target', key: 'conversion' },
    ],
    recentOrders: [],
    recentActivity: [],
    searchQuery: '',
    loading: true,
};

export const fetchDashboardAnalytics = createAsyncThunk(
    'admin/fetchAnalytics',
    async (range: string, { rejectWithValue }) => {
        try {
            return await getDashboardAnalytics(range);
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to fetch analytics');
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<AdminProduct[]>) => {
            state.products = action.payload;
        },
        addProduct: (state, action: PayloadAction<AdminProduct>) => {
            state.products.push(action.payload);
        },
        updateProduct: (state, action: PayloadAction<AdminProduct>) => {
            const index = state.products.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.products[index] = action.payload;
            }
        },
        deleteProduct: (state, action: PayloadAction<string>) => {
            state.products = state.products.filter(p => p.id !== action.payload);
        },
        setOrders: (state, action: PayloadAction<AdminOrder[]>) => {
            state.orders = action.payload;
        },
        updateOrderStatus: (state, action: PayloadAction<{ id: string; status: AdminOrder['status'] }>) => {
            const order = state.orders.find(o => o.id === action.payload.id);
            if (order) {
                order.status = action.payload.status;
            }
        },
        updateOrder: (state, action: PayloadAction<AdminOrder>) => {
            const index = state.orders.findIndex(o => o.id === action.payload.id);
            if (index !== -1) {
                state.orders[index] = action.payload;
            }
        },
        setUsers: (state, action: PayloadAction<AdminUser[]>) => {
            state.users = action.payload;
        },
        addUser: (state, action: PayloadAction<AdminUser>) => {
            state.users.push(action.payload);
        },
        updateUser: (state, action: PayloadAction<AdminUser>) => {
            const index = state.users.findIndex(u => u.id === action.payload.id);
            if (index !== -1) {
                state.users[index] = action.payload;
            }
        },
        deleteUser: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter(u => u.id !== action.payload);
        },
        updateUserStatus: (state, action: PayloadAction<{ id: string; status: AdminUser['status'] }>) => {
            const user = state.users.find(u => u.id === action.payload.id);
            if (user) {
                user.status = action.payload.status;
            }
        },
        updateUserRole: (state, action: PayloadAction<{ id: string; role: AdminUser['role'] }>) => {
            const user = state.users.find(u => u.id === action.payload.id);
            if (user) {
                user.role = action.payload.role;
            }
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
        markNotificationAsRead: (state, action: PayloadAction<string>) => {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification) {
                notification.unread = false;
            }
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setStats: (state, action: PayloadAction<AdminState['stats']>) => {
            state.stats = action.payload;
        },
        setRecentOrders: (state, action: PayloadAction<AdminState['recentOrders']>) => {
            state.recentOrders = action.payload;
        },
        setRecentActivity: (state, action: PayloadAction<AdminState['recentActivity']>) => {
            state.recentActivity = action.payload;
        },
        setAnalyticsLoading: (state, action: PayloadAction<boolean>) => {
            state.analytics.loading = action.payload;
        },
        setDateRange: (state, action: PayloadAction<AnalyticsState['dateRange']>) => {
            state.analytics.dateRange = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardAnalytics.pending, (state) => {
                state.analytics.loading = true;
            })
            .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
                state.analytics = {
                    ...state.analytics,
                    ...action.payload,
                    loading: false
                };
            })
            .addCase(fetchDashboardAnalytics.rejected, (state) => {
                state.analytics.loading = false;
            });
    }
});

export const {
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setOrders,
    updateOrderStatus,
    setUsers,
    updateUserStatus,
    setSearchQuery,
    setLoading,
    setStats,
    setRecentOrders,
    setRecentActivity,
    setAnalyticsLoading,
    setDateRange,
    updateOrder,
    deleteUser,
    updateUserRole,
    addUser,
    updateUser,
    clearNotifications,
    markNotificationAsRead
} = adminSlice.actions;

export default adminSlice.reducer;

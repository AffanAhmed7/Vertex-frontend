import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    insights: {
        retentionRate: number;
        repeatPurchase: number;
        refundRate: number;
        inventoryHealth: number;
        insightText: string;
    };
    totalVisitors: number;
    dateRange: '7d' | '30d' | '90d' | 'custom';
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
    products: [
        {
            id: '1',
            name: 'Vertex Cinematic 49"',
            sku: 'VTX-49-C',
            price: 1499,
            stock: 12,
            category: 'Monitors',
            image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=300',
            status: 'In Stock'
        },
        {
            id: '2',
            name: 'OLED Pro Panel',
            sku: 'OLED-27-P',
            price: 899,
            stock: 8,
            category: 'Monitors',
            image: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&q=80&w=300',
            status: 'Low Stock'
        },
        {
            id: '3',
            name: 'Neural Link Hub',
            sku: 'NL-HUB-01',
            price: 249,
            stock: 0,
            category: 'Infrastructure',
            image: 'https://images.unsplash.com/photo-1518433278983-5110bc55670d?auto=format&fit=crop&q=80&w=300',
            status: 'Out of Stock'
        }
    ],
    orders: [
        {
            id: 'ORD-7721',
            customerName: 'Emma Thompson',
            customerEmail: 'emma@example.com',
            date: '2026-02-18T19:20:00Z',
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
            date: '2026-02-15T10:05:00Z',
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
            date: '2026-02-10T14:30:00Z',
            total: 249,
            status: 'Pending',
            items: [{ id: '3', name: 'Neural Link Hub', quantity: 1, price: 249 }],
            shippingAddress: '789 Matrix Blvd, London, UK',
            paymentStatus: 'Unpaid'
        },
        {
            id: 'ORD-7718',
            customerName: 'Lucas Wright',
            customerEmail: 'lucas@example.com',
            date: '2026-02-05T09:15:00Z',
            total: 1999,
            status: 'Delivered',
            items: [{ id: '4', name: 'Vertex Series X', quantity: 1, price: 1999 }],
            shippingAddress: '101 Tech Way, Seattle, WA',
            paymentStatus: 'Paid'
        },
        {
            id: 'ORD-7717',
            customerName: 'Emma Thompson',
            customerEmail: 'emma@example.com',
            date: '2026-01-25T16:45:00Z',
            total: 500,
            status: 'Delivered',
            items: [{ id: '5', name: 'OLED Pro Panel', quantity: 1, price: 500 }],
            shippingAddress: '123 Cyber St, Neo Tokyo, JP',
            paymentStatus: 'Paid'
        },
        {
            id: 'ORD-7716',
            customerName: 'William Black',
            customerEmail: 'will@example.com',
            date: '2026-01-10T11:20:00Z',
            total: 3200,
            status: 'Delivered',
            items: [{ id: '1', name: 'Vertex Cinematic 49"', quantity: 2, price: 1600 }],
            shippingAddress: '555 Pine St, New York, NY',
            paymentStatus: 'Paid'
        },
        {
            id: 'ORD-7715',
            customerName: 'Sophia Chen',
            customerEmail: 'sophia@example.com',
            date: '2025-12-20T10:00:00Z',
            total: 150,
            status: 'Delivered',
            items: [{ id: '3', name: 'Neural Link Hub', quantity: 1, price: 150 }],
            shippingAddress: '789 Matrix Blvd, London, UK',
            paymentStatus: 'Paid'
        }
    ],
    users: [
        { id: '1', name: 'Alex Rivera', email: 'alex@vertex.com', role: 'Admin', status: 'Active', lastLogin: '2 mins ago' },
        { id: '2', name: 'Sarah Miller', email: 'sarah@example.com', role: 'Customer', status: 'Active', lastLogin: '1 hour ago' },
        { id: '3', name: 'David Chen', email: 'david@example.com', role: 'Editor', status: 'Suspended', lastLogin: '2 days ago' },
    ],
    notifications: [
        { id: '1', text: 'System Update: v1.0.4 deployed', time: '2m ago', type: 'info', unread: true },
        { id: '2', text: 'New asset verification required', time: '15m ago', type: 'warning', unread: true },
        { id: '3', text: 'Operational threshold reached: Node A', time: '1h ago', type: 'alert', unread: true },
    ],
    analytics: {
        kpis: [
            { id: '1', label: 'Return Rate', value: '28.4%', change: 3.2, trend: 'up', icon: 'RefreshCw', sparkline: [22, 24, 25, 26, 27, 28, 28] },
            { id: '2', label: 'Net Profit', value: '$82.4k', change: -2.4, trend: 'down', icon: 'TrendingUp', sparkline: [65, 62, 58, 60, 55, 52, 50] },
            { id: '3', label: 'Avg Session', value: '4m 12s', change: 6.8, trend: 'up', icon: 'Clock', sparkline: [200, 210, 225, 230, 240, 248, 252] },
            { id: '4', label: 'Bounce Rate', value: '38.1%', change: -5.1, trend: 'up', icon: 'MousePointer', sparkline: [48, 46, 44, 43, 41, 40, 38] },
            { id: '5', label: 'Avg Order Value', value: '$842', change: 4.3, trend: 'up', icon: 'ShoppingBag', sparkline: [800, 810, 820, 815, 830, 840, 842] },
            { id: '6', label: 'Repeat Purchase', value: '42.0%', change: 2.1, trend: 'up', icon: 'Repeat', sparkline: [36, 37, 38, 39, 40, 41, 42] },
        ],
        revenueData: [],
        trafficSources: [
            { name: 'Direct', value: 45 },
            { name: 'Organic', value: 30 },
            { name: 'Social', value: 15 },
            { name: 'Referral', value: 10 },
        ],
        topProducts: [],
        insights: {
            retentionRate: 68,
            repeatPurchase: 42,
            refundRate: 1.2,
            inventoryHealth: 92,
            insightText: "Customer retention has increased by 4% compared to last week, primarily driven by the 'Vertex Loyalty' initiative."
        },
        totalVisitors: 14200,
        dateRange: '30d',
        loading: false,
    },
    stats: [
        { label: 'Total Revenue', value: '$124,500.00', trend: 12.5, icon: 'DollarSign', key: 'revenue' },
        { label: 'Active Orders', value: '1,240', trend: 8.1, icon: 'ShoppingBag', key: 'orders' },
        { label: 'Platform Reach', value: '14,200', trend: 4.3, icon: 'Users', key: 'reach' },
        { label: 'Conversion', value: '3.42%', trend: 1.2, icon: 'Target', key: 'conversion' },
    ],
    recentOrders: [
        { id: 'VTX-9921', customer: 'Emma Thompson', product: 'Vertex Cinematic 49"', amount: 1499, status: 'Paid' },
        { id: 'VTX-9920', customer: 'James Miller', product: 'OLED Pro Panel', amount: 899, status: 'Shipped' },
        { id: 'VTX-9919', customer: 'Sophia Chen', product: 'Neural Link Hub', amount: 249, status: 'Pending' },
        { id: 'VTX-9918', customer: 'Lucas Wright', product: 'Vertex Series X', amount: 1999, status: 'Paid' },
    ],
    recentActivity: [
        { id: '1', type: 'order', time: '2m', message: 'New deployment authorized: VTX-9921' },
        { id: '2', type: 'user', time: '15m', message: 'Security clearance updated: Admin Rivera' },
        { id: '3', type: 'system', time: '1h', message: 'Node A operational threshold reached' },
    ],
    searchQuery: '',
    loading: false,
};

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
        setAnalyticsLoading: (state, action: PayloadAction<boolean>) => {
            state.analytics.loading = action.payload;
        },
        setDateRange: (state, action: PayloadAction<AnalyticsState['dateRange']>) => {
            state.analytics.dateRange = action.payload;
        },
        refreshAnalytics: (state) => {
            const range = state.analytics.dateRange;
            const now = new Date('2026-02-19T16:38:29Z'); // Source of truth

            let daysLimit = 30;
            if (range === '7d') daysLimit = 7;
            if (range === '90d') daysLimit = 90;

            const startDate = new Date(now.getTime() - daysLimit * 24 * 60 * 60 * 1000);
            const prevStartDate = new Date(startDate.getTime() - daysLimit * 24 * 60 * 60 * 1000);

            const filteredOrders = state.orders.filter(o => new Date(o.date) >= startDate);
            const prevPeriodOrders = state.orders.filter(o => new Date(o.date) >= prevStartDate && new Date(o.date) < startDate);

            // 1. Calculate Total Revenue
            const totalRevenue = filteredOrders.reduce((acc, o) => acc + o.total, 0);
            const prevRevenue = prevPeriodOrders.reduce((acc, o) => acc + o.total, 0);
            const revenueChange = prevRevenue ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

            // 2. Average Order Value
            const aov = filteredOrders.length ? totalRevenue / filteredOrders.length : 0;
            const prevAov = prevPeriodOrders.length ? prevRevenue / prevPeriodOrders.length : 0;
            const aovChange = prevAov ? ((aov - prevAov) / prevAov) * 100 : 0;

            // 3. Active Users (Simulated based on orders)
            const activeUsers = Math.round(filteredOrders.length * 4.2 + 20);
            const prevActiveUsers = Math.round(prevPeriodOrders.length * 4.2 + 20);
            const usersChange = prevActiveUsers ? ((activeUsers - prevActiveUsers) / prevActiveUsers) * 100 : 0;

            // Update KPIs by ID instead of brittle array indices
            const netProfitKpi = state.analytics.kpis.find(k => k.id === '2');
            if (netProfitKpi) {
                netProfitKpi.value = `$${(totalRevenue / 1000).toFixed(1)}k`;
                netProfitKpi.change = Number(revenueChange.toFixed(1));
                netProfitKpi.trend = revenueChange >= 0 ? 'up' : 'down';
            }

            const aovKpi = state.analytics.kpis.find(k => k.id === '5');
            if (aovKpi) {
                aovKpi.value = `$${Math.round(aov)}`;
                aovKpi.change = Number(aovChange.toFixed(1));
                aovKpi.trend = aovChange >= 0 ? 'up' : 'down';
            }

            const repeatKpi = state.analytics.kpis.find(k => k.id === '6');
            if (repeatKpi) {
                repeatKpi.value = `${activeUsers.toLocaleString()}`;
                repeatKpi.change = Number(usersChange.toFixed(1));
                repeatKpi.trend = usersChange >= 0 ? 'up' : 'down';
            }

            // 4. Executive Insights calculations
            const totalOrders = filteredOrders.length;
            const uniqueCustomers = new Set(filteredOrders.map(o => o.customerEmail)).size;
            const repeatCustomers = totalOrders - uniqueCustomers;
            const retentionRate = uniqueCustomers ? Math.round((repeatCustomers / uniqueCustomers) * 100) : 0;

            const refunds = filteredOrders.filter(o => o.paymentStatus === 'Refunded').length;
            const refundRate = totalOrders ? (refunds / totalOrders) * 100 : 0;

            const lowStockProducts = state.products.filter(p => p.stock < 10).length;
            const inventoryHealth = Math.round(((state.products.length - lowStockProducts) / state.products.length) * 100);

            // Generate Insight Text
            let insightText = "Operational stability remains optimal across all sectors.";
            if (revenueChange > 10) insightText = "Aggressive revenue growth detected in the current cycle, likely linked to high monitor demand.";
            if (retentionRate > 20) insightText = "Customer retention metrics have surpassed quarterly benchmarks.";
            if (inventoryHealth < 80) insightText = "Immediate restock protocols recommended for critical monitor inventory.";

            state.analytics.insights = {
                retentionRate: retentionRate || 68,
                repeatPurchase: Math.round(retentionRate * 0.7) || 42,
                refundRate: Number(refundRate.toFixed(1)) || 1.2,
                inventoryHealth: inventoryHealth || 92,
                insightText
            };

            // 6. Compute Revenue Chart Data with Dynamic Bucketing
            if (range === '90d') {
                const months = ['Dec', 'Jan', 'Feb'];
                state.analytics.revenueData = months.map(month => {
                    const monthOrders = filteredOrders.filter(o => new Date(o.date).toLocaleString('default', { month: 'short' }) === month);
                    return {
                        name: month,
                        value: monthOrders.reduce((acc, o) => acc + o.total, 0),
                        secondary: monthOrders.reduce((acc, o) => acc + o.total, 0) * 0.8
                    };
                });
            } else if (range === '30d') {
                const weeks = ['W1', 'W2', 'W3', 'W4'];
                state.analytics.revenueData = weeks.map((w, i) => {
                    const weekOrders = filteredOrders.filter(o => {
                        const d = new Date(o.date);
                        const dayOfMonth = d.getDate();
                        return dayOfMonth > i * 7 && dayOfMonth <= (i + 1) * 7;
                    });
                    return {
                        name: w,
                        value: weekOrders.reduce((acc, o) => acc + o.total, 0),
                        secondary: (weekOrders.reduce((acc, o) => acc + o.total, 0) || 500) * 0.9
                    };
                });
            } else {
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                state.analytics.revenueData = days.map(day => {
                    const dayOrders = filteredOrders.filter(o => days[new Date(o.date).getDay()] === day);
                    const dayPrevOrders = prevPeriodOrders.filter(o => days[new Date(o.date).getDay()] === day);
                    return {
                        name: day,
                        value: dayOrders.reduce((acc, o) => acc + o.total, 0),
                        secondary: dayPrevOrders.reduce((acc, o) => acc + o.total, 0)
                    };
                });
            }

            // 7. Compute Top Products
            const productSales: Record<string, { sales: number, revenue: number, growth: number, status: string }> = {};
            filteredOrders.forEach(o => {
                o.items.forEach(item => {
                    if (!productSales[item.name]) {
                        const realProduct = state.products?.find(p => p.name === item.name);
                        const status = realProduct ? realProduct.status : (Math.random() > 0.1 ? 'Active' : 'Low Stock');
                        productSales[item.name] = { sales: 0, revenue: 0, growth: Math.floor(Math.random() * 40) - 5, status };
                    }
                    productSales[item.name].sales += item.quantity;
                    productSales[item.name].revenue += (item.quantity * item.price);
                });
            });

            state.analytics.topProducts = Object.entries(productSales)
                .map(([name, data]) => ({ name, ...data }))
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 6);

            // 8. Dynamicize Traffic Sources
            state.analytics.trafficSources = [
                { name: 'Direct', value: 40 + Math.floor(Math.random() * 10) },
                { name: 'Organic', value: 25 + Math.floor(Math.random() * 10) },
                { name: 'Social', value: 15 + Math.floor(Math.random() * 10) },
                { name: 'Referral', value: 10 + Math.floor(Math.random() * 10) },
            ];
            const totalT = state.analytics.trafficSources.reduce((acc, s) => acc + s.value, 0);
            state.analytics.trafficSources = state.analytics.trafficSources.map(s => ({
                ...s,
                value: Math.round((s.value / totalT) * 100)
            }));

            // 9. Compute Total Visitors (reach)
            state.analytics.totalVisitors = Math.round((totalOrders / 0.0342) + (Math.random() * 1000));
        },
    },
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
    setAnalyticsLoading,
    setDateRange,
    refreshAnalytics,
    updateOrder,
    deleteUser,
    updateUserRole,
    addUser,
    updateUser,
    clearNotifications,
    markNotificationAsRead
} = adminSlice.actions;

export default adminSlice.reducer;

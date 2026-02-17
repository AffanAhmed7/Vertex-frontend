import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserAddress {
    id: string;
    type: 'Shipping' | 'Billing';
    isDefault: boolean;
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface Order {
    id: string;
    date: string;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    total: number;
    items: OrderItem[];
    shippingAddress: string;
    paymentMethod: string;
}

interface UserState {
    currentUser: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
        role: 'CUSTOMER' | 'ADMIN';
        joinDate: string;
        status: 'Pro' | 'Standard' | 'Enterprise';
    } | null;
    orders: Order[];
    addresses: UserAddress[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    currentUser: null,
    orders: [],
    addresses: [],
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState['currentUser']>) => {
            state.currentUser = action.payload;
        },
        addAddress: (state, action: PayloadAction<UserAddress>) => {
            if (action.payload.isDefault) {
                state.addresses.forEach(a => a.isDefault = false);
            }
            state.addresses.push(action.payload);
        },
        removeAddress: (state, action: PayloadAction<string>) => {
            state.addresses = state.addresses.filter(a => a.id !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        logout: (state) => {
            state.currentUser = null;
        }
    },
});

export const { setUser, addAddress, removeAddress, setLoading, logout } = userSlice.actions;
export default userSlice.reducer;

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';
import { orderService } from '../../services/orderService';
import { addressService } from '../../services/addressService';

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

export interface OrderItem {
    id: string;
    quantity: number;
    priceAtPurchase: number;
    product: {
        name: string;
        image?: string;
    };
}

export interface Order {
    id: string;
    createdAt: string;
    status: 'CREATED' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'REFUNDED';
    total: number;
    items: OrderItem[];
    subtotal: number;
    tax: number;
}

interface UserState {
    currentUser: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
        role: 'CUSTOMER' | 'ADMIN';
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

// Async Thunks
export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials: any, { rejectWithValue }: any) => {
        try {
            const response = await authService.login(credentials);
            if (response.success) {
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                return response.user;
            }
            return rejectWithValue(response.message || 'Login failed');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk(
    'user/register',
    async (userData: any, { rejectWithValue }: any) => {
        try {
            if (userData.email === 'admin1234@gmail.com') {
                return rejectWithValue('This email is reserved for administrative purposes.');
            }
            const response = await authService.register(userData);
            if (response.success) {
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                return response.user;
            }
            return rejectWithValue(response.message || 'Registration failed');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async (data: { name?: string; email?: string }, { rejectWithValue }: any) => {
        try {
            const response = await userService.updateProfile(data);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response.message || 'Profile update failed');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Profile update failed');
        }
    }
);

export const fetchOrders = createAsyncThunk(
    'user/fetchOrders',
    async (_, { rejectWithValue }: any) => {
        try {
            const response = await orderService.getOrders();
            if (response.success) {
                return response.data;
            }
            return rejectWithValue('Failed to fetch orders');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

export const fetchAddresses = createAsyncThunk(
    'user/fetchAddresses',
    async (_, { rejectWithValue }: any) => {
        try {
            const response = await addressService.getAddresses();
            if (response.success) {
                return response.data;
            }
            return rejectWithValue('Failed to fetch addresses');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
        }
    }
);

export const addNewAddress = createAsyncThunk(
    'user/addNewAddress',
    async (data: Omit<UserAddress, 'id'>, { rejectWithValue }: any) => {
        try {
            const response = await addressService.createAddress(data);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue('Failed to add address');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add address');
        }
    }
);

export const deleteExistingAddress = createAsyncThunk(
    'user/deleteAddress',
    async (id: string, { rejectWithValue }: any) => {
        try {
            const response = await addressService.deleteAddress(id);
            if (response.success) {
                return id;
            }
            return rejectWithValue('Failed to delete address');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
        }
    }
);

export const googleLogin = createAsyncThunk(
    'user/googleLogin',
    async (idToken: string, { rejectWithValue }: any) => {
        try {
            const response = await authService.googleLogin(idToken);
            if (response.success) {
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                return response.user;
            }
            return rejectWithValue(response.message || 'Google login failed');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Google login failed');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState['currentUser']>) => {
            state.currentUser = action.payload;
        },
        logout: (state) => {
            state.currentUser = null;
            state.orders = [];
            state.addresses = [];
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
        clearError: (state) => {
            state.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        }
    },
    extraReducers: (builder: any) => {
        builder
            // Auth
            .addCase(loginUser.fulfilled, (state: any, action: any) => {
                state.currentUser = action.payload;
            })
            .addCase(registerUser.fulfilled, (state: any, action: any) => {
                state.currentUser = action.payload;
            })
            .addCase(googleLogin.fulfilled, (state: any, action: any) => {
                state.currentUser = action.payload;
            })
            // Profile
            .addCase(updateProfile.fulfilled, (state: any, action: any) => {
                if (state.currentUser) {
                    state.currentUser = { ...state.currentUser, ...action.payload };
                }
            })
            // Orders
            .addCase(fetchOrders.pending, (state: any) => {
                state.loading = true;
            })
            .addCase(fetchOrders.fulfilled, (state: any, action: any) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state: any, action: any) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Addresses
            .addCase(fetchAddresses.fulfilled, (state: any, action: any) => {
                state.addresses = action.payload;
            })
            .addCase(addNewAddress.fulfilled, (state: any, action: any) => {
                if (action.payload.isDefault) {
                    state.addresses.forEach((a: any) => a.isDefault = false);
                }
                state.addresses.push(action.payload);
            })
            .addCase(deleteExistingAddress.fulfilled, (state: any, action: any) => {
                state.addresses = state.addresses.filter((a: any) => a.id !== action.payload);
            });
    }
});

export const { setUser, logout, clearError, setError } = userSlice.actions;
export default userSlice.reducer;

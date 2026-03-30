import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';
import { orderService } from '../../services/orderService';
import { addressService } from '../../services/addressService';
import { fetchDbCart } from './cartSlice';

export interface UserAddress {
    id: string;
    type: 'SHIPPING' | 'BILLING';
    isDefault: boolean;
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
}

export interface OrderItem {
    id: string;
    productId: string;
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
        twoFactorEnabled?: boolean;
        securityQuestion?: string;
        hasSecurityQuestion?: boolean;
    } | null;
    requires2FA: boolean;
    twoFactorUserId: string | null;
    securityQuestion: string | null;
    orders: Order[];
    addresses: UserAddress[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    currentUser: null,
    requires2FA: false,
    twoFactorUserId: null,
    securityQuestion: null,
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
                if (response.requires2FA) {
                    return { requires2FA: true, securityQuestion: response.securityQuestion, userId: response.userId };
                }
                localStorage.setItem('accessToken', response.accessToken!);
                localStorage.setItem('refreshToken', response.refreshToken!);
                return response.user;
            }
            return rejectWithValue(response.message || 'Login failed');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const verify2FA = createAsyncThunk(
    'user/verify2FA',
    async ({ userId, answer }: { userId: string; answer: string }, { dispatch, rejectWithValue }: any) => {
        try {
            const response = await authService.verify2FA(userId, answer);
            if (response.success) {
                localStorage.setItem('accessToken', response.accessToken!);
                localStorage.setItem('refreshToken', response.refreshToken!);
                
                // Fetch user data after successful 2FA
                dispatch(fetchAddresses());
                dispatch(fetchOrders());
                dispatch(fetchDbCart());
                
                return response.user;
            }
            return rejectWithValue(response.message || 'Verification failed');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Verification failed');
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
                localStorage.setItem('accessToken', response.accessToken!);
                localStorage.setItem('refreshToken', response.refreshToken!);
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
    async (data: any, { rejectWithValue }: any) => {

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

export const changePassword = createAsyncThunk(
    'user/changePassword',
    async (data: any, { rejectWithValue }: any) => {
        try {
            const response = await userService.changePassword(data);
            if (response.success) {
                return response.message;
            }
            return rejectWithValue(response.message || 'Password update failed');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Password update failed');
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

export const updateExistingAddress = createAsyncThunk(
    'user/updateAddress',
    async ({ id, data }: { id: string; data: Partial<UserAddress> }, { rejectWithValue }: any) => {
        try {
            const response = await addressService.updateAddress(id, data);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue('Failed to update address');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update address');
        }
    }
);

export const googleLogin = createAsyncThunk(
    'user/googleLogin',
    async (idToken: string, { rejectWithValue }: any) => {
        try {
            const response = await authService.googleLogin(idToken);
            if (response.success) {
                localStorage.setItem('accessToken', response.accessToken!);
                localStorage.setItem('refreshToken', response.refreshToken!);
                return response.user;
            }
            return rejectWithValue(response.message || 'Google login failed');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Google login failed');
        }
    }
);

export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userService.getMe();
            if (response.success) {
                return response.data;
            }
            return rejectWithValue('Failed to fetch user');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
        }
    }
);

export const initializeAuth = createAsyncThunk(
    'user/initializeAuth',
    async (_, { dispatch }: any) => {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;
        try {
            const response = await userService.getMe();
            if (response.success) {
                // Fetch addresses, orders, and cart if login successful
                dispatch(fetchAddresses());
                dispatch(fetchOrders());
                dispatch(fetchDbCart());
                return response.data;
            }
            return null;
        } catch (error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return null;
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
        },
        reset2FA: (state) => {
            state.requires2FA = false;
            state.twoFactorUserId = null;
            state.securityQuestion = null;
            state.error = null;
        }
    },
    extraReducers: (builder: any) => {
        builder
            // Auth
            .addCase(loginUser.pending, (state: any) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state: any, action: any) => {
                state.loading = false;
                if (action.payload?.requires2FA) {
                    state.requires2FA = true;
                    state.securityQuestion = action.payload.securityQuestion;
                    state.twoFactorUserId = action.payload.userId;
                } else {
                    state.currentUser = action.payload;
                    state.requires2FA = false;
                }
            })
            .addCase(loginUser.rejected, (state: any, action: any) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(verify2FA.pending, (state: any) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verify2FA.fulfilled, (state: any, action: any) => {
                state.loading = false;
                state.currentUser = action.payload;
                state.requires2FA = false;
                state.twoFactorUserId = null;
                state.securityQuestion = null;
            })
            .addCase(verify2FA.rejected, (state: any, action: any) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(registerUser.pending, (state: any) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state: any, action: any) => {
                state.loading = false;
                state.currentUser = action.payload;
            })
            .addCase(registerUser.rejected, (state: any, action: any) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(googleLogin.pending, (state: any) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleLogin.fulfilled, (state: any, action: any) => {
                state.loading = false;
                state.currentUser = action.payload;
            })
            .addCase(googleLogin.rejected, (state: any, action: any) => {
                state.loading = false;
                state.error = action.payload as string;
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
            })
            .addCase(updateExistingAddress.fulfilled, (state: any, action: any) => {
                const index = state.addresses.findIndex((a: any) => a.id === action.payload.id);
                if (index !== -1) {
                    if (action.payload.isDefault) {
                        state.addresses.forEach((a: any) => a.isDefault = false);
                    }
                    state.addresses[index] = action.payload;
                }
            })
            // Initialize Auth
            .addCase(initializeAuth.fulfilled, (state: any, action: any) => {
                state.currentUser = action.payload;
            })
            .addCase(fetchCurrentUser.fulfilled, (state: any, action: any) => {
                state.currentUser = action.payload;
            });
    }
});

export const { setUser, logout, clearError, setError, reset2FA } = userSlice.actions;
export default userSlice.reducer;

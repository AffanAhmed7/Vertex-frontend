import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from './productSlice';
import * as cartService from '../../services/cartService';
import { RootState } from '../index';
import { addToast } from './toastSlice';

export interface CartItem extends Product {
    quantity: number;
    selectedVariants?: Record<string, string>;
}

interface CartState {
    items: CartItem[];
    shipping: number;
    taxRate: number;
    discountCode: string | null;
    discountAmount: number;
    isProcessing: boolean;
    orderSuccess: boolean;
    lastOrderId: string | null;
}

const initialState: CartState = {
    items: [],
    shipping: 15,
    taxRate: 0.08,
    discountCode: null,
    discountAmount: 0,
    isProcessing: false,
    orderSuccess: false,
    lastOrderId: null,
};

// --- Async Thunks ---

export const fetchDbCart = createAsyncThunk(
    'cart/fetchDbCart',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            if (!state.user.currentUser) return [];

            const data = await cartService.fetchDbCart();
            // Data matches: { id (cartItemId), quantity, product: { id, name, price, sku, stock, isActive, image? } }
            // Map backend CartItem to frontend CartItem interface
            return data.map((item: any) => ({
                id: item.product.id,
                name: item.product.name,
                price: Number(item.product.price),
                sku: item.product.sku,
                stock: item.product.stock,
                image: item.product.image || '', // Ensure default fallback
                quantity: item.quantity,
                isAvailable: item.product.isActive && item.product.stock > 0,
                category: 'Uncategorized', // Fetch cart doesn't join category by default
                rating: 0,
                description: '',
                images: [],
                variants: [],
                specs: []
            })) as CartItem[];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
        }
    }
);

export const syncAddToCart = createAsyncThunk(
    'cart/syncAddToCart',
    async (item: CartItem, { getState, dispatch, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            if (state.user.currentUser) {
                await cartService.addItemToDbCart({ productId: item.id, quantity: item.quantity });
            }
            dispatch(addToast({ message: `${item.name} added to cart`, type: 'success' }));
            return item;
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to add item to cart';
            dispatch(addToast({ message: msg, type: 'error' }));
            return rejectWithValue(msg);
        }
    }
);

export const syncUpdateQuantity = createAsyncThunk(
    'cart/syncUpdateQuantity',
    async (payload: { id: string, variants?: Record<string, string>, quantity: number }, { getState, dispatch, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            if (state.user.currentUser) {
                await cartService.updateDbCartItem(payload.id, payload.quantity);
            }
            dispatch(addToast({ message: 'Quantity updated', type: 'info' }));
            return payload;
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to update quantity';
            dispatch(addToast({ message: msg, type: 'error' }));
            return rejectWithValue(msg);
        }
    }
);

export const syncRemoveFromCart = createAsyncThunk(
    'cart/syncRemoveFromCart',
    async (payload: { id: string, variants?: Record<string, string> }, { getState, dispatch, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            if (state.user.currentUser) {
                await cartService.removeDbCartItem(payload.id);
            }
            dispatch(addToast({ message: 'Module removed from queue', type: 'info' }));
            return payload;
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to remove item';
            dispatch(addToast({ message: msg, type: 'error' }));
            return rejectWithValue(msg);
        }
    }
);

export const processCheckout = createAsyncThunk(
    'cart/processCheckout',
    async (shippingData: any, { getState, dispatch, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            if (!state.user.currentUser) {
                return rejectWithValue('You must be logged in to checkout');
            }

            // Ensure Redux cart items are synced to DB before creating order
            // (items may not be in DB if they were added while auth was broken)
            const cartItems = state.cart.items;
            if (cartItems.length > 0) {
                // Clear existing DB cart first, then re-add from Redux
                try {
                    const dbCart = await cartService.fetchDbCart();
                    for (const dbItem of dbCart) {
                        await cartService.removeDbCartItem(dbItem.product.id);
                    }
                } catch {
                    // DB cart might already be empty, that's fine
                }
                for (const item of cartItems) {
                    await cartService.addItemToDbCart({ productId: item.id, quantity: item.quantity });
                }
            }

            const order = await cartService.createOrder(shippingData);
            dispatch(addToast({ message: 'Order placed successfully! Thank you for your purchase.', type: 'success' }));
            return order;
        } catch (error: any) {
            const data = error.response?.data;
            const msg = data?.message || data?.error || 'Failed to process checkout';
            dispatch(addToast({ message: msg, type: 'error' }));
            return rejectWithValue(msg);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.orderSuccess = false;
        },
        setProcessing: (state, action: PayloadAction<boolean>) => {
            state.isProcessing = action.payload;
        },
        resetCheckout: (state) => {
            state.orderSuccess = false;
            state.lastOrderId = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch DB Cart
        builder.addCase(fetchDbCart.fulfilled, (state, action) => {
            if (action.payload.length > 0) {
                // If the user's DB cart has items, naive replacement strategy
                // (Advanced apps would merge local items, but we'll overwrite for simplicity)
                state.items = action.payload;
            }
        });

        // Add To Cart
        builder.addCase(syncAddToCart.fulfilled, (state, action) => {
            const existingItem = state.items.find(
                item => item.id === action.payload.id &&
                    JSON.stringify(item.selectedVariants) === JSON.stringify(action.payload.selectedVariants)
            );
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        });

        // Update Quantity
        builder.addCase(syncUpdateQuantity.fulfilled, (state, action) => {
            const item = state.items.find(
                item => item.id === action.payload.id &&
                    JSON.stringify(item.selectedVariants) === JSON.stringify(action.payload.variants)
            );
            if (item) {
                item.quantity = Math.max(1, action.payload.quantity);
            }
        });

        // Remove From Cart
        builder.addCase(syncRemoveFromCart.fulfilled, (state, action) => {
            state.items = state.items.filter(
                item => !(item.id === action.payload.id &&
                    JSON.stringify(item.selectedVariants) === JSON.stringify(action.payload.variants))
            );
        });

        // Checkout Process
        builder.addCase(processCheckout.pending, (state) => {
            state.isProcessing = true;
        });
        builder.addCase(processCheckout.fulfilled, (state, action) => {
            state.isProcessing = false;
            state.orderSuccess = true;
            state.lastOrderId = action.payload.id;
            state.items = [];
        });
        builder.addCase(processCheckout.rejected, (state) => {
            state.isProcessing = false;
            // The UI will handle the alert for rejection via useSelector or unwrap
        });
    }
});

export const {
    clearCart,
    setProcessing,
    resetCheckout
} = cartSlice.actions;

export default cartSlice.reducer;

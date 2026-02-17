import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from './productSlice';

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
    shipping: 15, // Default shipping
    taxRate: 0.08, // 8% tax
    discountCode: null,
    discountAmount: 0,
    isProcessing: false,
    orderSuccess: false,
    lastOrderId: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(
                item => item.id === action.payload.id &&
                    JSON.stringify(item.selectedVariants) === JSON.stringify(action.payload.selectedVariants)
            );
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        },
        removeFromCart: (state, action: PayloadAction<{ id: string, variants?: Record<string, string> }>) => {
            state.items = state.items.filter(
                item => !(item.id === action.payload.id &&
                    JSON.stringify(item.selectedVariants) === JSON.stringify(action.payload.variants))
            );
        },
        updateQuantity: (state, action: PayloadAction<{ id: string, variants?: Record<string, string>, quantity: number }>) => {
            const item = state.items.find(
                item => item.id === action.payload.id &&
                    JSON.stringify(item.selectedVariants) === JSON.stringify(action.payload.variants)
            );
            if (item) {
                item.quantity = Math.max(1, action.payload.quantity);
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.orderSuccess = false;
        },
        setProcessing: (state, action: PayloadAction<boolean>) => {
            state.isProcessing = action.payload;
        },
        completeOrder: (state) => {
            state.isProcessing = false;
            state.orderSuccess = true;
            state.lastOrderId = `VTX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            state.items = [];
        },
        resetCheckout: (state) => {
            state.orderSuccess = false;
            state.lastOrderId = null;
        }
    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setProcessing,
    completeOrder,
    resetCheckout
} = cartSlice.actions;

export default cartSlice.reducer;

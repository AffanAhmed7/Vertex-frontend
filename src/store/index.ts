import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    theme: 'dark' | 'light';
    isCartOpen: boolean;
    isAuthModalOpen: boolean;
    authMode: 'login' | 'signup';
}

const initialUIState: UIState = {
    theme: 'dark',
    isCartOpen: false,
    isAuthModalOpen: false,
    authMode: 'login',
};

const uiSlice = createSlice({
    name: 'ui',
    initialState: initialUIState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
        },
        setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
            state.theme = action.payload;
        },
        toggleCart: (state) => {
            state.isCartOpen = !state.isCartOpen;
        },
        openAuthModal: (state, action: PayloadAction<'login' | 'signup'>) => {
            state.isAuthModalOpen = true;
            state.authMode = action.payload;
        },
        closeAuthModal: (state) => {
            state.isAuthModalOpen = false;
        },
    },
});

import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';
import adminReducer from './slices/adminSlice';
import toastReducer from './slices/toastSlice';
import reviewReducer from './slices/reviewSlice';

export const { toggleTheme, setTheme, toggleCart, openAuthModal, closeAuthModal } = uiSlice.actions;

export const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
        products: productReducer,
        cart: cartReducer,
        user: userReducer,
        admin: adminReducer,
        toast: toastReducer,
        reviews: reviewReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    theme: 'dark' | 'light';
    isCartOpen: boolean;
}

const initialUIState: UIState = {
    theme: 'dark',
    isCartOpen: false,
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
    },
});

import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';
import adminReducer from './slices/adminSlice';

export const { toggleTheme, setTheme, toggleCart } = uiSlice.actions;

export const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
        products: productReducer,
        cart: cartReducer,
        user: userReducer,
        admin: adminReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

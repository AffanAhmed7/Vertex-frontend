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

export const { toggleTheme, setTheme, toggleCart } = uiSlice.actions;

export const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

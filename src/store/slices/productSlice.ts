import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProductVariant {
    type: 'size' | 'color' | 'storage' | 'license' | 'material';
    label: string;
    options: string[];
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    rating: number;
    category: 'Electronics' | 'Apparel' | 'Accessories' | 'Digital';
    image: string;
    images: string[];
    isAvailable: boolean;
    variants?: ProductVariant[];
    specs?: { label: string; value: string }[];
}

interface ProductFilters {
    category: string;
    minPrice: number;
    maxPrice: number;
    minRating: number;
    sortBy: 'newest' | 'price-low' | 'price-high' | 'rating';
    search: string;
}

interface ProductState {
    items: Product[];
    filteredItems: Product[];
    selectedProduct: Product | null;
    relatedProducts: Product[];
    filters: ProductFilters;
    loading: boolean;
    error: string | null;
}

const initialFilters: ProductFilters = {
    category: 'All',
    minPrice: 0,
    maxPrice: 10000,
    minRating: 0,
    sortBy: 'newest',
    search: '',
};

const initialState: ProductState = {
    items: [],
    filteredItems: [],
    selectedProduct: null,
    relatedProducts: [],
    filters: initialFilters,
    loading: false,
    error: null,
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.items = action.payload;
            state.filteredItems = action.payload;
        },
        setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
            state.filteredItems = state.items.filter(item => {
                const matchesCategory = state.filters.category === 'All' || item.category === state.filters.category;
                const matchesPrice = item.price >= state.filters.minPrice && item.price <= state.filters.maxPrice;
                const matchesRating = item.rating >= state.filters.minRating;
                const matchesSearch = item.name.toLowerCase().includes(state.filters.search.toLowerCase()) ||
                    item.description.toLowerCase().includes(state.filters.search.toLowerCase());
                return matchesCategory && matchesPrice && matchesRating && matchesSearch;
            });

            state.filteredItems.sort((a, b) => {
                switch (state.filters.sortBy) {
                    case 'price-low': return a.price - b.price;
                    case 'price-high': return b.price - a.price;
                    case 'rating': return b.rating - a.rating;
                    default: return 0;
                }
            });
        },
        resetFilters: (state) => {
            state.filters = initialFilters;
            state.filteredItems = state.items;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
            state.selectedProduct = action.payload;
        },
        setRelatedProducts: (state, action: PayloadAction<Product[]>) => {
            state.relatedProducts = action.payload;
        },
    },
});

export const { setProducts, setFilters, resetFilters, setLoading, setError, setSelectedProduct, setRelatedProducts } = productSlice.actions;
export default productSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import productService, { ProductFilters as ServiceFilters } from '../../services/productService';

export interface ProductVariant {
    type: 'size' | 'color' | 'storage' | 'license' | 'material';
    label: string;
    options: string[];
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    numReviews: number;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    rating: number;
    category: string;
    image: string;
    images: string[];
    isAvailable: boolean;
    numReviews: number;
    variants?: ProductVariant[];
    specs?: { label: string; value: string }[];
}

interface ProductFilters extends ServiceFilters {
    category: string;
    minPrice: number;
    maxPrice: number;
    minRating: number;
    sortBy: string;
    search: string;
    onlyInStock: boolean;
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
    maxPrice: 5000,
    minRating: 0,
    sortBy: 'newest',
    search: '',
    onlyInStock: false,
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

export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async (filters: Partial<ProductFilters>, { rejectWithValue }) => {
        try {
            const apiFilters: ServiceFilters = { ...filters };
            if (apiFilters.maxPrice === 5000) {
                delete apiFilters.maxPrice;
            }
            // Map onlyInStock to the API parameter inStock
            if (filters.onlyInStock !== undefined) {
                apiFilters.inStock = filters.onlyInStock;
            }
            return await productService.getAll(apiFilters);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);

export const fetchProductById = createAsyncThunk(
    'products/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            return await productService.getById(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialFilters;
        },
        setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
            state.selectedProduct = action.payload;
        },
        setRelatedProducts: (state, action: PayloadAction<Product[]>) => {
            state.relatedProducts = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.filteredItems = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Product By ID
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setFilters, resetFilters, setSelectedProduct, setRelatedProducts } = productSlice.actions;
export default productSlice.reducer;

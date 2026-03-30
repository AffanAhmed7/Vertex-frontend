import api from './api';

export interface ProductFilters {
    category?: string;
    search?: string;
    sortBy?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
}

const productService = {
    /**
     * Fetch all products with optional filters
     */
    async getAll(filters: ProductFilters = {}) {
        const response = await api.get('/products', { params: filters });
        return response.data;
    },

    /**
     * Fetch a single product by ID
     */
    async getById(id: string) {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },
};

export default productService;

import api from './api';

export interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        email: string;
        name?: string;
    };
}

export interface ProductReviewsResponse {
    success: boolean;
    data: {
        reviews: Review[];
        averageRating: number;
        totalReviews: number;
    };
}

const reviewService = {
    async getProductReviews(productId: string): Promise<ProductReviewsResponse> {
        const response = await api.get<ProductReviewsResponse>(`/products/${productId}/reviews`);
        return response.data;
    },

    async getUserReviews() {
        const response = await api.get('/reviews/me');
        return response.data;
    },

    async submitReview(productId: string, data: { rating: number; comment: string }) {
        const response = await api.post(`/products/${productId}/review`, data);
        return response.data;
    }
};

export default reviewService;

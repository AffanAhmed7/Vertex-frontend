import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewService, { Review } from '../../services/reviewService';

interface ReviewState {
    productReviews: {
        [productId: string]: {
            reviews: Review[];
            averageRating: number;
            totalReviews: number;
        }
    };
    userReviews: any[];
    loading: boolean;
    error: string | null;
}

const initialState: ReviewState = {
    productReviews: {},
    userReviews: [],
    loading: false,
    error: null
};

export const fetchProductReviews = createAsyncThunk(
    'reviews/fetchForProduct',
    async (productId: string, { rejectWithValue }) => {
        try {
            const response = await reviewService.getProductReviews(productId);
            return { productId, ...response.data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
        }
    }
);

export const fetchUserReviews = createAsyncThunk(
    'reviews/fetchForUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await reviewService.getUserReviews();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch your reviews');
        }
    }
);

export const submitProductReview = createAsyncThunk(
    'reviews/submit',
    async ({ productId, data }: { productId: string, data: { rating: number; comment: string } }, { rejectWithValue }) => {
        try {
            return await reviewService.submitReview(productId, data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        clearReviewError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductReviews.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProductReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.productReviews[action.payload.productId] = {
                    reviews: action.payload.reviews,
                    averageRating: action.payload.averageRating,
                    totalReviews: action.payload.totalReviews
                };
            })
            .addCase(fetchProductReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchUserReviews.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.userReviews = action.payload;
            })
            .addCase(fetchUserReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(submitProductReview.pending, (state) => {
                state.loading = true;
            })
            .addCase(submitProductReview.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(submitProductReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;

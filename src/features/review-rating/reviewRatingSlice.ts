import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import reviewService from "./reviewRatingService";
import toast from "react-hot-toast";

interface Review {
  _id: string;
  productId: string;
  userId: string;
  orderId: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewState {
  reviews: Record<string, Review>;
  reviewsArray: any;
  review: Review | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

const initialState: ReviewState = {
  reviews: {},
  reviewsArray: null,
  review: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const addReview = createAsyncThunk(
  "reviews/add",
  async (
    reviewData: {
      productId: string;
      userId: string;
      orderId: string;
      name: string;
      rating: number;
      comment: string;
    },
    thunkAPI
  ) => {
    try {
      const response = await reviewService.addReview(reviewData);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getReview = createAsyncThunk(
  'reviews/getReview',
  async ({ productId, userId, orderId }: { productId: string; userId: string; orderId: string }, thunkAPI) => {
    try {
      const response = await reviewService.getReview(productId, userId, orderId);
      return { productId, review: response };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getReviews = createAsyncThunk(
  "reviews/getReviews",
  async (productId: string, thunkAPI) => {
    try {
      const response = await reviewService.getReviews(productId);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async (
    {
      reviewId,
      reviewData,
    }: {
      reviewId: string;
      reviewData: { userId: string; rating: number; comment: string };
    },
    thunkAPI
  ) => {
    try {
      const response = await reviewService.updateReview(reviewId, reviewData);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (
    { reviewId, userId, productId }: { reviewId: string; userId: string; productId: string },
    thunkAPI
  ) => {
    try {
      await reviewService.deleteReview(reviewId, userId);
      return { reviewId, productId };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    reset: () => initialState,
    resetReview: (state) => {
      state.reviewsArray = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reviews[action.payload.productId] = action.payload;
        toast.success("Review added successfully");
      })
      .addCase(addReview.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error("Failed to add review");
      })
      .addCase(getReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReview.fulfilled, (state, action: PayloadAction<{ productId: string; review: Review }>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reviews[action.payload.productId] = action.payload.review;
      })
      .addCase(getReview.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.reviews = action.payload;
        state.reviewsArray = action.payload; 
        // state.reviews = action.payload.reduce((acc, review) => {
        //   acc[review.productId] = review;
        //   return acc;
        // }, {} as Record<string, Review>);
      })
      .addCase(getReviews.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reviews[action.payload.productId] = action.payload;
        toast.success("Review updated successfully");
      })
      .addCase(updateReview.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error("Failed to update review");
      })
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action: PayloadAction<{ reviewId: string; productId: string }>) => {
        state.isLoading = false;
        state.isSuccess = true;
        delete state.reviews[action.payload.productId];
        // console.log("deler", state.reviews[action.payload.productId])
        toast.success("Review deleted successfully");
      })
      .addCase(deleteReview.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error("Failed to delete review");
      });
  },
});

export const { reset, resetReview } = reviewSlice.actions;
export default reviewSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import wishlistService from './wishlistService';
import toast from "react-hot-toast";
import { WishlistItem } from './../../types/wishlist';
import { STATUS } from "../../constants/Status";

interface WishlistState {
  wishlistItems: WishlistItem[];
  loading: boolean;
  error: string | null;
  status: string;
  id:number
}

const initialState: WishlistState = {
  wishlistItems: [],
  loading: false,
  error: null,
  status: "",
  id:0,
};

export const fetchWishlistItems = createAsyncThunk(
  "wishlist/fetchWishlistItems",
  async (userId: string, thunkAPI) => {
    try {
      const response = await wishlistService.getUserWishlist(userId);
      return response.wishlist.products; 
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

    export const addToWishlist = createAsyncThunk(
    "wishlist/addToWishlist",
    async (wishlistItem: { userId: string; productId: number }, thunkAPI) => {
        try {
        const response = await wishlistService.addToWishlist(wishlistItem);
        toast.success(response.message);
        // console.log("hy",response.wishlist);
        return response.data;
        } catch (error: any) {
        toast.error(error.response?.data?.message || error.message);
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
    );

export const removeItemFromWishlist = createAsyncThunk(
  "wishlist/removeItemFromWishlist",
  async ({ userId, productId }: { userId: string; productId: number }, thunkAPI) => {
    try {
      await wishlistService.removeItemFromWishlist({ userId, productId });
      toast.success("Item removed from wishlist");
      return productId;
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
    

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistItems.pending, (state) => {
        state.loading = true;
        state.status = STATUS.LOADING;
      })
      .addCase(fetchWishlistItems.fulfilled, (state, action) => {
        state.loading = false;
        state.status = STATUS.IDLE;
        state.wishlistItems = action.payload;
      })
      .addCase(fetchWishlistItems.rejected, (state, action) => {
        state.loading = false;
        state.status = STATUS.ERROR;
        state.error = action.payload as string;
      })
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.status = STATUS.LOADING;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.status = STATUS.IDLE;
        state.wishlistItems.push(action.payload);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.status = STATUS.ERROR;
        state.error = action.payload as string;
      })
      .addCase(removeItemFromWishlist.pending, (state) => {
        state.loading = true;
        state.status = STATUS.LOADING;
      })
      .addCase(removeItemFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.status = STATUS.IDLE;
        state.wishlistItems = state.wishlistItems.filter(item => item.id !== action.payload);
      })
      .addCase(removeItemFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.status = STATUS.ERROR;
        state.error = action.payload as string;
      });
  },
});

export default wishlistSlice.reducer;

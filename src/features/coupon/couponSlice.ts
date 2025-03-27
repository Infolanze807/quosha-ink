import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import toast from "react-hot-toast";
import couponService from './couponService';

const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

interface CouponState {
  coupons: any[];
  totalPrice: string;
  selectedCoupon: any | null;
  discountedAmount: number;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  status: string;
  error: string | null;
}

const initialState: CouponState = {
  coupons: [],
  totalPrice: '0',
  selectedCoupon: null,
  discountedAmount: 0,
  isError: false,
  isSuccess: false,
  isLoading: false,
  status: '',
  error: null,
};

const resetState: Partial<CouponState> = {
  totalPrice: '0',
  selectedCoupon: null,
  discountedAmount: 0,
}

export const getCouponsAsync = createAsyncThunk<any[], void, { rejectValue: string }>(
  'coupons/getCoupons',
  async (_, thunkAPI) => {
    try {
      const coupons = await couponService.getCoupon();
      return coupons;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const applyCouponAsync = createAsyncThunk<any, { couponCode: string, totalPrice: string }, { rejectValue: string }>(
  'coupons/applyCoupon',
  async ({ couponCode, totalPrice }, thunkAPI) => {
    try {
      const appliedCoupon = await couponService.applyCoupon(couponCode, totalPrice);
      // console.log("order", appliedCoupon);
      return appliedCoupon;
    } catch (error: any) {
      // console.log("Hello", error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    resetCouponState: () => initialState,
    setDiscountedAmount: (state, action: PayloadAction<number>) => {
      state.discountedAmount = action.payload;
    },
    resetCoupons: (state) => {
      state.totalPrice = resetState.totalPrice!;
      state.selectedCoupon = resetState.selectedCoupon;
      state.discountedAmount = resetState.discountedAmount!;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCouponsAsync.pending, (state) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
      })
      .addCase(getCouponsAsync.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.coupons = action.payload;
        state.status = STATUS.IDLE;
      })
      .addCase(getCouponsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.status = STATUS.ERROR;
        state.error = action.payload as string;
        toast.error(`${action.payload}`);
      })
      .addCase(applyCouponAsync.pending, (state) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
      })
      .addCase(applyCouponAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedCoupon = action.payload;
        state.totalPrice = action.payload.TotalAmount;
        state.discountedAmount = action.payload.discountedAmount;
        state.status = STATUS.IDLE;
        state.error = null;
      })
      .addCase(applyCouponAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.status = STATUS.ERROR;
        state.error = action.payload as string;
        toast.error(`${action.payload}`);
      });
  },
});

export const { resetCouponState, setDiscountedAmount, resetCoupons } = couponSlice.actions;
export default couponSlice.reducer;

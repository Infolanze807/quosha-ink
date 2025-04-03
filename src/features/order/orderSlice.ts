import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { STATUS } from "../../constants/Status";
import orderService from "./orderService";

// Define your interfaces
interface Recipient {
  country_code: string;
  state_code: string;
  city: string;
  zip: string;
  address1: string;
  address2?: string;
  email: string;
}

interface Country {
  code: string;
  name: string;
  states: [];
}

interface Recipient2 {
  country_code: string;
  state_code: string;
  zip: number;
}

interface Item {
  // variant_id: number;
  sync_variant_id: number;
  quantity: number;
}

interface Item1 {
  variant_id: number;
  // sync_variant_id: number;
  quantity: number;
}

interface OrderData {
  userId: string;
  recipient: Recipient;
  items: Item[];
  shipping: string;
}

interface userData {
  userId: string;
  recipient: Recipient;
  items: Item[];
  shipping: string;
}

interface OrderAmount {
  amount: any;
  payment:any;
  // orderId: string;
  // discount: string;
  // shippingRate: string;
  // subTotalPrice: string;
  // taxRate: string;
  // totalPrice: string;
  products: [];
}

interface ShippingRateState {
  fetchUserOrders : any;
  shippingRates: any[];
  taxRates: {rate:any} | any;
  paymentResult: any;
  order: any;
  countries: Country[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  status: any;
  error: string | null;
  orderAmountDetails: OrderAmount | null;
  orderId: string | null; 
  userId: string | null; 
  walletAddress: string | null;
  Drop:any;
}

const initialState: ShippingRateState = {
  shippingRates: [],
  fetchUserOrders: null,
  taxRates: [],
  countries: [],
  paymentResult: false,
  order: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  status: "",
  error: null,
  orderAmountDetails: null,
  orderId: null,
  userId: null, 
  walletAddress: null,
  Drop:false,
};

export const fetchShippingRates = createAsyncThunk(
  "shipping/fetchRates",
  async (
    {
      recipient,
      items,
      currency,
    }: {
      recipient: Recipient2;
      items: Item1[];
      currency: string;
    },
    thunkAPI
  ) => {
    try {
      const response = await orderService.shippingRates(
        recipient,
        items,
        currency
      );
      // console.log("shipping", response);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchTaxRates = createAsyncThunk(
  "shipping/fetchTaxRates",
  async (
    {
      recipient,
    }: {
      recipient: Recipient2;
    },
    thunkAPI
  ) => {
    try {
      const response = await orderService.taxRates(recipient);
      // console.log("tax", response);
      return response;
    } catch (error: any) {
      // console.log("PPPP", error.message)
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  "order/create",
  async (orderData: OrderData, thunkAPI) => {
    try {
      const response = await orderService.createOrder(orderData);
      return response;
    } catch (error:any) {
      return thunkAPI.rejectWithValue(error.message); // Pass error message instead of Error object
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (userId: string, thunkAPI) => {
    try {
      console.log("userId", userId)
      const response = await orderService.fetchUserOrders(userId);
      // console.log("data1", response);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message); // Pass error message instead of Error object
    }
  }
);

export const fetchUserSingleOrders = createAsyncThunk(
  "order/fetchUserSingleOrders",
  async (orderId: string, thunkAPI) => {
    try {
      const response = await orderService.fetchUserSingleOrders(orderId);
      // console.log("orderSingle", response);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message); // Pass error message instead of Error object
    }
  }
);

export const createPayment = createAsyncThunk(
  "payment/create",
  async ({ total }: { total: number }, thunkAPI) => {
    try {
      const response = await orderService.createPayment(total);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const executePayment = createAsyncThunk(
  "payment/execute",
  async ({ total, paymentId, payerId }: { total: number; paymentId: string; payerId: string }, thunkAPI) => {
    try {
      const response = await orderService.executePayment({ total, paymentId, payerId });
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const checkEligibility = createAsyncThunk(
  "order/checkEligibility",
  async ({ orderId, userId, walletAddress }: { orderId: string; userId: string; walletAddress: string }, thunkAPI) => {
    try {
      // console.log("Info", orderId,userId, walletAddress)
      const response = await orderService.checkEligibility(orderId, userId, walletAddress);
       console.log("Manish22222", response)
      return response;
    } catch (error: any) {
      // console.log("Manish22", error.message)
      return thunkAPI.rejectWithValue(error.message); // Pass error message instead of Error object
    }
  }
);

export const nftDrop = createAsyncThunk(
  "order/nftDrop",
  async ({ orderId, userId }: { orderId: string; userId: string; }, thunkAPI) => {
    try {
      const response = await orderService.nftDrop(orderId, userId);
      // console.log("NFT Drop Response:", response);
      return response;
    } catch (error: any) {
      // console.log("NFT Drop Error:", error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchCountries = createAsyncThunk(
  "shipping/fetchCountries",
  async (_, thunkAPI) => {
    try {
      const response = await orderService.fetchCountries();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetShippingRates: () => initialState,
    setOrderAmountDetails(state, action: PayloadAction<OrderAmount>) {
      state.orderAmountDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchCountries.pending, (state: ShippingRateState) => {
      state.isLoading = true;
      state.status = STATUS.LOADING;
    })
    .addCase(fetchCountries.fulfilled, (state: ShippingRateState, action: PayloadAction<Country[]>) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.countries = action.payload;
      state.status = STATUS.IDLE;
    })
    .addCase(fetchCountries.rejected, (state: ShippingRateState, action) => {
      state.isLoading = false;
      state.isError = true;
      state.status = STATUS.ERROR;
      state.error = action.payload as string;
      toast.error("Failed to fetch countries. Please try again.");
    })
      .addCase(fetchShippingRates.pending, (state: ShippingRateState) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
        state.error = null; // Clear error state on pending
      })
      .addCase(
        fetchShippingRates.fulfilled,
        (state: ShippingRateState, action: PayloadAction<any[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.shippingRates = action.payload;
          state.status = STATUS.IDLE;
          state.error = null; // Clear error state on success
        }
      )
      .addCase(
        fetchShippingRates.rejected,
        (state: ShippingRateState, action) => {
          state.isLoading = false;
          state.isError = true;
          state.status = STATUS.ERROR;
          state.error = action.payload as string;

        }
      )
      .addCase(fetchTaxRates.pending, (state: ShippingRateState) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
        state.error = null; // Clear error state on pending
      })
      .addCase(
        fetchTaxRates.fulfilled,
        (state: ShippingRateState, action: PayloadAction<any[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.taxRates = action.payload;
          state.status = STATUS.IDLE;
          state.error = null; // Clear error state on success
        }
      )
      .addCase(
        fetchTaxRates.rejected,
        (state: ShippingRateState, action) => {
          state.isLoading = false;
          state.isError = true;
          state.status = STATUS.ERROR;
          state.error = action.payload as string; // Store the error message
          toast.error(`${action.payload}`);
        }
      )
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.fetchUserOrders = action.payload;
        state.status = STATUS.IDLE;
        state.error = null;  // Clear any previous errors on success
      })
      .addCase(fetchUserOrders.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.status = STATUS.ERROR;
        state.error = action.payload;  // Set error message
        state.fetchUserOrders = null;  // Clear orders on failure
      })
      .addCase(fetchUserSingleOrders.pending, (state) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
      })
      .addCase(fetchUserSingleOrders.fulfilled, (state, action: PayloadAction<userData | null>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
        state.status = STATUS.IDLE;
      })
      .addCase(fetchUserSingleOrders.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.status = STATUS.ERROR;
      })
      .addCase(createOrder.pending, (state: ShippingRateState) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
        state.error = null; // Clear error state on pending
      })
      .addCase(
        createOrder.fulfilled,
        (state: ShippingRateState, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.order = action.payload;
          state.status = STATUS.IDLE;
          state.error = null; // Clear error state on success
        })
      .addCase(createOrder.rejected, (state: ShippingRateState, action) => {
        state.isLoading = false;
        state.isError = true;
        state.status = STATUS.ERROR;
        state.error = action.payload as string; // Store the error message
        toast.error("Failed to create order. Please try again.");
      })
      .addCase(createPayment.pending, (state: ShippingRateState) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
        state.error = null; // Clear error state on pending
      })
      .addCase(
        createPayment.fulfilled,
        (state: ShippingRateState, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.paymentResult = action.payload; // Handle payment result as needed
          state.status = STATUS.IDLE;
          state.error = null; // Clear error state on success
        }
      )
      .addCase(
        createPayment.rejected,
        (state: ShippingRateState, action) => {
          state.isLoading = false;
          state.isError = true;
          state.status = STATUS.ERROR;
          state.error = action.payload as string; // Store the error message
          toast.error("Failed to create payment. Please try again.");
        }
      )
      .addCase(executePayment.pending, (state: ShippingRateState) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
        state.error = null; // Clear error state on pending
      })
      .addCase(
        executePayment.fulfilled,
        (state: ShippingRateState, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.order = action.payload;
          state.status = STATUS.IDLE;
          state.error = null; // Clear error state on success
          // toast.success("Order placed successfully!");
        }
      )
      .addCase(executePayment.rejected, (state: ShippingRateState, action) => {
        state.isLoading = false;
        state.isError = true;
        state.status = STATUS.ERROR;
        state.error = action.payload as string; // Store the error message

        toast.error("Failed to create order after payment. Please try again.");
      })
      .addCase(checkEligibility.pending, (state: ShippingRateState) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
        state.error = null; // Clear error state on pending
      })
      .addCase(checkEligibility.fulfilled, (state: ShippingRateState, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.status = action.payload;
        state.error = null; // Clear error state on success
        // Handle the eligibility response as needed
        // console.log("Eligibility response:", action.payload);
        toast.success(`${action.payload.message}`);
      })
      .addCase(checkEligibility.rejected, (state: ShippingRateState, action) => {
        state.isLoading = false;
        state.isError = true;
        state.status = STATUS.ERROR;
        state.error = action.payload as string;
        toast.error(`${action.payload}`);
      })
      .addCase(nftDrop.pending, (state: ShippingRateState) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
        state.error = null;
      })
      .addCase(nftDrop.fulfilled, (state: ShippingRateState, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.Drop = action.payload;
        state.status = STATUS.IDLE;
        state.error = null;
        toast.success(`${action.payload.message}`);
        
      })
      .addCase(nftDrop.rejected, (state: ShippingRateState, action) => {
        state.isLoading = false;
        state.isError = true;
        state.status = STATUS.ERROR;
        state.error = action.payload as string;
        toast.error("Failed to perform NFT drop. Please try again.");
      });
  },
});

export const { resetShippingRates, setOrderAmountDetails } = orderSlice.actions;
export default orderSlice.reducer;

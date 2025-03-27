import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import productService from "./productService";
import { toast } from "react-toastify";
import { Product } from "../../types/product";
import { STATUS } from "../../constants/Status";

interface ProductState {
  products: Product[]; 
  filteredProducts: Product[]; 
  product: Product | null;
  sizechart: any;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  status: string;
}

const initialState: ProductState = {
  products: [], 
  filteredProducts: [], 
  product: null,
  sizechart: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  status: "",
};

export const getProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  "products/getAll",
  async (_, thunkAPI) => {
    try {
      return await productService.getProducts();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getSingleProduct = createAsyncThunk<Product, number, { rejectValue: string }>(
  "products/getProduct",
  async (id, thunkAPI) => {
    try {
      return await productService.getSingleProduct(id);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getSizeChart = createAsyncThunk(
  "products/getSizeChart",
  async (productId: number, thunkAPI) => {
    try {
      return await productService.getSizeChart(productId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    productReset: (state) => {
      state.product = null; 
    },
    resetSizeChart: (state) => {
      state.sizechart = null;
    },

    getCategory: (state, action: PayloadAction<string>) => {
      const categoryTerms = action.payload.toLowerCase().split(" ");
      state.filteredProducts = state.products.filter((product) =>
        categoryTerms.every((term) => {
          const lowerCaseName = product.name.toLowerCase();
          return new RegExp(`\\b${term}\\b`, "i").test(lowerCaseName);
        })
      );
    },
    
    searchProducts: (state, action: PayloadAction<string>) => {
      const queryTerms = action.payload.toLowerCase().split(" ");
      state.filteredProducts = state.products.filter((product) =>
        queryTerms.every((term) => {
          const lowerCaseName = product.name.toLowerCase();
          return new RegExp(`\\b${term}\\b`, "i").test(lowerCaseName);
        })
      );
    },
    
    
  },

  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
      })
      .addCase(getProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        const flattenedProducts = action.payload.flatMap((item: any) => item.result);

        state.products = flattenedProducts;
        // console.log("state products", state.products)
        state.filteredProducts = flattenedProducts;
        // console.log("Flattened products:", flattenedProducts);

        state.status = STATUS.IDLE;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.status = STATUS.ERROR;
        toast.error(action.payload);
      })

      .addCase(getSingleProduct.pending, (state) => {
        state.isLoading = true;
        state.product = null;
        state.status = STATUS.LOADING;
      })
      .addCase(getSingleProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.product = action.payload;
        state.status = STATUS.IDLE;
      })
      .addCase(getSingleProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.status = STATUS.ERROR;
        toast.error(action.payload);
      })

      .addCase(getSizeChart.pending, (state) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
      })
      .addCase(getSizeChart.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sizechart = action.payload;
        state.status = STATUS.IDLE;
      })
      .addCase(getSizeChart.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.status = STATUS.ERROR;
      });
  },
});

export const { productReset, resetSizeChart, getCategory, searchProducts } = productSlice.actions;
export default productSlice.reducer;

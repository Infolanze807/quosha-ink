import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
// import incomeReducer from "../features/income/incomeSlice";
// import expenseReducer from "../features/expense/expenseSlice";
// import transactionReducer from "../features/transaction/transactionSlice";
import cartReducer from "../features/cart/cartSlice";
import productReducer from "../features/product/productSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import deliveryReducer from '../features/delivery/deliverySlice';
import orderReducer from "../features/order/orderSlice";
import couponReducer from "../features/coupon/couponSlice";
import reviewReducer from "../features/review-rating/reviewRatingSlice";
// import shippingRatesReducer from "../features/order/orderSlice";
// import dashboardReducer from "../features/filter/filterSlice";
// import OverviewReducer from "../features/overview/overviewSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    wishlist: wishlistReducer,
    delivery: deliveryReducer,
    order: orderReducer,
    coupons: couponReducer,
    reviews: reviewReducer,
    // shippingRates: shippingRatesReducer,
    // dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
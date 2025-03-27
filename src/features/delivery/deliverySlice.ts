import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Address } from '../../types/address';

interface DeliveryState {
    selectedAddress: Address | null;
    orderId: string | null; 
  }
  
  const initialState: DeliveryState = {
    selectedAddress: null,
    orderId: null,
  };

  const deliverySlice = createSlice({
    name: 'delivery',
    initialState,
    reducers: {
      setSelectedAddress(state, action: PayloadAction<Address>) {
        state.selectedAddress = action.payload;
      },
      setOrderId(state, action: PayloadAction<string>) {
        state.orderId = action.payload;
      }
    },
  });

export const { setSelectedAddress, setOrderId  } = deliverySlice.actions;
export default deliverySlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axiosConfig';

export const verifyPaystackPayment = createAsyncThunk(
  'payment/verifyPaystack',
  async ({ reference }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/payments/verify-paystack/?reference=${reference}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Verification failed");
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    isVerifying: false,
    success: false,
    error: null,
  },
  reducers: {
    resetPaymentState: (state) => {
      state.isVerifying = false;
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyPaystackPayment.pending, (state) => {
        state.isVerifying = true;
        state.error = null;
      })
      .addCase(verifyPaystackPayment.fulfilled, (state) => {
        state.isVerifying = false;
        state.success = true;
      })
      .addCase(verifyPaystackPayment.rejected, (state, action) => {
        state.isVerifying = false;
        state.error = action.payload;
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
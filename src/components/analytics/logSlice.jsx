import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axiosConfig.js';

export const fetchSystemLogs = createAsyncThunk(
  'logs/fetchSystemLogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/api/analytics/system-health/');
      return response.data; 
    } catch (err) {
      return rejectWithValue(err.response.data || 'Failed to fetch logs');
    }
  }
);

const logSlice = createSlice({
  name: 'logs',
  initialState: {
    activityData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
     .addCase(fetchSystemLogs.fulfilled, (state, action) => {
       state.loading = false;
       state.activityData = action.payload.activityData;
       state.summary = action.payload.summary; // Store the new summary object
     })
      .addCase(fetchSystemLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
  },
});

export default logSlice.reducer;
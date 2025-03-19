
import { createSlice } from '@reduxjs/toolkit';
import { fetchWeatherByLocation, fetchWeatherByCoordinates } from './weatherThunks';

const initialState = {
  data: null,
  locationWeather: {}, // Store weather data for different locations
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearWeatherData: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchWeatherByLocation
      .addCase(fetchWeatherByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeatherByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch weather data';
      })
      // Handle fetchWeatherByCoordinates
      .addCase(fetchWeatherByCoordinates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByCoordinates.fulfilled, (state, action) => {
        state.loading = false;
        // Store weather data for specific location
        if (action.meta.arg.locationName) {
          state.locationWeather[action.meta.arg.locationName] = action.payload;
        } else {
          state.data = action.payload;
        }
      })
      .addCase(fetchWeatherByCoordinates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch weather data';
      });
  },
});

export const { clearWeatherData } = weatherSlice.actions;

export default weatherSlice.reducer;
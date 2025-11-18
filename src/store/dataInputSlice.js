import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3079';

export const fetchUserCountryData = createAsyncThunk(
  'dataInput/fetchUserCountryData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/data-input`, {
        headers: { Authorization: token }
      });
      
      console.log('🔍 Backend Response:', response.data);
      console.log('📊 Data structure:', typeof response.data.data);
      console.log('🌍 CountryData keys:', Object.keys(response.data.data.countryData || {}));
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch data' });
    }
  }
);

export const createUserCountryData = createAsyncThunk(
  'dataInput/createUserCountryData',
  async (countryData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(`${API_URL}/api/data-input/create`, countryData, {
        headers: {
          Authorization: token  // REMOVED "Bearer " prefix
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create data' });
    }
  }
);

export const updateUserCountryData = createAsyncThunk(
  'dataInput/updateUserCountryData',
  async (updateData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      console.log('🔄 Sending update request to backend:', updateData);
      
      const response = await axios.put(`${API_URL}/api/data-input/update`, updateData, {
        headers: {
          Authorization: token  // REMOVED "Bearer " prefix
        }
      });
      
      console.log('✅ Update successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: 'Failed to update data' });
    }
  }
);

export const deleteUserCountryData = createAsyncThunk(
  'dataInput/deleteUserCountryData',
  async (countryKey, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.delete(`${API_URL}/api/data-input/delete`, {
        data: { countryKey },
        headers: {
          Authorization: token  // REMOVED "Bearer " prefix
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete data' });
    }
  }
);

const dataInputSlice = createSlice({
  name: 'dataInput',
  initialState: {
    fields: [{ name: "gpa", value: "" }],
    country: "",
    countryData: {},
    labelsData: [],
    editingField: null,
    isLoading: false,
    error: null,
    success: false
  },
  reducers: {
    setFields: (state, action) => {
      state.fields = action.payload;
    },
    setCountry: (state, action) => {
      state.country = action.payload;
    },
    setCountryData: (state, action) => {
      state.countryData = action.payload;
    },
    setLabelsData: (state, action) => {
      state.labelsData = action.payload;
    },
    setEditingField: (state, action) => {
      state.editingField = action.payload;
    },
    addField: (state) => {
      state.fields.push({ name: "", value: "" });
    },
    updateField: (state, action) => {
      const { index, key, value } = action.payload;
      state.fields[index][key] = value;
    },
    updateCountryData: (state, action) => {
      const { countryKey, data } = action.payload;
      state.countryData[countryKey] = data;
    },
    deleteCountryData: (state, action) => {
      const countryKey = action.payload;
      delete state.countryData[countryKey];
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetDataInput: (state) => {
      state.fields = [{ name: "gpa", value: "" }];
      state.country = "";
      state.countryData = {};
      state.labelsData = [];
      state.editingField = null;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
  builder
    // Fetch User Country Data
    .addCase(fetchUserCountryData.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchUserCountryData.fulfilled, (state, action) => {
      state.isLoading = false;
      
      // ✅ SIMPLE FIX: Handle array response
      const responseData = action.payload.data;
      
      // If it's an array, use the first item
      if (Array.isArray(responseData) && responseData.length > 0) {
        const firstItem = responseData[0];
        state.fields = firstItem.fields || [{ name: "gpa", value: "" }];
        state.country = firstItem.country || "";
        state.countryData = firstItem.countryData || {};
        state.labelsData = firstItem.labelsData || [];
        state.editingField = firstItem.editingField || null;
      } else {
        // If it's a single object, use it directly
        state.fields = responseData?.fields || [{ name: "gpa", value: "" }];
        state.country = responseData?.country || "";
        state.countryData = responseData?.countryData || {};
        state.labelsData = responseData?.labelsData || [];
        state.editingField = responseData?.editingField || null;
      }
    })
    .addCase(fetchUserCountryData.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || action.payload?.errors || 'Failed to fetch data';
    })

      // Create User Country Data
      .addCase(createUserCountryData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUserCountryData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fields = action.payload.data?.fields || state.fields;
        state.country = action.payload.data?.country || state.country;
        state.countryData = action.payload.data?.countryData || state.countryData;
        state.labelsData = action.payload.data?.labelsData || state.labelsData;
        state.editingField = action.payload.data?.editingField || state.editingField;
        state.success = true;
      })
      .addCase(createUserCountryData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.payload?.errors || 'Failed to create data';
      })
      // Update User Country Data
      .addCase(updateUserCountryData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserCountryData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fields = action.payload.data?.fields || state.fields;
        state.country = action.payload.data?.country || state.country;
        state.countryData = action.payload.data?.countryData || state.countryData;
        state.labelsData = action.payload.data?.labelsData || state.labelsData;
        state.editingField = action.payload.data?.editingField || state.editingField;
        state.success = true;
      })
      .addCase(updateUserCountryData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.payload?.errors || 'Failed to update data';
      })
      // Delete User Country Data
      .addCase(deleteUserCountryData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserCountryData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.countryData = action.payload.data?.countryData || state.countryData;
        state.success = true;
      })
      .addCase(deleteUserCountryData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.payload?.errors || 'Failed to delete data';
      });
  }
});

export const {
  setFields,
  setCountry,
  setCountryData,
  setLabelsData,
  setEditingField,
  addField,
  updateField,
  updateCountryData,
  deleteCountryData,
  clearError,
  clearSuccess,
  resetDataInput
} = dataInputSlice.actions;

export default dataInputSlice.reducer;
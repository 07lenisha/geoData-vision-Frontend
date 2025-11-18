import { createSlice } from '@reduxjs/toolkit';

const globalViewInitialState = {
  countries: [],
  hoverD: null,
  selectedCountry: null,
  showGraphView: false,
  graphType: 'bar',
  showGraphOnGlobe: false,
};

const globalViewSlice = createSlice({
  name: 'globalView',
  initialState: globalViewInitialState,
  reducers: {
    setCountries: (state, action) => {
      state.countries = action.payload;
    },
    setHoverD: (state, action) => {
      state.hoverD = action.payload;
    },
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
    },
    setShowGraphView: (state, action) => {
      state.showGraphView = action.payload;
    },
    setGraphType: (state, action) => {
      state.graphType = action.payload;
    },
    setShowGraphOnGlobe: (state, action) => {
      state.showGraphOnGlobe = action.payload;
    },
  },
});

export const {
  setCountries,
  setHoverD,
  setSelectedCountry,
  setShowGraphView,
  setGraphType,
  setShowGraphOnGlobe,
} = globalViewSlice.actions;

export default globalViewSlice.reducer;
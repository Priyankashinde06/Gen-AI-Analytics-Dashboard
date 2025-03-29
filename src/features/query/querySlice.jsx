import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  input: '',
  history: [],
  results: null,
  isLoading: false,
  error: null,
};

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setInput: (state, action) => {
      state.input = action.payload;
    },
    submitQuery: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    submitQuerySuccess: (state, action) => {
      state.isLoading = false;
      state.results = action.payload.results;
      state.history = [...state.history, {
        text: action.payload.query,
        timestamp: new Date().toISOString()
      }];
    },
    submitQueryFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { setInput, submitQuery, submitQuerySuccess, submitQueryFailure } = querySlice.actions;
export default querySlice.reducer;
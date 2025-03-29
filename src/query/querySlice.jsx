import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  input: '',
  history: [],
  results: null,
  metadata: null, // Added metadata field
  isLoading: false,
  error: null,
  lastUpdated: null, // Track when data was last updated
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
      state.metadata = null; // Reset metadata on new query
    },
    submitQuerySuccess: (state, action) => {
      state.isLoading = false;
      state.results = Array.isArray(action.payload.results) 
        ? action.payload.results.map(item => ({
            ...item,
            // Ensure consistent field names
            profit: item.profit || item.profitImpact || null,
            margin: item.margin || null,
            category: item.category || 'General'
          }))
        : null;
      
      state.metadata = action.payload.metadata || {
        reportType: 'Custom Query',
        timestamp: new Date().toISOString()
      };
      
      state.history = [
        ...state.history.slice(-9), // Keep only last 10 entries
        {
          text: action.payload.query,
          timestamp: new Date().toISOString(),
          type: action.payload.metadata?.reportType || 'custom',
          resultCount: action.payload.results?.length || 0
        }
      ];
      
      state.lastUpdated = new Date().toISOString();
    },
    submitQueryFailure: (state, action) => {
      state.isLoading = false;
      state.error = {
        message: action.payload,
        timestamp: new Date().toISOString(),
        query: state.input
      };
      state.metadata = {
        reportType: 'Error Report',
        error: true
      };
    },
    clearResults: (state) => {
      state.results = null;
      state.metadata = null;
    }
  },
});

export const { 
  setInput, 
  submitQuery, 
  submitQuerySuccess, 
  submitQueryFailure,
  clearResults
} = querySlice.actions;

// Selectors
export const selectEnrichedResults = (state) => {
  const { results, metadata } = state.query;
  if (!results) return null;
  
  return {
    data: results,
    metadata: {
      ...metadata,
      hasFinancials: results.some(item => item.profit != null),
      hasInventory: results.some(item => item.stock != null),
      categories: [...new Set(results.map(item => item.category).filter(Boolean))]
    }
  };
};

export default querySlice.reducer;
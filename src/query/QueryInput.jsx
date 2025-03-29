import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setInput, submitQuery, submitQuerySuccess, submitQueryFailure } from './querySlice';
import { processQuery } from '../services/MockAiServices';

const PRODUCT_SUGGESTIONS = [
  "Show sales with profit and margin",
  "View inventory with profit impact",
  "Products by category with financials",
  "Full product analysis with all metrics",
  "Low stock items with financial impact",
  "High margin products by region"
];

export const QueryInput = () => {
  const dispatch = useDispatch();
  const { input, isLoading } = useSelector((state) => state.query);
  const [activeSuggestions, setActiveSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (input.length > 0) {
      const matched = PRODUCT_SUGGESTIONS.filter(s => 
        s.toLowerCase().includes(input.toLowerCase())
      );
      setActiveSuggestions(matched.slice(0, 4));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [input]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    dispatch(submitQuery());
    try {
      const response = await processQuery(input);
      dispatch(submitQuerySuccess({ 
        query: input, 
        results: response.results 
      }));
    } catch (err) {
      dispatch(submitQueryFailure("Failed to process product query"));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    dispatch(setInput(suggestion));
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700/50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => dispatch(setInput(e.target.value))}
            placeholder="Ask about products (sales, inventory, performance)..."
            className="w-full bg-gray-800/50 text-white pl-10 p-4 pr-12 rounded-xl border border-gray-700/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-2 rounded-lg transition-all shadow-md"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        {showSuggestions && activeSuggestions.length > 0 && (
          <div className="mt-2 bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-700/50">
            <div className="p-2 border-b border-gray-700/50">
              <p className="text-xs font-medium text-purple-400">PRODUCT QUERIES</p>
            </div>
            {activeSuggestions.map((suggestion, index) => (
              <div 
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-3 hover:bg-gray-700/50 cursor-pointer transition-colors border-b border-gray-700/50 last:border-b-0 group"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500 group-hover:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-gray-300 group-hover:text-white">{suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};
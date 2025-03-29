import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setInput, submitQuery, submitQuerySuccess, submitQueryFailure } from './querySlice';
import { processQuery } from '../../services/MockAiServices';

const SUGGESTIONS = [
  "Show sales last quarter",
  "Revenue trends by month",
  "Top performing products",
  "Compare regional performance"
];

export const QueryInput = () => {
  const dispatch = useDispatch();
  const { input, isLoading } = useSelector((state) => state.query);
  const [activeSuggestions, setActiveSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (input.length > 0) {
      const matched = SUGGESTIONS.filter(s => 
        s.toLowerCase().includes(input.toLowerCase())
      );
      setActiveSuggestions(matched.slice(0, 3));
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
      dispatch(submitQueryFailure("Failed to process query"));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    dispatch(setInput(suggestion));
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="bg-gray-900/50 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-gray-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => dispatch(setInput(e.target.value))}
            placeholder="Ask anything about your data..."
            className="w-full bg-gray-800/70 text-white p-4 pr-12 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-md transition-all"
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
          <div className="mt-2 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            {activeSuggestions.map((suggestion, index) => (
              <div 
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-3 hover:bg-gray-700/50 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0"
              >
                <p className="text-gray-300">{suggestion}</p>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};
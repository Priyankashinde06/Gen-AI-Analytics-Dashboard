import React from 'react';
import { useSelector } from 'react-redux';

export const QueryHistory = () => {
  const { history } = useSelector((state) => state.query);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700/50 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          Product Query History
        </h2>
        <span className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full">
          {history.length} {history.length === 1 ? 'query' : 'queries'}
        </span>
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-8">
          <div className="relative mx-auto w-16 h-16 mb-4">
            <div className="absolute inset-0 bg-purple-500/10 rounded-full animate-pulse"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="relative h-16 w-16 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-400">Your product queries will appear here</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-127 overflow-y-auto pr-2 custom-scrollbar">
          {history.map((item, index) => (
            <div 
              key={index} 
              className="group relative bg-gray-800/40 hover:bg-gray-800/60 p-4 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <p className="text-gray-300 group-hover:text-white font-medium truncate pr-2">
                    {item.text.includes('product') ? item.text : `Products: ${item.text}`}
                  </p>
                  <span className="text-xs text-gray-500 group-hover:text-gray-400 whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300">
                    <span className="w-2 h-2 rounded-full bg-purple-400 mr-1.5"></span>
                    {item.results?.length || 0} products
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    {item.results?.reduce((acc, curr) => acc + (curr.sales || curr.revenue || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
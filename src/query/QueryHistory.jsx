import React from 'react';
import { useSelector } from 'react-redux';

export const QueryHistory = () => {
  const { history } = useSelector((state) => state.query);

  return (
    <div className="bg-gray-900/50 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-gray-700 h-full">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        Query History
      </h2>
      
      {history.length === 0 ? (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-400">Your query history will appear here</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {history.map((item, index) => (
            <div 
              key={index} 
              className="group bg-gray-800/50 hover:bg-gray-800/70 p-3 rounded-lg border border-gray-700 hover:border-purple-500/30 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <p className="text-gray-300 group-hover:text-white font-medium">{item.text}</p>
                <span className="text-xs text-gray-500 group-hover:text-gray-400">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="mt-1 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                <span className="text-xs text-gray-400">Completed</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
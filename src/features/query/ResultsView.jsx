import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { Switch } from '@headlessui/react';
Chart.register(...registerables);

export const ResultsView = () => {
  const { results, isLoading, error } = useSelector((state) => state.query);
  const [darkMode, setDarkMode] = useState(true);

  const getChartData = () => {
    const bgColor = darkMode ? 'rgba(124, 58, 237, 0.5)' : 'rgba(99, 102, 241, 0.5)';
    const borderColor = darkMode ? 'rgba(124, 58, 237, 1)' : 'rgba(99, 102, 241, 1)';
    const textColor = darkMode ? '#E5E7EB' : '#111827';

    return {
      labels: results?.map((item) => item.product || item.month) || [],
      datasets: [{
        label: results?.[0]?.sales ? 'Sales' : 'Revenue',
        data: results?.map((item) => item.sales || item.revenue) || [],
        backgroundColor: bgColor,
        borderColor: borderColor,
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: darkMode ? 'rgba(167, 139, 250, 0.7)' : 'rgba(129, 140, 248, 0.7)',
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#E5E7EB' : '#111827',
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
        }
      },
      x: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
        }
      }
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-purple-600 h-12 w-12"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-red-900/20 text-red-300 p-4 rounded-lg border border-red-800">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </div>
    </div>
  );

  if (!results) return (
    <div className="bg-gray-900/20 text-gray-300 p-6 rounded-xl border border-gray-800 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-purple-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 className="text-lg font-medium mb-1">No query submitted</h3>
      <p className="text-gray-400">Try asking about sales, revenue, or product performance</p>
    </div>
  );

  return (
    <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-white'} backdrop-blur-md p-6 rounded-xl shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Analysis Results
        </h2>
        <div className="flex items-center">
          <span className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Light</span>
          <Switch
            checked={darkMode}
            onChange={setDarkMode}
            className={`${darkMode ? 'bg-purple-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
          >
            <span
              className={`${darkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
          <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Dark</span>
        </div>
      </div>

      <div className="h-80">
        {results[0]?.month ? (
          <Line data={getChartData()} options={chartOptions} />
        ) : (
          <Bar data={getChartData()} options={chartOptions} />
        )}
      </div>
    </div>
  );
};
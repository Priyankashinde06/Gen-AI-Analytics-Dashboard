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
    const bgColor = darkMode ? 'rgba(124, 58, 237, 0.7)' : 'rgba(99, 102, 241, 0.7)';
    const borderColor = darkMode ? 'rgba(167, 139, 250, 1)' : 'rgba(129, 140, 248, 1)';
    const textColor = darkMode ? '#E5E7EB' : '#111827';
    const gridColor = darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    return {
      labels: results?.map((item) => item.product || item.month) || [],
      datasets: [{
        label: results?.[0]?.sales ? 'Sales' : 'Revenue',
        data: results?.map((item) => item.sales || item.revenue) || [],
        backgroundColor: bgColor,
        borderColor: borderColor,
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: darkMode ? 'rgba(167, 139, 250, 0.9)' : 'rgba(129, 140, 248, 0.9)',
      }]
    };
  };

  const getChartOptions = () => {
    const textColor = darkMode ? '#E5E7EB' : '#111827';
    const gridColor = darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    const tickColor = darkMode ? '#9CA3AF' : '#6B7280';
    const tooltipBg = darkMode ? '#1F2937' : '#FFFFFF';
    const tooltipTitleColor = darkMode ? '#E5E7EB' : '#111827';
    const tooltipBodyColor = darkMode ? '#D1D5DB' : '#4B5563';
    const tooltipBorderColor = darkMode ? '#4B5563' : '#E5E7EB';

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: textColor,
            font: {
              weight: '600'
            },
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: tooltipTitleColor,
          bodyColor: tooltipBodyColor,
          borderColor: tooltipBorderColor,
          borderWidth: 1,
          padding: 12,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: gridColor,
            drawBorder: false
          },
          ticks: {
            color: tickColor,
            padding: 10
          }
        },
        x: {
          grid: {
            color: gridColor,
            drawBorder: false
          },
          ticks: {
            color: tickColor,
            padding: 10
          }
        }
      }
    };
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="relative">
        <div className="absolute inset-0 bg-purple-500/10 rounded-full animate-ping"></div>
        <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full shadow-lg">
          <svg className="h-8 w-8 text-white animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 text-red-300 p-4 rounded-xl border border-red-800/50 backdrop-blur-sm">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">Error processing query</h3>
          <p className="text-sm opacity-80 mt-1">{error}</p>
        </div>
      </div>
    </div>
  );

  if (!results) return (
    <div className="bg-gradient-to-br from-gray-900/30 to-gray-800/20 text-gray-300 p-8 rounded-xl border border-gray-700/50 text-center backdrop-blur-sm">
      <div className="mx-auto w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-1">No Data Available</h3>
      <p className="text-gray-400 max-w-md mx-auto">Submit a query to analyze your data. Try asking about sales trends, revenue comparisons, or product performance metrics.</p>
    </div>
  );

  return (
    <div className={`${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200'} transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Analysis Results
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            {results.length} data points visualized
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Theme</span>
          <Switch
            checked={darkMode}
            onChange={setDarkMode}
            className={`${darkMode ? 'bg-purple-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${darkMode ? 'focus:ring-purple-500' : 'focus:ring-gray-500'}`}
          >
            <span className="sr-only">Toggle dark mode</span>
            <span
              className={`${darkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
      </div>

      <div className="h-96 -mx-2">
        {results[0]?.month ? (
          <Line data={getChartData()} options={getChartOptions()} />
        ) : (
          <Bar data={getChartData()} options={getChartOptions()} />
        )}
      </div>
    </div>
  );
};
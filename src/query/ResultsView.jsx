import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { Switch } from '@headlessui/react';
Chart.register(...registerables);

export const ResultsView = () => {
  const { results, isLoading, error } = useSelector((state) => state.query);
  const [darkMode, setDarkMode] = useState(true);
  const [chartType, setChartType] = useState('auto');

  // Enhanced data type detection
  const detectDataType = () => {
    if (!results || results.length === 0) return 'empty';
    
    const firstItem = results[0];
    const keys = Object.keys(firstItem);

    // Check for inventory data pattern first
    if ((keys.includes('stock') || keys.includes('in_stock')) && 
        (keys.includes('threshold') || keys.includes('min_stock'))) {
      return 'inventory';
    }
    
    // Check for sales data patterns
    if (keys.includes('month') && keys.includes('sales')) {
      return 'sales-trend';
    }
    if (keys.includes('product') && keys.includes('sales')) {
      return 'product-sales';
    }
    if (keys.includes('month') && keys.includes('revenue') && keys.includes('profit')) {
      return 'revenue-profit';
    }
    if (keys.includes('product') && keys.includes('rating') && keys.includes('profit')) {
      return 'performance-profit';
    }
    if (keys.includes('category') && keys.includes('profit')) {
      return 'pure-profit';
    }
    
    return 'default';
  };

  const getChartData = () => {
    const colors = {
      primaryBg: darkMode ? 'rgba(124, 58, 237, 0.7)' : 'rgba(99, 102, 241, 0.7)',
      primaryBorder: darkMode ? 'rgba(167, 139, 250, 1)' : 'rgba(129, 140, 248, 1)',
      secondaryBg: darkMode ? 'rgba(74, 222, 128, 0.7)' : 'rgba(34, 197, 94, 0.7)',
      secondaryBorder: darkMode ? 'rgba(134, 239, 172, 1)' : 'rgba(74, 222, 128, 1)',
      dangerBg: darkMode ? 'rgba(239, 68, 68, 0.7)' : 'rgba(220, 38, 38, 0.7)',
      warningBg: darkMode ? 'rgba(249, 115, 22, 0.7)' : 'rgba(234, 88, 12, 0.7)',
      optimalBg: darkMode ? 'rgba(16, 185, 129, 0.7)' : 'rgba(5, 150, 105, 0.7)',
      overstockBg: darkMode ? 'rgba(245, 158, 11, 0.7)' : 'rgba(217, 119, 6, 0.7)'
    };

    const dataType = detectDataType();

    switch(dataType) {
      case 'inventory':
        return {
          labels: results.map(item => item.product || item.name || 'Item'),
          datasets: [
            {
              label: 'Current Stock',
              data: results.map(item => item.stock || item.in_stock || 0),
              backgroundColor: results.map(item => {
                const stock = item.stock || item.in_stock || 0;
                const threshold = item.threshold || item.min_stock || 0;
                
                if (stock < threshold) {
                  return colors.dangerBg; // Red for low stock
                } else if (stock > threshold * 1.5) {
                  return colors.overstockBg; // Orange for overstock
                }
                return colors.optimalBg; // Green for optimal
              }),
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: 'Threshold',
              data: results.map(item => item.threshold || item.min_stock || 0),
              backgroundColor: 'transparent',
              borderColor: colors.primaryBorder,
              borderWidth: 2,
              borderDash: [6, 6],
              type: 'line',
              pointRadius: 0,
            }
          ],
          suggestedChartType: 'bar'
        };

      case 'sales-trend':
        return {
          labels: results.map(item => item.month),
          datasets: [{
            label: 'Sales',
            data: results.map(item => item.sales),
            backgroundColor: colors.primaryBg,
            borderColor: colors.primaryBorder,
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            yAxisID: 'y'
          }],
          suggestedChartType: 'line'
        };

      case 'product-sales':
        return {
          labels: results.map(item => item.product),
          datasets: [{
            label: 'Sales',
            data: results.map(item => item.sales),
            backgroundColor: results.map((_, i) => {
              const palette = [
                'rgba(124, 58, 237, 0.7)',
                'rgba(74, 222, 128, 0.7)',
                'rgba(249, 115, 22, 0.7)',
                'rgba(239, 68, 68, 0.7)',
                'rgba(59, 130, 246, 0.7)',
                'rgba(234, 179, 8, 0.7)'
              ];
              return palette[i % palette.length];
            }),
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            hoverBorderColor: darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)',
          }],
          suggestedChartType: 'bar'
        };

      case 'revenue-profit':
        return {
          labels: results.map(item => item.month),
          datasets: [
            {
              label: 'Revenue ($)',
              data: results.map(item => item.revenue),
              backgroundColor: colors.primaryBg,
              borderColor: colors.primaryBorder,
              borderWidth: 2,
              borderRadius: 6,
              hoverBackgroundColor: darkMode ? 'rgba(167, 139, 250, 0.9)' : 'rgba(129, 140, 248, 0.9)',
              yAxisID: 'y'
            },
            {
              label: 'Profit ($)',
              data: results.map(item => item.profit),
              backgroundColor: colors.secondaryBg,
              borderColor: colors.secondaryBorder,
              borderWidth: 2,
              borderRadius: 6,
              hoverBackgroundColor: darkMode ? 'rgba(134, 239, 172, 0.9)' : 'rgba(74, 222, 128, 0.9)',
              yAxisID: 'y1'
            }
          ],
          suggestedChartType: 'line'
        };

      case 'performance-profit':
        return {
          labels: results.map(item => item.product),
          datasets: [
            {
              label: 'Rating (1-5)',
              data: results.map(item => item.rating),
              backgroundColor: colors.primaryBg,
              borderColor: colors.primaryBorder,
              borderWidth: 2,
              borderRadius: 6,
              hoverBackgroundColor: darkMode ? 'rgba(167, 139, 250, 0.9)' : 'rgba(129, 140, 248, 0.9)',
            },
            {
              label: 'Profit ($)',
              data: results.map(item => item.profit),
              backgroundColor: colors.secondaryBg,
              borderColor: colors.secondaryBorder,
              borderWidth: 2,
              borderRadius: 6,
              hoverBackgroundColor: darkMode ? 'rgba(134, 239, 172, 0.9)' : 'rgba(74, 222, 128, 0.9)',
              yAxisID: 'y1'
            }
          ],
          suggestedChartType: 'bar'
        };

      case 'pure-profit':
        return {
          labels: results.map(item => item.category),
          datasets: [{
            label: 'Profit ($)',
            data: results.map(item => item.profit),
            backgroundColor: results.map((_, i) => {
              const palette = [
                'rgba(124, 58, 237, 0.7)',
                'rgba(74, 222, 128, 0.7)',
                'rgba(249, 115, 22, 0.7)',
                'rgba(239, 68, 68, 0.7)',
                'rgba(59, 130, 246, 0.7)',
                'rgba(234, 179, 8, 0.7)'
              ];
              return palette[i % palette.length];
            }),
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            hoverBorderColor: darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)',
          }],
          suggestedChartType: 'pie'
        };

      default:
        return {
          labels: results.map(item => item.product || item.month || 'Item'),
          datasets: [{
            label: 'Value',
            data: results.map(item => item.value || item.sales || item.revenue || 0),
            backgroundColor: colors.primaryBg,
            borderColor: colors.primaryBorder,
            borderWidth: 2,
            borderRadius: 6,
            hoverBackgroundColor: darkMode ? 'rgba(167, 139, 250, 0.9)' : 'rgba(129, 140, 248, 0.9)',
          }],
          suggestedChartType: 'bar'
        };
    }
  };

  const getChartOptions = () => {
    const textColor = darkMode ? '#E5E7EB' : '#111827';
    const gridColor = darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    const tickColor = darkMode ? '#9CA3AF' : '#6B7280';
    const tooltipBg = darkMode ? '#1F2937' : '#FFFFFF';
    const tooltipTitleColor = darkMode ? '#E5E7EB' : '#111827';
    const tooltipBodyColor = darkMode ? '#D1D5DB' : '#4B5563';
    const tooltipBorderColor = darkMode ? '#4B5563' : '#E5E7EB';
  
    const baseOptions = {
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
            title: function(context) {
              if (context[0].datasetIndex !== undefined && context[0].dataIndex !== undefined) {
                const label = context[0].label || '';
                if (label) return label;
                return context[0].dataset.label || 'Item';
              }
              return context[0].dataset.label || 'Item';
            },
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.parsed.y ?? context.raw;
              const dataItem = results[context.dataIndex];
              
              if (dataItem) {
                // Inventory data
                if ((dataItem.stock !== undefined || dataItem.in_stock !== undefined) && 
                    context.datasetIndex === 0) {
                  const threshold = dataItem.threshold || dataItem.min_stock || 0;
                  const status = value < threshold ? 'Low Stock' : 
                                value > threshold * 1.5 ? 'Overstock' : 'Optimal';
                  return [
                    `${label}: ${value}`,
                    `Threshold: ${threshold}`,
                    `Status: ${status}`
                  ];
                }

                // Default formatting
                return `${label}: ${value}`;
              }
  
              // Pie chart specific formatting
              if (context.chart.options.type === 'pie') {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
  
              return `${label}: ${value}`;
            },
            afterLabel: function(context) {
              const dataItem = results[context.dataIndex];
              if (!dataItem) return null;
  
              if (dataItem.profitImpact) {
                return `Profit Impact: ${new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(dataItem.profitImpact)}`;
              }
  
              if (dataItem.margin) {
                return `Margin: ${dataItem.margin}`;
              }
  
              if (dataItem.returns) {
                return `Return Rate: ${dataItem.returns}%`;
              }
  
              return null;
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
            padding: 10,
            callback: function(value) {
              if (detectDataType() === 'performance-profit' && this.options.title?.text?.includes('Rating')) {
                return value.toFixed(1);
              }
              return value;
            }
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
  
    const dataType = detectDataType();
  
    if (dataType === 'inventory') {
      return {
        ...baseOptions,
        scales: {
          ...baseOptions.scales,
          y: {
            ...baseOptions.scales.y,
            title: { display: true, text: 'Quantity', color: textColor },
            beginAtZero: false // Don't force zero for inventory
          }
        }
      };
    }
  
    if (dataType === 'sales-trend' || dataType === 'product-sales') {
      return {
        ...baseOptions,
        scales: {
          ...baseOptions.scales,
          y: {
            ...baseOptions.scales.y,
            title: { display: true, text: 'Sales', color: textColor }
          }
        }
      };
    }
  
    if (dataType === 'revenue-profit') {
      return {
        ...baseOptions,
        scales: {
          ...baseOptions.scales,
          y: {
            ...baseOptions.scales.y,
            title: { display: true, text: 'Revenue ($)', color: textColor },
            ticks: {
              ...baseOptions.scales.y.ticks,
              callback: function(value) {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(value);
              }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            title: { display: true, text: 'Profit ($)', color: textColor },
            ticks: { 
              color: tickColor,
              callback: function(value) {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(value);
              }
            }
          }
        }
      };
    }
  
    if (dataType === 'performance-profit') {
      return {
        ...baseOptions,
        scales: {
          ...baseOptions.scales,
          y: {
            ...baseOptions.scales.y,
            title: { display: true, text: 'Rating (1-5)', color: textColor },
            ticks: {
              ...baseOptions.scales.y.ticks,
              min: 0,
              max: 5,
              stepSize: 0.5
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            title: { display: true, text: 'Profit ($)', color: textColor },
            ticks: { 
              color: tickColor,
              callback: function(value) {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(value);
              }
            }
          }
        }
      };
    }
  
    return baseOptions;
  };

  if (isLoading) {
    return (
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
  }

  if (error) {
    return (
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
  }

  if (!results || results.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-900/30 to-gray-800/20 text-gray-300 p-8 rounded-xl border border-gray-700/50 text-center backdrop-blur-sm">
        <div className="mx-auto w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-1">No Data Available</h3>
        <p className="max-w-md mx-auto">Submit a query to analyze your data. Try asking about sales trends, revenue comparisons, or product performance metrics.</p>
      </div>
    );
  }

  const { labels, datasets, suggestedChartType } = getChartData();
  const finalChartType = chartType === 'auto' ? suggestedChartType : chartType;
  const dataType = detectDataType();

  return (
    <div className={`${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200'} transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {dataType === 'revenue-profit' && 'Revenue & Profit Analysis'}
            {dataType === 'performance-profit' && 'Product Performance'}
            {dataType === 'pure-profit' && 'Profit by Category'}
            {dataType === 'inventory' && 'Inventory Status'}
            {dataType === 'sales-trend' && 'Sales Trend'}
            {dataType === 'product-sales' && 'Product Sales'}
            {dataType === 'default' && 'Analysis Results'}
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            {results.length} data points visualized
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Chart</span>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className={`text-sm rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} px-2 py-1 border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
            >
              <option value="auto">Auto</option>
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="pie">Pie</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Theme</span>
            <Switch
              checked={darkMode}
              onChange={setDarkMode}
              className={`${darkMode ? 'bg-purple-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${darkMode ? 'focus:ring-purple-500' : 'focus:ring-gray-500'}`}
            >
              <span className="sr-only">Toggle theme</span>
              <span
                className={`${darkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </div>
      </div>

      <div className="h-92 -mx-2">
        {finalChartType === 'pie' ? (
          <Pie data={{ labels, datasets }} options={getChartOptions()} />
        ) : finalChartType === 'line' ? (
          <Line data={{ labels, datasets }} options={getChartOptions()} />
        ) : (
          <Bar data={{ labels, datasets }} options={getChartOptions()} />
        )}
      </div>
    </div>
  );
};
// Enhanced mock AI service with comprehensive query support
const RESPONSES = {
  'sales': {
    results: [
      { product: "Laptop", sales: 1500, profit: 45000, margin: "30%", category: "Electronics" },
      { product: "Phone", sales: 2000, profit: 60000, margin: "25%", category: "Electronics" },
      { product: "Tablet", sales: 800, profit: 20000, margin: "20%", category: "Electronics" },
      { product: "Smartwatch", sales: 1200, profit: 36000, margin: "35%", category: "Wearables" }
    ],
    title: "Sales Performance"
  },
  'revenue': {
    results: [
      { month: "Jan", revenue: 10000, profit: 3000, growth: 5.2, target: 9500 },
      { month: "Feb", revenue: 15000, profit: 4500, growth: 8.7, target: 14000 },
      { month: "Mar", revenue: 12000, profit: 3600, growth: 3.4, target: 12500 },
      { month: "Apr", revenue: 18000, profit: 5400, growth: 12.1, target: 16000 },
      { month: "May", revenue: 20000, profit: 6000, growth: 15.3, target: 18000 }
    ],
    title: "Revenue Analysis"
  },
  'inventory': {
    results: [
      { 
        product: "Laptop", 
        stock: 150, 
        threshold: 50, 
        profitImpact: 45000, 
        status: "Optimal",
        warehouse: "WH-001",
        lastUpdated: "2023-06-15",
        alert: false
      },
      { 
        product: "Phone", 
        stock: 75, 
        threshold: 100, 
        profitImpact: 60000, 
        status: "Low Stock",
        warehouse: "WH-002",
        lastUpdated: "2023-06-10",
        alert: true
      },
      { 
        product: "Tablet", 
        stock: 200, 
        threshold: 75, 
        profitImpact: 20000, 
        status: "Optimal",
        warehouse: "WH-003",
        lastUpdated: "2023-06-12",
        alert: false
      },
      { 
        product: "Smartwatch", 
        stock: 300, 
        threshold: 150, 
        profitImpact: 36000, 
        status: "Overstock",
        warehouse: "WH-004",
        lastUpdated: "2023-06-05",
        alert: true
      }
    ],
    title: "Inventory Status"
  },
  'performance': {
    results: [
      { product: "Laptop", rating: 4.5, returns: 2.1, profit: 45000, satisfaction: 92 },
      { product: "Phone", rating: 4.2, returns: 3.4, profit: 60000, satisfaction: 88 },
      { product: "Tablet", rating: 4.0, returns: 1.8, profit: 20000, satisfaction: 90 },
      { product: "Smartwatch", rating: 4.7, returns: 1.2, profit: 36000, satisfaction: 95 }
    ],
    title: "Product Performance"
  },
  'profit': {
    results: [
      { category: "Electronics", profit: 125000, margin: "28%", growth: 12.5 },
      { category: "Wearables", profit: 36000, margin: "35%", growth: 18.2 },
      { category: "Accessories", profit: 28000, margin: "22%", growth: 8.7 }
    ],
    title: "Profit Analysis"
  },
  'default': {
    results: [
      { product: "Smart TV", sales: 2500, profit: 75000, category: "Electronics" },
      { product: "Gaming Console", sales: 1800, profit: 54000, category: "Electronics" }
    ],
    title: "Product Overview"
  }
};

export const processQuery = async (query) => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate processing delay

  const lowerQuery = query.toLowerCase().trim();
  
  // Inventory queries
  if (/inventory|stock|warehouse|supply|available|quantity|alert/.test(lowerQuery)) {
    // Filter for specific product queries
    if (/laptop/.test(lowerQuery)) {
      return {
        ...RESPONSES.inventory,
        results: RESPONSES.inventory.results.filter(item => item.product === "Laptop")
      };
    }
    if (/low.*stock/.test(lowerQuery)) {
      return {
        ...RESPONSES.inventory,
        results: RESPONSES.inventory.results.filter(item => item.alert && item.stock < item.threshold)
      };
    }
    return RESPONSES.inventory;
  }
  
  // Sales queries
  if (/sales|selling|sold|volume|best.*selling|top.*selling/.test(lowerQuery)) {
    if (/phone/.test(lowerQuery)) {
      return {
        ...RESPONSES.sales,
        results: RESPONSES.sales.results.filter(item => item.product === "Phone")
      };
    }
    if (/category/.test(lowerQuery)) {
      // Group by category
      const categoryMap = RESPONSES.sales.results.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = { ...item, sales: 0, profit: 0 };
        }
        acc[item.category].sales += item.sales;
        acc[item.category].profit += item.profit;
        return acc;
      }, {});
      return {
        ...RESPONSES.sales,
        results: Object.values(categoryMap)
      };
    }
    if (/quarter/.test(lowerQuery)) {
      // Simulate quarterly data
      return {
        ...RESPONSES.sales,
        title: "Quarterly Sales Performance",
        results: RESPONSES.sales.results.map(item => ({
          ...item,
          sales: Math.round(item.sales * 3),
          profit: Math.round(item.profit * 3)
        }))
      };
    }
    return RESPONSES.sales;
  }
  
  // Revenue queries
  if (/revenue|income|month|quarter|growth|target|financial/.test(lowerQuery)) {
    if (/year/.test(lowerQuery)) {
      // Simulate yearly data
      return {
        ...RESPONSES.revenue,
        title: "Annual Revenue Report",
        results: [
          { month: "Q1", revenue: 37000, profit: 11100, growth: 6.4, target: 36000 },
          { month: "Q2", revenue: 50000, profit: 15000, growth: 10.2, target: 48000 },
          { month: "Q3", revenue: 42000, profit: 12600, growth: 8.1, target: 40000 },
          { month: "Q4", revenue: 65000, profit: 19500, growth: 12.7, target: 60000 }
        ]
      };
    }
    if (/comparison|vs/.test(lowerQuery)) {
      return {
        ...RESPONSES.revenue,
        title: "Revenue vs Target Comparison"
      };
    }
    return RESPONSES.revenue;
  }
  
  // Performance queries
  if (/performance|rating|return|satisfaction|review|metric/.test(lowerQuery)) {
    if (/smartwatch/.test(lowerQuery)) {
      return {
        ...RESPONSES.performance,
        results: RESPONSES.performance.results.filter(item => item.product === "Smartwatch")
      };
    }
    if (/highest|top/.test(lowerQuery)) {
      const maxRating = Math.max(...RESPONSES.performance.results.map(item => item.rating));
      return {
        ...RESPONSES.performance,
        results: RESPONSES.performance.results.filter(item => item.rating === maxRating)
      };
    }
    return RESPONSES.performance;
  }
  
  // Profit queries
  if (/profit|margin|earning|income|roi/.test(lowerQuery)) {
    if (/wearable/.test(lowerQuery)) {
      return {
        ...RESPONSES.profit,
        results: RESPONSES.profit.results.filter(item => item.category === "Wearables")
      };
    }
    if (/growth/.test(lowerQuery)) {
      return {
        ...RESPONSES.profit,
        title: "Profit Growth Analysis"
      };
    }
    if (/highest/.test(lowerQuery)) {
      const maxProfit = Math.max(...RESPONSES.profit.results.map(item => item.profit));
      return {
        ...RESPONSES.profit,
        results: RESPONSES.profit.results.filter(item => item.profit === maxProfit)
      };
    }
    return RESPONSES.profit;
  }
  
  // Default queries
  if (/overview|general|random|what's new|insight/.test(lowerQuery)) {
    return RESPONSES.default;
  }
  
  // If no specific match, return default
  return RESPONSES.default;
};
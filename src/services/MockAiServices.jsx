// Predefined responses for different query patterns
const RESPONSES = {
  'sales': {
    results: [
      { product: "Laptop", sales: 1500 },
      { product: "Phone", sales: 2000 },
      { product: "Tablet", sales: 800 }
    ]
  },
  'revenue': {
    results: [
      { month: "Jan", revenue: 10000 },
      { month: "Feb", revenue: 15000 },
      { month: "Mar", revenue: 12000 }
    ]
  },
  'default': {
    results: [
      { product: "Smart TV", sales: 2500 },   // New default product 1
      { product: "Gaming Console", sales: 1800 }  // New default product 2
    ]
  }
};

export const processQuery = async (query) => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate processing delay

  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('sales')) return RESPONSES.sales;
  if (lowerQuery.includes('revenue')) return RESPONSES.revenue;
  
  return RESPONSES.default;
};
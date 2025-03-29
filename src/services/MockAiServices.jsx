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
        { product: "Demo", sales: 1000 },
        { product: "Example", sales: 2000 }
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
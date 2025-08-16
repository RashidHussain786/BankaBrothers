export interface SalesData {
  date: string;
  totalRevenue: number;
  totalOrders: number;
}

export interface TopProductData {
  productId: number;
  productName: string;
  company: string;
  category: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface UserPerformanceData {
  userId: number;
  username: string;
  totalOrders: number;
  totalProductsSold: number;
  uniqueCustomersServed: number;
  averageOrderValue: number;
}

export interface CustomerInsightsData {
  customerId: number;
  customerName: string;
  mobile: string;
  shopName: string;
  totalOrders: number;
  totalRevenue: number;
}

import type { Order, OrderCreateRequest } from 'src/types/order';

import axiosInstance, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

export const ordersApi = {
  // Customer endpoints
  getCustomerOrders: () => 
    axiosInstance.get(endpoints.customer.orders),

  getOrderDetails: (id: number) => 
    axiosInstance.get(endpoints.customer.orderDetails(id)),

  createOrder: (data: OrderCreateRequest) => 
    axiosInstance.post(endpoints.customer.orders, data),

  cancelOrder: (id: number) => 
    axiosInstance.post(`${endpoints.customer.orderDetails(id)}/cancel`),

  getOrderSummary: (data: { items: Array<{ ticket_type_id: number; quantity: number }> }) => 
    axiosInstance.post(`${endpoints.customer.orders}/summary`, data),

  // Admin endpoints
  getAllOrders: (filters?: { status?: string; from?: string; to?: string }) => {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);
    
    const queryString = params.toString();
    const url = queryString ? `${endpoints.admin.orders}?${queryString}` : endpoints.admin.orders;
    
    return axiosInstance.get(url);
  },

  getOrderAnalytics: () => 
    axiosInstance.get(`${endpoints.admin.orders}/analytics`),
};
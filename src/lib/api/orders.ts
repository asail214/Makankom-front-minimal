import axiosInstance, { endpoints } from 'src/lib/axios';
import type { 
  Order, 
  OrderCreateRequest, 
  OrderSummaryRequest, 
  OrderSummary, 
  PaymentRequest,
  Payment 
} from 'src/types/order';

// ----------------------------------------------------------------------

export const ordersApi = {
  // Customer endpoints
  getCustomerOrders: () => 
    axiosInstance.get(endpoints.customer.orders),

  getOrderDetails: (id: number) => 
    axiosInstance.get(endpoints.customer.orderDetails(id)),

  createOrder: (data: OrderCreateRequest) => 
    axiosInstance.post(endpoints.customer.orders, data),

  getOrderSummary: (data: OrderSummaryRequest) => 
    axiosInstance.post('/customer/orders/summary', data),

  cancelOrder: (id: number) => 
    axiosInstance.post(`${endpoints.customer.orderDetails(id)}/cancel`),

  // Payment endpoints
  getPaymentHistory: () => 
    axiosInstance.get('/customer/payments'),

  processPayment: (data: PaymentRequest) => 
    axiosInstance.post(endpoints.customer.createPayment, data),
};

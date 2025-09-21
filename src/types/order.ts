// Order and Ticket Types for Makankom Platform

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'digital_wallet';

export type OrderItem = {
  id: number;
  quantity: number;
  unit_price: string;
  total_price: string;
  ticket_type: {
    id: number;
    name: string;
    description?: string;
  };
};

export type Order = {
  id: number;
  order_number: string;
  status: OrderStatus;
  subtotal: string;
  tax_amount: string;
  discount_amount: string;
  total_amount: string;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  payment_reference?: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
  event?: {
    id: number;
    title: string;
    start_date: string;
    venue_name: string;
  };
};

export type OrderCreateRequest = {
  event_id: number;
  items: Array<{
    ticket_type_id: number;
    quantity: number;
  }>;
};

export type OrderSummaryRequest = {
  items: Array<{
    ticket_type_id: number;
    quantity: number;
  }>;
};

export type OrderSummary = {
  subtotal: string;
  tax_amount: string;
  discount_amount: string;
  total_amount: string;
  items: Array<{
    ticket_type: {
      id: number;
      name: string;
      price: string;
    };
    quantity: number;
    unit_price: string;
    total_price: string;
  }>;
};

export type PaymentRequest = {
  order_id: number;
  amount: string;
  payment_method: PaymentMethod;
  payment_reference?: string;
};

export type Payment = {
  id: number;
  order_id: number;
  amount: string;
  payment_method: PaymentMethod;
  payment_reference?: string;
  status: PaymentStatus;
  gateway_response?: any;
  created_at: string;
  updated_at: string;
};

// Ticket Types
export type TicketStatus = 'active' | 'used' | 'cancelled' | 'refunded';

export type Ticket = {
  id: number;
  ticket_number: string;
  status: TicketStatus;
  qr_code: string;
  qr_payload: string; // For scanning validation
  event: {
    id: number;
    title: string;
    start_date: string;
    venue_name: string;
    venue_address: string;
  };
  ticket_type: {
    id: number;
    name: string;
    description?: string;
  };
  order: {
    id: number;
    order_number: string;
  };
  created_at: string;
  updated_at: string;
};

// Wishlist Types
export type WishlistItem = {
  id: number;
  event: {
    id: number;
    title: string;
    slug: string;
    start_date: string;
    venue_name: string;
    banner_image?: string;
    ticket_types: Array<{
      id: number;
      name: string;
      price: string;
    }>;
  };
  created_at: string;
};

export type WishlistAddRequest = {
  event_id: number;
};

// Additional order types for compatibility with existing components
export type IOrderItem = OrderItem;
export type IOrderCustomer = {
  id: number;
  name: string;
  email: string;
  phone?: string;
};
export type IOrderDelivery = {
  id: number;
  method: string;
  address: string;
  status: string;
};
export type IOrderHistory = {
  timeline: Array<{
    id: number;
    status: string;
    timestamp: string;
    description: string;
  }>;
};
export type IOrderProductItem = OrderItem;
export type IOrderPayment = {
  id: number;
  method: string;
  status: string;
  amount: string;
  transaction_id?: string;
};
export type IOrderShippingAddress = {
  id: number;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
};
export type IOrderTableFilters = {
  status?: string;
  from?: string;
  to?: string;
  q?: string;
  page?: number;
  per_page?: number;
};
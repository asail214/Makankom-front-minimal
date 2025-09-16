import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error?.message || 'Something went wrong!';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async <T = unknown>(
  args: string | [string, AxiosRequestConfig]
): Promise<T> => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args, {}];
    const res = await axiosInstance.get<T>(url, config);
    return res.data;
  } catch (error) {
    console.error('Fetcher failed:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  // ---------- Public (no auth) ----------
  public: {
    events: '/v1/events',
    eventDetails: (id: string | number) => `/v1/events/${id}`,
    categories: '/v1/event-categories',
  },

  // ---------- Customer ----------
  customer: {
    register: '/customer/register',
    login: '/customer/login',
    logout: '/customer/logout',
    profile: '/customer/profile',
    updateProfile: '/customer/profile',
    changePassword: '/customer/change-password',

    orders: '/customer/orders',
    createOrder: '/customer/orders',
    orderDetails: (id: number) => `/customer/orders/${id}`,
    cancelOrder: (id: number) => `/customer/orders/${id}/cancel`,
    orderSummary: '/customer/orders/summary',

    tickets: '/customer/tickets',
    ticketDetails: (id: number) => `/customer/tickets/${id}`,

    wishlist: '/customer/wishlist',
    addToWishlist: '/customer/wishlist',
    removeFromWishlist: (id: number) => `/customer/wishlist/${id}`,

    payments: '/customer/payments',
    createPayment: '/customer/payments',
  },

  // ---------- Organizer ----------
  organizer: {
    register: '/organizer/register',
    login: '/organizer/login',
    logout: '/organizer/logout',
    profile: '/organizer/profile',
    updateProfile: '/organizer/profile',
    changePassword: '/organizer/change-password',

    events: '/organizer/events',
    createEvent: '/organizer/events',
    eventDetails: (id: number) => `/organizer/events/${id}`,
    updateEvent: (id: number) => `/organizer/events/${id}`,
    deleteEvent: (id: number) => `/organizer/events/${id}`,
    submitForApproval: (id: number) => `/organizer/events/${id}/submit-for-approval`,
    myEvents: '/organizer/my-events',

    // File uploads
    uploadEventCover: (eventId: number) => `/organizer/events/${eventId}/cover`,
    uploadOrganizerCr: '/organizer/cr/upload',
    uploadBrandLogo: (brandId: number) => `/organizer/brands/${brandId}/logo`,
  },

  // ---------- Admin ----------
  admin: {
    login: '/admin/login',
    logout: '/admin/logout',
    profile: '/admin/profile',
    updateProfile: '/admin/profile',
    changePassword: '/admin/change-password',

    events: '/admin/events',
    pendingEvents: '/admin/events/pending',
    eventDetails: (id: number) => `/admin/events/${id}`,
    approveEvent: (id: number) => `/admin/events/${id}/approve`,
    rejectEvent: (id: number) => `/admin/events/${id}/reject`,

    organizers: '/admin/organizers',
    organizerDetails: (id: number) => `/admin/organizers/${id}`,
    verifyOrganizer: (id: number) => `/admin/organizers/${id}/verify`,
    deactivateOrganizer: (id: number) => `/admin/organizers/${id}/deactivate`,

    reportsSalesSummary: '/admin/reports/sales-summary',
    reportsPlatformMetrics: '/admin/reports/platform-metrics',
  },

  // ---------- Scan Point ----------
  scan: {
    create: '/scan-point/create',
    login: '/scan-point/login',
    logout: '/scan-point/logout',
    profile: '/scan-point/profile',
    updateProfile: '/scan-point/profile',
    generateToken: '/scan-point/generate-token',

    scanTicket: '/scan-point/scan',
    validateTicket: '/scan-point/validate',
    scanHistory: '/scan-point/history',
    eventStats: (eventId: number) => `/scan-point/${eventId}/stats`,
  },
} as const;

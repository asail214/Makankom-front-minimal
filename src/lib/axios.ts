import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';

//import { HOST_API } from '@/global-config';

//import i18n from '@/locales';    

import { CONFIG } from 'src/global-config';

/**
 * --------------------------------------------------------------------------
 * Axios instance
 * --------------------------------------------------------------------------
 */
const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl, // e.g. http://127.0.0.1:8000/api  (from .env -> VITE_SERVER_URL)
  headers: { 'Content-Type': 'application/json' },

});

/**
 * Request interceptor: attach bearer token if present
 * - If you already have a JWT helper (e.g., setSession/JWT_STORAGE_KEY), replace localStorage key accordingly.
 */
axiosInstance.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('accessToken') || // <-- fallback
    localStorage.getItem('authToken'); // <-- or whatever your auth utils use

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response interceptor: normalize errors for easier UI handling
 */
axiosInstance.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => {
    // You can shape error messages here
    const message =
      error.response?.data?.message || error.message || 'Unexpected error. Please try again.';
    return Promise.reject({ ...error, message });
  }
);

/**
 * SWR fetcher helper
 * - Works with: useSWR(url, fetcher) or useSWR([url, { params }], fetcher)
 */
export const fetcher = (args: string | [string, AxiosRequestConfig?]) => {
  if (typeof args === 'string') {
    return axiosInstance.get(args).then((res) => res.data);
  }
  const [url, config] = args;
  return axiosInstance.get(url, config).then((res) => res.data);
};

export default axiosInstance;

/**
 * --------------------------------------------------------------------------
 * API Endpoints
 * Keep everything centralized so refactors are 1-file changes.
 * --------------------------------------------------------------------------
 */
export const endpoints = {
  // =========================
  // Public (no auth required)
  // =========================
  public: {
    events: '/v1/events',
    eventDetails: (id: string | number) => `/v1/events/${id}`,
    categories: '/v1/event-categories',
  },

  // =========================
  // Minimal auth block (for template auth views)
  // You can point this to "customer" for now; we’ll add role-specific
  // actions in your AuthContext (customerLogin, organizerLogin, etc.)
  // =========================
  auth: {
    signIn: '/customer/login',
    signUp: '/customer/register',
    me: '/customer/profile',
  },

  // =========================
  // Customer (auth:customer)
  // =========================
  customer: {
    register: '/customer/register',
    login: '/customer/login',
    logout: '/customer/logout',

    profile: '/customer/profile',
    updateProfile: '/customer/profile',
    changePassword: '/customer/change-password',

    orders: '/customer/orders',
    orderDetails: (id: number) => `/customer/orders/${id}`,

    tickets: '/customer/tickets',
    ticketDetails: (id: number) => `/customer/tickets/${id}`,

    wishlist: '/customer/wishlist',
    addToWishlist: '/customer/wishlist', // POST { event_id }
    removeFromWishlist: (id: number) => `/customer/wishlist/${id}`,

    // If you implemented payments on customer side:
    createPayment: '/customer/payments',
  },

  // =========================
  // Organizer (auth:organizer)
  // =========================
  organizer: {
    register: '/organizer/register',
    login: '/organizer/login',
    logout: '/organizer/logout',

    profile: '/organizer/profile',
    updateProfile: '/organizer/profile',
    changePassword: '/organizer/change-password',

    events: '/organizer/events', // GET (list) / POST (create)
    eventDetails: (id: number) => `/organizer/events/${id}`, // GET / PUT / DELETE
    submitForApproval: (id: number) => `/organizer/events/${id}/submit-for-approval`,

    brands: '/organizer/brands',
    brandDetails: (id: number) => `/organizer/brands/${id}`,

    scanPoints: '/organizer/scan-points',
    scanPointDetails: (id: number) => `/organizer/scan-points/${id}`,
  },

  // =========================
  // Admin (auth:admin)
  // =========================
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
    categories: '/admin/categories',
  },

  // =========================
  // Scan Point (auth:scan-point)
  // =========================
  scan: {
    create: '/scan-point/create',
    login: '/scan-point/login',
    logout: '/scan-point/logout',

    profile: '/scan-point/profile',
    updateProfile: '/scan-point/profile',
    generateToken: '/scan-point/generate-token',

    scanTicket: '/scan-point/scan', // POST {qr_code}
    validateTicket: '/scan-point/validate',
    scanHistory: '/scan-point/history',
    eventStats: (eventId: number) => `/scan-point/${eventId}/stats`,
  },

  /**
   * =========================
   * STUBS for template demo features
   * =========================
   * These exist ONLY to satisfy imports in demo pages (blog/product/mail/chat/kanban/calendar).
   * They won’t be called unless you navigate to the demo routes.
   */
  post: {
    list: '/dev/post/list',
    details: '/dev/post/details',
    latest: '/dev/post/latest',
    search: '/dev/post/search',
  },
  product: {
    list: '/dev/product/list',
    details: '/dev/product/details',
    search: '/dev/product/search',
  },
  mail: {
    list: '/dev/mail/list',
    details: '/dev/mail/details',
    labels: '/dev/mail/labels',
  },
  calendar: '/dev/calendar',
  chat: '/dev/chat',
  kanban: '/dev/kanban',
} as const;

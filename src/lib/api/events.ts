import axiosInstance, { endpoints } from 'src/lib/axios';
import type { Event, EventFilters, EventCreateRequest, EventUpdateRequest } from 'src/types/event';

// ----------------------------------------------------------------------

export const eventsApi = {
  // Public endpoints (no auth required)
  getEvents: (filters?: EventFilters) => {
    const params = new URLSearchParams();
    
    if (filters?.category_id) params.append('category_id', filters.category_id.toString());
    if (filters?.brand_id) params.append('brand_id', filters.brand_id.toString());
    if (filters?.organizer_id) params.append('organizer_id', filters.organizer_id.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);
    if (filters?.q) params.append('q', filters.q);
    if (filters?.page) params.append('page', filters.page.toString());
    // ⬇️ ADD THESE TWO LINES
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());
    if (filters?.is_featured !== undefined) params.append('is_featured', filters.is_featured ? '1' : '0');

    const queryString = params.toString();
    const url = queryString ? `${endpoints.public.events}?${queryString}` : endpoints.public.events;

    return axiosInstance.get(url);
  },

  getEventDetails: (id: string | number) => 
    axiosInstance.get(endpoints.public.eventDetails(id)),

  getCategories: () => 
    axiosInstance.get(endpoints.public.categories),

  // Customer endpoints
  getCustomerWishlist: () => 
    axiosInstance.get(endpoints.customer.wishlist),

  addToWishlist: (eventId: number) => 
    axiosInstance.post(endpoints.customer.addToWishlist, { event_id: eventId }),

  removeFromWishlist: (wishlistId: number) => 
    axiosInstance.delete(endpoints.customer.removeFromWishlist(wishlistId)),

  // Organizer endpoints
  getOrganizerEvents: () => 
    axiosInstance.get(endpoints.organizer.events),

  createEvent: (data: EventCreateRequest) => 
    axiosInstance.post(endpoints.organizer.events, data),

  updateEvent: (id: number, data: EventUpdateRequest) => 
    axiosInstance.put(endpoints.organizer.eventDetails(id), data),

  deleteEvent: (id: number) => 
    axiosInstance.delete(endpoints.organizer.eventDetails(id)),

  submitEventForApproval: (id: number) => 
    axiosInstance.post(endpoints.organizer.submitForApproval(id)),

  uploadEventCover: (eventId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return axiosInstance.post(`/organizer/events/${eventId}/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Admin endpoints
  getAllEvents: (filters?: EventFilters) => {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.organizer_id) params.append('organizer_id', filters.organizer_id.toString());
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);
    
    const queryString = params.toString();
    const url = queryString ? `${endpoints.admin.events}?${queryString}` : endpoints.admin.events;
    
    return axiosInstance.get(url);
  },

  getPendingEvents: () => 
    axiosInstance.get(endpoints.admin.pendingEvents),

  approveEvent: (id: number) => 
    axiosInstance.post(endpoints.admin.approveEvent(id)),

  rejectEvent: (id: number, reason: string) => 
    axiosInstance.post(endpoints.admin.rejectEvent(id), { reason }),
};

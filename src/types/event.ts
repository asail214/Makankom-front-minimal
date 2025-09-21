// Event Types for Makankom Platform

export type EventStatus = 'draft' | 'pending' | 'published' | 'cancelled' | 'completed';

export type EventCategory = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  created_at: string;
  updated_at: string;
};

export type Brand = {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  created_at: string;
  updated_at: string;
};

export type TicketType = {
  id: number;
  name: string;
  description?: string;
  price: string;
  quantity_available: number;
  quantity_sold: number;
  is_active: boolean;
  sales_start_date?: string;
  sales_end_date?: string;
  created_at: string;
  updated_at: string;
};

export type Event = {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  start_date: string;
  end_date: string;
  venue_name: string;
  venue_address: string;
  latitude?: number;
  longitude?: number;
  banner_image?: string;
  cover_image?: string;
  status: EventStatus;
  is_approved: boolean;
  is_featured: boolean;
  category: EventCategory;
  brand: Brand;
  ticket_types: TicketType[];
  created_at: string;
  updated_at: string;
};

export type EventFilters = {
  category_id?: number;
  brand_id?: number;
  organizer_id?: number;
  status?: EventStatus;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  q?: string; // Search query
  page?: number;
  per_page?: number;
  is_featured?: boolean;
};

export type EventCreateRequest = {
  brand_id: number;
  category_id: number;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  start_date: string;
  end_date: string;
  venue_name: string;
  venue_address: string;
  latitude?: number;
  longitude?: number;
  status?: EventStatus;
};

export type EventUpdateRequest = Partial<EventCreateRequest>;

// Event Statistics
export type EventStats = {
  total_events: number;
  published_events: number;
  pending_events: number;
  total_tickets_sold: number;
  total_revenue: string;
  upcoming_events: number;
  past_events: number;
};

// Event Analytics
export type EventAnalytics = {
  event_id: number;
  event_title: string;
  total_tickets_sold: number;
  total_revenue: string;
  conversion_rate: number;
  top_selling_ticket_type: string;
  sales_by_date: Array<{
    date: string;
    tickets_sold: number;
    revenue: string;
  }>;
  attendance_stats: {
    total_scanned: number;
    total_attended: number;
    no_show_rate: number;
  };
};

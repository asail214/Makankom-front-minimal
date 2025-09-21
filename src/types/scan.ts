// Scan Point Types for Makankom Platform

export type ScanType = 'entry' | 'exit' | 'validation';

export type ScanStatus = 'success' | 'failed' | 'already_used' | 'invalid_ticket' | 'event_not_found';

export type ScanResult = {
  success: boolean;
  status: ScanStatus;
  message: string;
  ticket?: {
    id: number;
    ticket_number: string;
    event_title: string;
    ticket_type_name: string;
    customer_name: string;
    scan_count: number;
    first_scan_at?: string;
    last_scan_at?: string;
  };
  event?: {
    id: number;
    title: string;
    start_date: string;
    venue_name: string;
  };
};

export type ScanRequest = {
  qr_code: string;
  scan_type: ScanType;
  device_info?: string;
  location?: string;
  notes?: string;
};

export type ScanHistory = {
  id: number;
  ticket_id: number;
  scan_type: ScanType;
  status: ScanStatus;
  device_info?: string;
  location?: string;
  notes?: string;
  scanned_at: string;
  ticket: {
    ticket_number: string;
    event_title: string;
    ticket_type_name: string;
    customer_name: string;
  };
  event: {
    id: number;
    title: string;
    start_date: string;
  };
};

export type ScanPoint = {
  id: number;
  name: string;
  location: string;
  description?: string;
  token: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ScanPointCreateRequest = {
  name: string;
  location: string;
  description?: string;
};

export type ScanPointLoginRequest = {
  token: string;
};

export type EventScanStats = {
  event_id: number;
  event_title: string;
  total_tickets: number;
  total_scanned: number;
  unique_attendees: number;
  no_shows: number;
  attendance_rate: number;
  scans_by_type: {
    entry: number;
    exit: number;
    validation: number;
  };
  scans_by_hour: Array<{
    hour: string;
    count: number;
  }>;
  recent_scans: ScanHistory[];
};

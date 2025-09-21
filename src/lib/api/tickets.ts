import axiosInstance, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

export const ticketsApi = {
  // Customer endpoints
  getCustomerTickets: () => 
    axiosInstance.get(endpoints.customer.tickets),

  getTicketDetails: (id: number) => 
    axiosInstance.get(endpoints.customer.ticketDetails(id)),

  // Scan Point endpoints
  validateTicket: (qrCode: string) => 
    axiosInstance.post(endpoints.scan.validateTicket, { qr_code: qrCode }),

  scanTicket: (data: {
    qr_code: string;
    scan_type: 'entry' | 'exit';
    device_info?: string;
    location?: string;
    notes?: string;
  }) => 
    axiosInstance.post(endpoints.scan.scanTicket, data),

  getScanHistory: () => 
    axiosInstance.get(endpoints.scan.scanHistory),

  getEventStats: (eventId: number) => 
    axiosInstance.get(endpoints.scan.eventStats(eventId)),
};
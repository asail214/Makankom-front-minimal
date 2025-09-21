import axiosInstance, { endpoints } from 'src/lib/axios';
import type { Ticket } from 'src/types/order';

// ----------------------------------------------------------------------

export const ticketsApi = {
  // Customer endpoints
  getCustomerTickets: () => 
    axiosInstance.get(endpoints.customer.tickets),

  getTicketDetails: (id: number) => 
    axiosInstance.get(endpoints.customer.ticketDetails(id)),
};

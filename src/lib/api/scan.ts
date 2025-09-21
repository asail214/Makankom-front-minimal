import axiosInstance, { endpoints } from 'src/lib/axios';
import type { 
  ScanRequest, 
  ScanResult, 
  ScanHistory, 
  ScanPoint, 
  ScanPointCreateRequest,
  ScanPointLoginRequest,
  EventScanStats 
} from 'src/types/scan';

// ----------------------------------------------------------------------

export const scanApi = {
  // Scan Point endpoints
  createScanPoint: (data: ScanPointCreateRequest) => 
    axiosInstance.post(endpoints.scan.create, data),

  loginScanPoint: (data: ScanPointLoginRequest) => 
    axiosInstance.post(endpoints.scan.login, data),

  logoutScanPoint: () => 
    axiosInstance.post(endpoints.scan.logout),

  getScanPointProfile: () => 
    axiosInstance.get(endpoints.scan.profile),

  updateScanPointProfile: (data: Partial<ScanPoint>) => 
    axiosInstance.put(endpoints.scan.updateProfile, data),

  generateScanPointToken: () => 
    axiosInstance.post(endpoints.scan.generateToken),

  // Ticket scanning
  scanTicket: (data: ScanRequest) => 
    axiosInstance.post(endpoints.scan.scanTicket, data),

  validateTicket: (qrCode: string) => 
    axiosInstance.post(endpoints.scan.validateTicket, { qr_code: qrCode }),

  getScanHistory: () => 
    axiosInstance.get(endpoints.scan.scanHistory),

  getEventStats: (eventId: number) => 
    axiosInstance.get(endpoints.scan.eventStats(eventId)),
};

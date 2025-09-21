// User Types for Makankom Platform
export type UserRole = 'customer' | 'organizer' | 'admin' | 'scan-point';

export type BaseUser = {
  id: number;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  preferred_language: 'en' | 'ar';
  created_at: string;
  updated_at: string;
};

export type Customer = BaseUser & {
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'customer';
};

export type Organizer = BaseUser & {
  name: string;
  phone: string;
  business_name: string;
  business_address: string;
  business_phone: string;
  role: 'organizer';
  is_verified: boolean;
};

export type Admin = BaseUser & {
  name: string;
  role: 'admin';
};

export type ScanPoint = BaseUser & {
  name: string;
  location: string;
  description?: string;
  role: 'scan-point';
  token: string;
};

export type UserType = Customer | Organizer | Admin | ScanPoint | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
  role: UserRole | null;
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  role: UserRole | null;
  checkUserSession?: () => Promise<void>;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (data: any, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

// API Response Types
export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
  error_code?: string;
  errors?: Record<string, string[]>;
};

// Authentication Request Types
export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  password_confirmation: string;
  // Customer specific
  first_name?: string;
  last_name?: string;
  // Organizer specific
  name?: string;
  phone?: string;
  business_name?: string;
  business_address?: string;
  business_phone?: string;
  // Scan Point specific
  location?: string;
  description?: string;
};

export type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
};

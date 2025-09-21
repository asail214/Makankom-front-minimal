import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from '../hooks';
import { endpoints } from 'src/lib/axios';
import { AuthContext } from './auth-context';
import type { 
  AuthContextValue, 
  UserType, 
  UserRole, 
  LoginRequest, 
  RegisterRequest,
  ChangePasswordRequest,
  ApiResponse 
} from '../types';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

const STORAGE_KEY = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_ROLE: 'userRole',
} as const;

// ----------------------------------------------------------------------

export function MakankomAuthProvider({ children }: Props) {
  const router = useRouter();
  
  const [user, setUser] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);

  const authenticated = !!user;
  const unauthenticated = !user;

  // ----------------------------------------------------------------------

  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
      const userRole = localStorage.getItem(STORAGE_KEY.USER_ROLE) as UserRole;

      if (accessToken && userRole) {
        setRole(userRole);
        
        // Get user profile based on role
        const profileEndpoint = getProfileEndpoint(userRole);
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}${profileEndpoint}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data: ApiResponse = await response.json();
          setUser(data.data);
        } else {
          // Token is invalid, clear storage
          localStorage.removeItem(STORAGE_KEY.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEY.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEY.USER_ROLE);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------------------------------------------------

  const login = useCallback(async (email: string, password: string, userRole: UserRole) => {
    try {
      setLoading(true);
      
      const loginEndpoint = getLoginEndpoint(userRole);
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}${loginEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: ApiResponse = await response.json();

      if (response.ok && data.success) {
        const { token, [userRole]: userData } = data.data;
        
        // Store tokens and user data
        localStorage.setItem(STORAGE_KEY.ACCESS_TOKEN, token);
        localStorage.setItem(STORAGE_KEY.USER_ROLE, userRole);
        setUser(userData);
        setRole(userRole);

        // Redirect based on role
        const redirectPath = getRedirectPath(userRole);
        router.push(redirectPath);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [router]);

  // ----------------------------------------------------------------------

  const register = useCallback(async (data: RegisterRequest, userRole: UserRole) => {
    try {
      setLoading(true);
      
      const registerEndpoint = getRegisterEndpoint(userRole);
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}${registerEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData: ApiResponse = await response.json();

      if (response.ok && responseData.success) {
        // Auto-login after successful registration
        await login(data.email, data.password, userRole);
      } else {
        throw new Error(responseData.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [login]);

  // ----------------------------------------------------------------------

  const logout = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
      const userRole = localStorage.getItem(STORAGE_KEY.USER_ROLE) as UserRole;

      if (accessToken && userRole) {
        const logoutEndpoint = getLogoutEndpoint(userRole);
        await fetch(`${import.meta.env.VITE_SERVER_URL}${logoutEndpoint}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear storage and state regardless of API call success
      localStorage.removeItem(STORAGE_KEY.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEY.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEY.USER_ROLE);
      setUser(null);
      setRole(null);
      router.push('/');
    }
  }, [router]);

  // ----------------------------------------------------------------------

  const updateProfile = useCallback(async (data: any) => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
      const userRole = localStorage.getItem(STORAGE_KEY.USER_ROLE) as UserRole;

      if (!accessToken || !userRole) {
        throw new Error('Not authenticated');
      }

      const profileEndpoint = getProfileEndpoint(userRole);
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}${profileEndpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData: ApiResponse = await response.json();

      if (response.ok && responseData.success) {
        setUser(responseData.data);
      } else {
        throw new Error(responseData.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }, []);

  // ----------------------------------------------------------------------

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
      const userRole = localStorage.getItem(STORAGE_KEY.USER_ROLE) as UserRole;

      if (!accessToken || !userRole) {
        throw new Error('Not authenticated');
      }

      const changePasswordEndpoint = getChangePasswordEndpoint(userRole);
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}${changePasswordEndpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: newPassword,
        }),
      });

      const responseData: ApiResponse = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || 'Password change failed');
      }
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }, []);

  // ----------------------------------------------------------------------

  const checkUserSession = useCallback(async () => {
    await initialize();
  }, [initialize]);

  // ----------------------------------------------------------------------

  useEffect(() => {
    initialize();
  }, [initialize]);

  // ----------------------------------------------------------------------

  const memoizedValue: AuthContextValue = {
    user,
    loading,
    authenticated,
    unauthenticated,
    role,
    checkUserSession,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}

// ----------------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------------

function getLoginEndpoint(role: UserRole): string {
  switch (role) {
    case 'customer':
      return endpoints.customer.login;
    case 'organizer':
      return endpoints.organizer.login;
    case 'admin':
      return endpoints.admin.login;
    case 'scan-point':
      return endpoints.scan.login;
    default:
      throw new Error(`Invalid user role: ${role}`);
  }
}

function getRegisterEndpoint(role: UserRole): string {
  switch (role) {
    case 'customer':
      return endpoints.customer.register;
    case 'organizer':
      return endpoints.organizer.register;
    case 'scan-point':
      return endpoints.scan.create;
    case 'admin':
      throw new Error('Admin registration not allowed');
    default:
      throw new Error(`Invalid user role: ${role}`);
  }
}

function getLogoutEndpoint(role: UserRole): string {
  switch (role) {
    case 'customer':
      return endpoints.customer.logout;
    case 'organizer':
      return endpoints.organizer.logout;
    case 'admin':
      return endpoints.admin.logout;
    case 'scan-point':
      return endpoints.scan.logout;
    default:
      throw new Error(`Invalid user role: ${role}`);
  }
}

function getProfileEndpoint(role: UserRole): string {
  switch (role) {
    case 'customer':
      return endpoints.customer.profile;
    case 'organizer':
      return endpoints.organizer.profile;
    case 'admin':
      return endpoints.admin.profile;
    case 'scan-point':
      return endpoints.scan.profile;
    default:
      throw new Error(`Invalid user role: ${role}`);
  }
}

function getChangePasswordEndpoint(role: UserRole): string {
  switch (role) {
    case 'customer':
      return endpoints.customer.changePassword;
    case 'organizer':
      return endpoints.organizer.changePassword;
    case 'admin':
      return endpoints.admin.changePassword;
    case 'scan-point':
      return endpoints.scan.updateProfile; // Assuming scan points use update profile
    default:
      throw new Error(`Invalid user role: ${role}`);
  }
}

function getRedirectPath(role: UserRole): string {
  switch (role) {
    case 'customer':
      return '/dashboard/customer';
    case 'organizer':
      return '/dashboard/organizer';
    case 'admin':
      return '/dashboard/admin';
    case 'scan-point':
      return '/dashboard/scan-point';
    default:
      return '/';
  }
}


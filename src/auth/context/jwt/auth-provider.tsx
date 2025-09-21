import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import axios, { endpoints } from 'src/lib/axios';

// ---- User & Context types ---------------------------------------------------

export type AuthUser = {
  id?: number | string;
  role?: 'customer' | 'organizer' | 'admin' | 'scan' | string;
  // Common profile fields used by the Minimal template:
  displayName?: string;
  email?: string;
  photoURL?: string;
  phoneNumber?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  about?: string;

  // In case your backend returns "name"
  name?: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  authenticated: boolean;

  // Actions used by your custom flows
  customerLogin: (email: string, password: string) => Promise<void>;
  customerRegister: (payload: { name?: string; displayName?: string; email: string; password: string; confirmPassword?: string }) => Promise<void>;

  organizerLogin: (email: string, password: string) => Promise<void>;
  organizerRegister: (payload: { name?: string; displayName?: string; email: string; password: string; confirmPassword?: string }) => Promise<void>;

  adminLogin: (email: string, password: string) => Promise<void>;

  scanPointLogin: (token: string) => Promise<void>;

  // Template expects this to exist (used in a few places)
  checkUserSession: () => Promise<void>;

  logout: () => Promise<void>;
};

// ---- Helpers ----------------------------------------------------------------

export const AuthContext = createContext<AuthContextValue>({} as any);

function setSession(token: string | null) {
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
}

async function fetchMe(url: string): Promise<AuthUser> {
  const res = await axios.get(url);
  const raw = res.data?.data ?? res.data;

  // Map common fields the UI uses
  const user: AuthUser = {
    id: raw?.id,
    role: raw?.role,
    displayName: raw?.displayName ?? raw?.name,
    email: raw?.email,
    photoURL: raw?.photoURL ?? raw?.avatarUrl ?? undefined,
    phoneNumber: raw?.phoneNumber,
    address: raw?.address,
    country: raw?.country,
    state: raw?.state,
    city: raw?.city,
    zipCode: raw?.zipCode,
    about: raw?.about,
    name: raw?.name,
  };
  return user;
}

// ---- Provider ---------------------------------------------------------------

export default function JwtAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Boot strap session on first load
  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUserSession = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setUser(null);
        return;
      }
  
      // Try each “me/profile” endpoint until one succeeds.
      // Order: customer → organizer → admin → scan
      const candidates = [
        { url: endpoints.customer.profile, role: 'customer' as const },
        { url: endpoints.organizer.profile, role: 'organizer' as const },
        { url: endpoints.admin.profile, role: 'admin' as const },
        { url: endpoints.scan.profile, role: 'scan' as const },
      ];
  
      let me: AuthUser | null = null;
  
      for (const c of candidates) {
        try {
          const u = await fetchMe(c.url);
          me = { ...u, role: c.role };
          break;
        } catch {
          // try next
        }
      }
  
      if (!me) {
        // token exists but invalid for all roles
        setSession(null);
        setUser(null);
        return;
      }
  
      setUser(me);
    } catch {
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);
  

  // ---------- Customer ----------
  const customerLogin = useCallback(async (email: string, password: string) => {
    const res = await axios.post(endpoints.customer.login, { email, password });
  
    // robust extraction across possible shapes
    const token =
      res?.data?.data?.token ??
      res?.data?.token ??
      res?.data?.accessToken ??
      null;
  
    if (!token) throw new Error('Token missing from login response');
  
    setSession(token);
  
    // You could read res.data.data.customer here,
    // but using /customer/profile keeps it consistent.
    const me = await fetchMe(endpoints.customer.profile);
    setUser({ ...me, role: 'customer' });
  }, []);
  

  const customerRegister = useCallback(async (payload: any) => {
    await axios.post(endpoints.customer.register, payload);
    // Optionally auto-login after register:
    // await customerLogin(payload.email, payload.password);
  }, [customerLogin]);

  // ---------- Organizer ----------
  const organizerLogin = useCallback(async (email: string, password: string) => {
    const res = await axios.post(endpoints.organizer.login, { email, password });
  
    const token =
      res?.data?.data?.token ??
      res?.data?.token ??
      res?.data?.accessToken ??
      null;
  
    if (!token) throw new Error('Token missing from login response');
  
    setSession(token);
    const me = await fetchMe(endpoints.organizer.profile);
    setUser({ ...me, role: 'organizer' });
  }, []);
  

  const organizerRegister = useCallback(async (payload: any) => {
    await axios.post(endpoints.organizer.register, payload);
  }, []);

  // ---------- Admin ----------
  const adminLogin = useCallback(async (email: string, password: string) => {
    const res = await axios.post(endpoints.admin.login, { email, password });
  
    const token =
      res?.data?.data?.token ??
      res?.data?.token ??
      res?.data?.accessToken ??
      null;
  
    if (!token) throw new Error('Token missing from login response');
  
    setSession(token);
    const me = await fetchMe(endpoints.admin.profile);
    setUser({ ...me, role: 'admin' });
  }, []);
  

  // ---------- Scan Point ----------
  const scanPointLogin = useCallback(async (deviceToken: string) => {
    const res = await axios.post(endpoints.scan.login, { token: deviceToken });
  
    const token =
      res?.data?.data?.token ??
      res?.data?.token ??
      res?.data?.accessToken ??
      null;
  
    if (!token) throw new Error('Token missing from login response');
  
    setSession(token);
    const me = await fetchMe(endpoints.scan.profile);
    setUser({ ...me, role: 'scan' });
  }, []);
  

  const logout = useCallback(async () => {
    try {
      // Optional: call role-specific logout; ignore failures
      await axios.post(endpoints.customer.logout).catch(() => {});
      await axios.post(endpoints.organizer.logout).catch(() => {});
      await axios.post(endpoints.admin.logout).catch(() => {});
      await axios.post(endpoints.scan.logout).catch(() => {});
    } finally {
      setSession(null);
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    authenticated: !!user,

    customerLogin,
    customerRegister,

    organizerLogin,
    organizerRegister,

    adminLogin,

    scanPointLogin,

    checkUserSession,

    logout,
  }), [
    user, loading,
    customerLogin, customerRegister,
    organizerLogin, organizerRegister,
    adminLogin,
    scanPointLogin,
    checkUserSession,
    logout,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

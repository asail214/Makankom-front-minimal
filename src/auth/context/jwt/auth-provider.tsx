'use client';

import type { AuthState } from '../../types';

import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints } from 'src/lib/axios';

import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';

// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer authentication can be easily replaced with your own authentication service.
 */

enum ActionType {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Action =
  | { type: ActionType.INITIAL; payload: { user: AuthState['user'] } }
  | { type: ActionType.LOGIN; payload: { user: AuthState['user'] } }
  | { type: ActionType.REGISTER; payload: { user: AuthState['user'] } }
  | { type: ActionType.LOGOUT };

const initialState: AuthState = {
  user: null,
  loading: true,
};

const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case ActionType.INITIAL:
      return { loading: false, user: action.payload.user };
    case ActionType.LOGIN:
    case ActionType.REGISTER:
      return { loading: false, user: action.payload.user };
    case ActionType.LOGOUT:
      return { loading: false, user: null };
    default:
      return state;
  }
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Customer auth methods
  const customerLogin = useCallback(async (email: string, password: string) => {
    const response = await axios.post(endpoints.customer.login, { email, password });

    const { token, customer } = response.data;

    setSession(token);

    dispatch({
      type: ActionType.LOGIN,
      payload: { user: { ...customer, role: 'customer' } },
    });

    return response.data;
  }, []);

  const customerRegister = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const response = await axios.post(endpoints.customer.register, {
        email,
        password,
        password_confirmation: password,
        first_name: firstName,
        last_name: lastName,
      });

      const { token, customer } = response.data;

      setSession(token);

      dispatch({
        type: ActionType.REGISTER,
        payload: { user: { ...customer, role: 'customer' } },
      });

      return response.data;
    },
    []
  );

  // Organizer auth methods
  const organizerLogin = useCallback(async (email: string, password: string) => {
    const response = await axios.post(endpoints.organizer.login, { email, password });

    const { token, organizer } = response.data;

    setSession(token);

    dispatch({
      type: ActionType.LOGIN,
      payload: { user: { ...organizer, role: 'organizer' } },
    });

    return response.data;
  }, []);

  const organizerRegister = useCallback(async (data: any) => {
    const response = await axios.post(endpoints.organizer.register, data);

    const { token, organizer } = response.data;

    if (token) {
      setSession(token);
    }

    dispatch({
      type: ActionType.REGISTER,
      payload: { user: { ...organizer, role: 'organizer' } },
    });

    return response.data;
  }, []);

  // Admin auth methods
  const adminLogin = useCallback(async (email: string, password: string) => {
    const response = await axios.post(endpoints.admin.login, { email, password });

    const { token, admin } = response.data;

    setSession(token);

    dispatch({
      type: ActionType.LOGIN,
      payload: { user: { ...admin, role: 'admin' } },
    });

    return response.data;
  }, []);

  // Scan Point auth methods
  const scanPointLogin = useCallback(async (token: string) => {
    const response = await axios.post(endpoints.scan.login, { token });

    const { token: authToken, scan_point } = response.data;

    setSession(authToken);

    dispatch({
      type: ActionType.LOGIN,
      payload: { user: { ...scan_point, role: 'scan_point' } },
    });

    return response.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      const currentUser = state.user;

      // Call appropriate logout endpoint based on user role
      if (currentUser?.role === 'customer') {
        await axios.post(endpoints.customer.logout);
      } else if (currentUser?.role === 'organizer') {
        await axios.post(endpoints.organizer.logout);
      } else if (currentUser?.role === 'admin') {
        await axios.post(endpoints.admin.logout);
      } else if (currentUser?.role === 'scan_point') {
        await axios.post(endpoints.scan.logout);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setSession(null);
      dispatch({ type: ActionType.LOGOUT });
    }
  }, [state.user]);

  // Check user session on mount
  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        // Try to get user profile (try customer first, then organizer, then admin)
        let response;
        try {
          response = await axios.get(endpoints.customer.profile);
          dispatch({
            type: ActionType.INITIAL,
            payload: { user: { ...response.data, role: 'customer' } },
          });
        } catch {
          try {
            response = await axios.get(endpoints.organizer.profile);
            dispatch({
              type: ActionType.INITIAL,
              payload: { user: { ...response.data, role: 'organizer' } },
            });
          } catch {
            try {
              response = await axios.get(endpoints.admin.profile);
              dispatch({
                type: ActionType.INITIAL,
                payload: { user: { ...response.data, role: 'admin' } },
              });
            } catch {
              try {
                response = await axios.get(endpoints.scan.profile);
                dispatch({
                  type: ActionType.INITIAL,
                  payload: { user: { ...response.data, role: 'scan_point' } },
                });
              } catch {
                setSession(null);
                dispatch({
                  type: ActionType.INITIAL,
                  payload: { user: null },
                });
              }
            }
          }
        }
      } else {
        dispatch({
          type: ActionType.INITIAL,
          payload: { user: null },
        });
      }
    } catch (error) {
      console.error('Check user session error:', error);
      setSession(null);
      dispatch({
        type: ActionType.INITIAL,
        payload: { user: null },
      });
    }
  }, []);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      customerLogin,
      customerRegister,
      organizerLogin,
      organizerRegister,
      adminLogin,
      scanPointLogin,
      logout,
    }),
    [
      checkUserSession,
      state.user,
      status,
      //
      customerLogin,
      customerRegister,
      organizerLogin,
      organizerRegister,
      adminLogin,
      scanPointLogin,
      logout,
    ]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

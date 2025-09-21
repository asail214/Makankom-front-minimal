import { useContext } from 'react';
import { AuthContext } from 'src/auth/context/auth-context';
import type { AuthContextValue } from 'src/auth/types';

// Real auth hook used across the app
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

/**
 * Some Minimal UI demo components import this for a fake user.
 * We type it so `user?.displayName`, `user?.email`, etc, compile cleanly.
 */
export function useMockedUser(): { user: any | null } {
  return {
    user: null,
  };
}

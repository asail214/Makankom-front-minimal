// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export type JwtPayload = {
  sub?: string;
  iat?: number;
  exp?: number;
};

// ----------------------------------------------------------------------

export function jwtDecode(token: string): JwtPayload | null {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));

    return decoded;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}

// ----------------------------------------------------------------------

export function isValidToken(token: string): boolean {
  if (!token) return false;

  const decoded = jwtDecode(token);
  if (!decoded || !decoded.exp) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp > currentTime;
}

// ----------------------------------------------------------------------

export function tokenExpired(exp: number): boolean {
  const currentTime = Math.floor(Date.now() / 1000);
  return exp < currentTime;
}

// ----------------------------------------------------------------------

export function setSession(accessToken: string | null): void {
  if (accessToken) {
    localStorage.setItem(STORAGE_KEY, accessToken);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

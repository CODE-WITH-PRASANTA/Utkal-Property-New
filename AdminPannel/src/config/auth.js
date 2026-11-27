export const AUTH_TOKEN_KEY = 'adminAuthToken';
export const AUTH_USER_KEY = 'adminAuthUser';
const LEGACY_AUTH_KEY = 'isAdminAuthenticated';

export const getAuthToken = () => {
  return (
    sessionStorage.getItem(AUTH_TOKEN_KEY) ||
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    ''
  );
};

export const getAuthUser = () => {
  const raw =
    sessionStorage.getItem(AUTH_USER_KEY) ||
    localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setAuthSession = (token, user, rememberMe = true) => {
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  if (user) {
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }

  if (rememberMe) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    }
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }
};

export const clearAuthSession = () => {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
  sessionStorage.removeItem(LEGACY_AUTH_KEY);

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(LEGACY_AUTH_KEY);
};

export const isJwtExpired = (token) => {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

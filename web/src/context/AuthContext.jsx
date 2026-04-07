import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { clearStoredAuth, getStoredAuth, storeAuth } from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => getStoredAuth());

  useEffect(() => {
    if (authState?.token) {
      storeAuth(authState);
    } else {
      clearStoredAuth();
    }
  }, [authState]);

  const value = useMemo(
    () => ({
      token: authState?.token || null,
      user: authState?.user || null,
      patientId: authState?.patientId || null,
      isAuthenticated: Boolean(authState?.token),
      login: ({ token, user, patientId }) => setAuthState({ token, user, patientId }),
      logout: () => setAuthState(null),
    }),
    [authState],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

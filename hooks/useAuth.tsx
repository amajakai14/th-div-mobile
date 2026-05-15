import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
  token: string | null | undefined; // undefined = still loading from SecureStore
  userId: string | null;
  signIn: (jwt: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function decodeUserId(jwt: string): string {
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    return String(payload.userId ?? payload.sub ?? 'unknown');
  } catch {
    return 'unknown';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync('jwt').then((t) => {
      setToken(t);
      setUserId(t ? decodeUserId(t) : null);
    });
  }, []);

  async function signIn(jwt: string) {
    await SecureStore.setItemAsync('jwt', jwt);
    setToken(jwt);
    setUserId(decodeUserId(jwt));
  }

  async function signOut() {
    await SecureStore.deleteItemAsync('jwt');
    setToken(null);
    setUserId(null);
  }

  return (
    <AuthContext.Provider value={{ token, userId, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

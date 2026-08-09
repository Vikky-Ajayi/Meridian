import { createContext, useContext, useState, ReactNode } from 'react';
interface AuthUser {
  name: string;
  email: string;
}

export type AuthModal =
  | 'none'
  | 'register'
  | 'login'
  | 'otp'
  | 'forgot'
  | 'setnew'
  | 'resetSuccess'
  | 'success';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  modal: AuthModal;
  openModal: (m: AuthModal) => void;
  closeModal: () => void;
  login: () => void;
  logout: () => void;
  pendingEmail: string;
  setPendingEmail: (e: string) => void;
  setPendingUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const storedUser = typeof window !== 'undefined' ? window.localStorage.getItem('aldricUser') : null;
  let initialUser: AuthUser | null = null;
  try {
    initialUser = storedUser ? JSON.parse(storedUser) as AuthUser : null;
  } catch {
    initialUser = null;
  }
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(initialUser));
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [modal, setModal] = useState<AuthModal>('none');
  const [pendingEmail, setPendingEmail] = useState('');

  const login = () => {
    setIsAuthenticated(true);
    setModal('none');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    window.localStorage.removeItem('aldricUser');
  };

  const setPendingUser = (nextUser: AuthUser) => {
    setUser(nextUser);
    window.localStorage.setItem('aldricUser', JSON.stringify(nextUser));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user: isAuthenticated ? user : null,
        modal,
        openModal: setModal,
        closeModal: () => setModal('none'),
        login,
        logout,
        pendingEmail,
        setPendingEmail,
        setPendingUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

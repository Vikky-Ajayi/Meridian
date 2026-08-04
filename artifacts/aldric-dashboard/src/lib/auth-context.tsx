import { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_USER } from './mock-data';

export type AuthModal =
  | 'none'
  | 'register'
  | 'login'
  | 'otp'
  | 'forgot'
  | 'setnew'
  | 'success';

interface AuthContextType {
  isAuthenticated: boolean;
  user: typeof MOCK_USER | null;
  modal: AuthModal;
  openModal: (m: AuthModal) => void;
  closeModal: () => void;
  login: () => void;
  logout: () => void;
  pendingEmail: string;
  setPendingEmail: (e: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [modal, setModal] = useState<AuthModal>('none');
  const [pendingEmail, setPendingEmail] = useState('');

  const login = () => {
    setIsAuthenticated(true);
    setModal('none');
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user: isAuthenticated ? MOCK_USER : null,
        modal,
        openModal: setModal,
        closeModal: () => setModal('none'),
        login,
        logout,
        pendingEmail,
        setPendingEmail,
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

// src/features/auth/AuthProvider.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Outlet } from 'react-router-dom';
import type { User } from "./types";

interface AuthContextType {
  login: (access_token: string, refresh_token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const decoded = jwtDecode<any>(token);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          logout();
          return;
        }

        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        }
      } catch {
        logout();
      }
    };

    checkAuth();
  }, []);

  const login = (access_token: string, refresh_token: string, userData: User) => {
    localStorage.setItem('auth_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated, user }}>
      <Outlet />
    </AuthContext.Provider>
  );
}

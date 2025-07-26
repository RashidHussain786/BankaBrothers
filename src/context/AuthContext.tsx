import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  token: string | null;
  user: { id: number; username: string; role: string } | null;
  login: (token: string, user: { id: number; username: string; role: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  const isAuthenticated = !!token && !!user;
  const isAdmin = isAuthenticated && user?.role === 'admin';

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const login = (newToken: string, newUser: { id: number; username: string; role: string }) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const contextValue: AuthContextType = {
    token,
    user,
    login,
    logout,
    isAuthenticated,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  userId: string | null;
  email: string | null;
  name: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (userId: string, email: string, name: string) => void;
  logout: () => void; // Define the logout function in the context type
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userId: string, email: string, name: string) => {
    setUser({ userId, email, name });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

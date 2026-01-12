'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SavedReport } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  saveReport: (report: Omit<SavedReport, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  getSavedReports: () => SavedReport[];
  deleteReport: (reportId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Załaduj użytkownika z localStorage przy starcie
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Błąd parsowania danych użytkownika:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Sprawdź czy użytkownik istnieje w localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Nieprawidłowy email lub hasło');
      }

      const userWithoutPassword = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        createdAt: foundUser.createdAt,
        isPremium: foundUser.isPremium || false,
      };

      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Pobierz istniejących użytkowników
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Sprawdź czy email już istnieje
      if (users.some((u: any) => u.email === email)) {
        throw new Error('Użytkownik z tym adresem email już istnieje');
      }

      // Utwórz nowego użytkownika
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password, // W produkcji powinno być hashowane!
        name,
        createdAt: new Date().toISOString(),
        isPremium: false,
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Zaloguj użytkownika
      const userWithoutPassword = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: new Date(newUser.createdAt),
        isPremium: newUser.isPremium,
      };

      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const saveReport = async (report: Omit<SavedReport, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) {
      throw new Error('Musisz być zalogowany, aby zapisać raport');
    }

    const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
    
    const newReport: SavedReport = {
      id: `report_${Date.now()}`,
      userId: user.id,
      createdAt: new Date(),
      ...report,
    };

    savedReports.push(newReport);
    localStorage.setItem('savedReports', JSON.stringify(savedReports));
  };

  const getSavedReports = (): SavedReport[] => {
    if (!user) return [];

    const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
    return savedReports
      .filter((r: SavedReport) => r.userId === user.id)
      .map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt),
      }))
      .sort((a: SavedReport, b: SavedReport) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  const deleteReport = (reportId: string) => {
    const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
    const filtered = savedReports.filter((r: SavedReport) => r.id !== reportId);
    localStorage.setItem('savedReports', JSON.stringify(filtered));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        saveReport,
        getSavedReports,
        deleteReport,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth musi być używany wewnątrz AuthProvider');
  }
  return context;
}

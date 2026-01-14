'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SavedReport } from '../types';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  saveReport: (report: Omit<SavedReport, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  getSavedReports: () => Promise<SavedReport[]>;
  deleteReport: (reportId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Obserwuj stan autentykacji Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Użytkownik zalogowany - pobierz dane z Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              name: userData.name || '',
              createdAt: userData.createdAt?.toDate() || new Date(),
              isPremium: userData.isPremium || false,
            });
          }
        } catch (error) {
          console.error('Błąd pobierania danych użytkownika:', error);
        }
      } else {
        // Użytkownik wylogowany
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Dane użytkownika zostaną załadowane przez onAuthStateChanged
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          id: userCredential.user.uid,
          email: userCredential.user.email!,
          name: userData.name || '',
          createdAt: userData.createdAt?.toDate() || new Date(),
          isPremium: userData.isPremium || false,
        });
      }
    } catch (error: any) {
      console.error('Błąd logowania:', error);
      throw new Error(error.code === 'auth/invalid-credential' 
        ? 'Nieprawidłowy email lub hasło' 
        : 'Błąd logowania. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Utwórz konto w Firebase Auth (hasła są automatycznie hashowane!)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Zapisz dodatkowe dane w Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        createdAt: serverTimestamp(),
        isPremium: false,
      });

      // Ustaw dane użytkownika w state
      setUser({
        id: userCredential.user.uid,
        email: userCredential.user.email!,
        name,
        createdAt: new Date(),
        isPremium: false,
      });
    } catch (error: any) {
      console.error('Błąd rejestracji:', error);
      throw new Error(error.code === 'auth/email-already-in-use' 
        ? 'Użytkownik z tym adresem email już istnieje' 
        : 'Błąd rejestracji. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const saveReport = async (report: Omit<SavedReport, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) {
      throw new Error('Musisz być zalogowany, aby zapisać raport');
    }

    try {
      console.log('Zapisywanie raportu...', { userId: user.id });
      
      // Serializuj dane przed zapisem (konwertuj Date na timestamp)
      const reportData = {
        userId: user.id,
        createdAt: serverTimestamp(),
        name: report.name || `Raport z ${new Date().toLocaleDateString('pl-PL')}`,
        formData: JSON.parse(JSON.stringify(report.formData)), // Deep copy + serializacja
        requirements: JSON.parse(JSON.stringify(report.requirements)), // Deep copy + serializacja
      };

      console.log('Dane do zapisu:', reportData);
      
      const docRef = await addDoc(collection(db, 'reports'), reportData);
      
      console.log('Raport zapisany z ID:', docRef.id);
    } catch (error: any) {
      console.error('Szczegółowy błąd zapisywania raportu:', {
        code: error.code,
        message: error.message,
        error: error
      });
      throw new Error(`Nie udało się zapisać raportu: ${error.message}`);
    }
  };

  const getSavedReports = async (): Promise<SavedReport[]> => {
    if (!user) return [];

    try {
      const q = query(
        collection(db, 'reports'), 
        where('userId', '==', user.id)
      );
      const querySnapshot = await getDocs(q);
      
      const reports: SavedReport[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reports.push({
          id: doc.id,
          userId: data.userId,
          createdAt: data.createdAt?.toDate() || new Date(),
          requirements: data.requirements,
          formData: data.formData,
          name: data.name,
        });
      });

      return reports.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Błąd pobierania raportów:', error);
      return [];
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      await deleteDoc(doc(db, 'reports', reportId));
    } catch (error) {
      console.error('Błąd usuwania raportu:', error);
      throw new Error('Nie udało się usunąć raportu');
    }
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

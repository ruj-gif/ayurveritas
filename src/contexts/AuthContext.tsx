import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'farmer' | 'distributor' | 'consumer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  verified?: boolean;
  badges?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Raj Kumar',
    email: 'farmer@ayur.com',
    role: 'farmer',
    phone: '+91 98765 43210',
    verified: true,
    badges: ['Verified Farmer', 'Consistent Supplier', 'Organic Certified']
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'distributor@ayur.com',
    role: 'distributor',
    phone: '+91 87654 32109',
    verified: true,
    badges: ['Certified Distributor', 'Quality Assured']
  },
  {
    id: '3',
    name: 'Amit Singh',
    email: 'consumer@ayur.com',
    role: 'consumer',
    phone: '+91 76543 21098',
    verified: true
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on app load
    const storedUser = localStorage.getItem('ayur-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      localStorage.setItem('ayur-user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ayur-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
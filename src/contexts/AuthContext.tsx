
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Define the User type
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
};

// Define the Auth context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (provider: 'google' | 'github') => void;
  logout: () => void;
};

// Create the Auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
type AuthProviderProps = {
  children: ReactNode;
};

// Create the Auth provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock authentication for demo purposes
  // In a real app, you would use an authentication service
  useEffect(() => {
    const storedUser = localStorage.getItem('devops-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('devops-user');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function
  const login = (provider: 'google' | 'github') => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Create mock user data
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: provider === 'google' ? 'Google User' : 'GitHub User',
        email: `user_${Math.floor(Math.random() * 1000)}@example.com`,
        avatar: `https://avatars.dicebear.com/api/initials/${provider === 'google' ? 'GU' : 'GH'}.svg`,
        isAdmin: false, // Default to regular user
      };
      
      setUser(mockUser);
      localStorage.setItem('devops-user', JSON.stringify(mockUser));
      setIsLoading(false);
      
      toast({
        title: "Successfully logged in",
        description: `Welcome, ${mockUser.name}!`,
      });
      
      navigate('/credentials');
    }, 1500);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('devops-user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

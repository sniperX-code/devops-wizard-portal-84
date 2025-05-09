
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
  loginWithEmail: (email: string, password: string) => Promise<boolean>; // Added email login
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

  // Email login/signup function
  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Check if user exists in localStorage (mock database)
    const usersString = localStorage.getItem('devops-users');
    const users = usersString ? JSON.parse(usersString) : {};
    
    return new Promise((resolve) => {
      setTimeout(() => {
        let currentUser;
        let isNewUser = false;
        
        // If user exists, check password
        if (users[email]) {
          // In a real app, you would hash and compare passwords
          if (users[email].password === password) {
            currentUser = users[email].user;
          } else {
            toast({
              title: "Login failed",
              description: "Incorrect password. Please try again.",
              variant: "destructive",
            });
            setIsLoading(false);
            resolve(false);
            return;
          }
        } else {
          // User doesn't exist, create a new account
          isNewUser = true;
          const name = email.split('@')[0];
          currentUser = {
            id: Math.random().toString(36).substring(2, 9),
            name: name.charAt(0).toUpperCase() + name.slice(1),
            email: email,
            avatar: `https://avatars.dicebear.com/api/initials/${name.substring(0, 2).toUpperCase()}.svg`,
            isAdmin: false,
          };
          
          // Store user in "database"
          users[email] = {
            password: password,
            user: currentUser
          };
          localStorage.setItem('devops-users', JSON.stringify(users));
        }
        
        // Set user in state and localStorage
        setUser(currentUser);
        localStorage.setItem('devops-user', JSON.stringify(currentUser));
        
        toast({
          title: isNewUser ? "Account created successfully" : "Login successful",
          description: `Welcome${isNewUser ? ' to DevOpsWizard' : ''}, ${currentUser.name}!`,
        });
        
        setIsLoading(false);
        navigate('/credentials');
        resolve(true);
      }, 1500);
    });
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
      loginWithEmail,
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

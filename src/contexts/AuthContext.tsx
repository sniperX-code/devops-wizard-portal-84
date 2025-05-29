
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TokenManager } from '@/config/api';
import { UserService } from '@/services/userService';

// Define the User type
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
};

type ProfileUpdateData = {
  name?: string;
  email?: string;
  password?: string;
};

// Define the Auth context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (provider: 'google' | 'github') => void;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (data: ProfileUpdateData) => boolean;
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

  // Bootstrap authentication on app start
  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = TokenManager.getToken();
      if (token) {
        try {
          const response = await UserService.getUserDetails();
          const userData: User = {
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            avatar: response.user.avatar,
            isAdmin: response.user.isAdmin || false,
          };
          setUser(userData);
        } catch (error) {
          console.error('Failed to bootstrap auth:', error);
          // If token is invalid, remove it
          TokenManager.removeToken();
        }
      }
      setIsLoading(false);
    };

    bootstrapAuth();
  }, []);

  // Mock login function - in production, this would use the AuthService
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
        isAdmin: false,
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

  // Email login/signup function - in production, this would use the AuthService
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

  // Update user profile
  const updateUserProfile = (data: ProfileUpdateData): boolean => {
    if (!user) return false;
    
    try {
      const usersString = localStorage.getItem('devops-users');
      const users = usersString ? JSON.parse(usersString) : {};
      
      const updatedUser = { ...user };
      
      if (data.name) updatedUser.name = data.name;
      if (data.email && data.email !== user.email) {
        if (users[data.email] && users[data.email].user.id !== user.id) {
          toast({
            title: "Email already in use",
            description: "Please choose a different email address.",
            variant: "destructive",
          });
          return false;
        }
        
        const userEntry = users[user.email];
        delete users[user.email];
        users[data.email] = userEntry;
        updatedUser.email = data.email;
      }
      
      if (data.password && user.email) {
        users[user.email || data.email || ''].password = data.password;
      }
      
      if (updatedUser.email) {
        users[updatedUser.email].user = updatedUser;
      }
      
      localStorage.setItem('devops-users', JSON.stringify(users));
      localStorage.setItem('devops-user', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    TokenManager.removeToken();
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
      logout,
      updateUserProfile
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

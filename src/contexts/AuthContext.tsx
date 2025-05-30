import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TokenManager } from '@/config/api';
import { UserService } from '@/services/userService';
import { AuthService } from '@/services/authService';

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
            name: `${response.user.firstName} ${response.user.lastName}`.trim(),
            email: response.user.email,
            isAdmin: false,
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

  // Real login function for OAuth
  const login = (provider: 'google' | 'github') => {
    // Redirect to backend OAuth endpoint
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://your-api-base-url.com/api';
    window.location.href = `${baseUrl}/auth/${provider}`;
  };

  // Handle OAuth callback (parse token from URL)
  useEffect(() => {
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get('accessToken');
    if (accessToken) {
      TokenManager.setToken(accessToken);
      // Remove token from URL
      url.searchParams.delete('accessToken');
      window.history.replaceState({}, document.title, url.pathname);
      // Fetch user details
      UserService.getUserDetails().then((response) => {
        const userData: User = {
          id: response.user.id,
          name: `${response.user.firstName} ${response.user.lastName}`.trim(),
          email: response.user.email,
          isAdmin: false,
        };
        setUser(userData);
        navigate('/credentials');
        toast({
          title: 'Login successful',
          description: `Welcome, ${userData.name}!`,
        });
      }).catch(() => {
        TokenManager.removeToken();
      });
    }
  }, [navigate, toast]);

  // Email login/signup function - in production, this would use the AuthService
  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await AuthService.signIn({ email, password });
      TokenManager.setToken(response.accessToken);
      // Fetch user details as in OAuth
      const userResponse = await UserService.getUserDetails();
      const userData: User = {
        id: userResponse.user.id,
        name: `${userResponse.user.firstName} ${userResponse.user.lastName}`.trim(),
        email: userResponse.user.email,
        isAdmin: false,
      };
      setUser(userData);
      toast({
        title: "Login successful",
        description: `Welcome, ${userData.name}!`,
      });
      setIsLoading(false);
      navigate('/credentials');
      return true;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
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

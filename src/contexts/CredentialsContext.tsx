
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Define the credentials type
export type Credentials = {
  webhookProxyUrl: string;
  appId: string;
  webhookSecret: string;
  privateKey: string;
  githubClientId: string;
  githubClientSecret: string;
  submitted: boolean;
};

// Define initial empty credentials
const initialCredentials: Credentials = {
  webhookProxyUrl: '',
  appId: '',
  webhookSecret: '',
  privateKey: '',
  githubClientId: '',
  githubClientSecret: '',
  submitted: false
};

// Define the credentials context type
type CredentialsContextType = {
  credentials: Credentials;
  updateCredentials: (field: keyof Credentials, value: string) => void;
  submitCredentials: () => void;
  resetCredentials: () => void;
  isSubmitted: boolean;
};

// Create the credentials context
const CredentialsContext = createContext<CredentialsContextType | undefined>(undefined);

// Credentials provider props
type CredentialsProviderProps = {
  children: ReactNode;
};

// Create the credentials provider
export const CredentialsProvider: React.FC<CredentialsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<Credentials>(initialCredentials);

  // Load credentials from localStorage on component mount
  useEffect(() => {
    if (user) {
      const storedCredentials = localStorage.getItem(`devops-credentials-${user.id}`);
      if (storedCredentials) {
        try {
          setCredentials(JSON.parse(storedCredentials));
        } catch (error) {
          console.error('Error parsing stored credentials:', error);
          localStorage.removeItem(`devops-credentials-${user.id}`);
        }
      }
    }
  }, [user]);

  // Update credentials
  const updateCredentials = (field: keyof Credentials, value: string) => {
    setCredentials(prev => {
      const updated = { ...prev, [field]: value };
      if (user) {
        localStorage.setItem(`devops-credentials-${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Submit credentials
  const submitCredentials = () => {
    setCredentials(prev => {
      const updated = { ...prev, submitted: true };
      if (user) {
        localStorage.setItem(`devops-credentials-${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Reset credentials
  const resetCredentials = () => {
    setCredentials(initialCredentials);
    if (user) {
      localStorage.removeItem(`devops-credentials-${user.id}`);
    }
  };

  return (
    <CredentialsContext.Provider value={{
      credentials,
      updateCredentials,
      submitCredentials,
      resetCredentials,
      isSubmitted: credentials.submitted
    }}>
      {children}
    </CredentialsContext.Provider>
  );
};

// Custom hook to use the credentials context
export const useCredentials = () => {
  const context = useContext(CredentialsContext);
  if (context === undefined) {
    throw new Error('useCredentials must be used within a CredentialsProvider');
  }
  return context;
};


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

// Define the instance type
export type InstanceStatus = 'creating' | 'running' | 'stopped' | 'error';

export type Instance = {
  id: string;
  name: string;
  status: InstanceStatus;
  createdAt: string;
  lastUpdated: string;
  cpu: number;
  memory: number;
  storage: number;
  plan: 'free' | 'pro' | 'enterprise';
};

// Define the instance context type
type InstanceContextType = {
  instance: Instance | null;
  isLoading: boolean;
  error: string | null;
  createInstance: (name: string) => Promise<void>;
  startInstance: () => Promise<void>;
  stopInstance: () => Promise<void>;
  deleteInstance: () => Promise<void>;
  stats: {
    cpuUsage: number[];
    memoryUsage: number[];
    networkIn: number[];
    networkOut: number[];
  };
};

// Create the instance context
const InstanceContext = createContext<InstanceContextType | undefined>(undefined);

// Instance provider props
type InstanceProviderProps = {
  children: ReactNode;
};

// Create the instance provider
export const InstanceProvider: React.FC<InstanceProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [instance, setInstance] = useState<Instance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    cpuUsage: Array(24).fill(0).map(() => Math.random() * 80 + 5),
    memoryUsage: Array(24).fill(0).map(() => Math.random() * 60 + 20),
    networkIn: Array(24).fill(0).map(() => Math.random() * 50),
    networkOut: Array(24).fill(0).map(() => Math.random() * 30),
  });

  // Load instance from localStorage on component mount
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const storedInstance = localStorage.getItem(`devops-instance-${user.id}`);
      if (storedInstance) {
        try {
          setInstance(JSON.parse(storedInstance));
        } catch (error) {
          console.error('Error parsing stored instance:', error);
          localStorage.removeItem(`devops-instance-${user.id}`);
          setError('Failed to load instance data');
        }
      }
      setIsLoading(false);
    } else {
      setInstance(null);
    }
  }, [user]);

  // Mock function to create instance
  const createInstance = async (name: string) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (!user) {
          setError('User not authenticated');
          setIsLoading(false);
          return;
        }
        
        // Create mock instance
        const newInstance: Instance = {
          id: Math.random().toString(36).substring(2, 9),
          name,
          status: 'creating',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          cpu: 2,
          memory: 4,
          storage: 20,
          plan: 'free'
        };
        
        setInstance(newInstance);
        localStorage.setItem(`devops-instance-${user.id}`, JSON.stringify(newInstance));
        
        // Simulate instance creation
        setTimeout(() => {
          newInstance.status = 'running';
          newInstance.lastUpdated = new Date().toISOString();
          setInstance({ ...newInstance });
          localStorage.setItem(`devops-instance-${user.id}`, JSON.stringify(newInstance));
          
          toast({
            title: "Instance Created",
            description: `Your instance ${name} is now running!`,
          });
        }, 3000);
        
        setIsLoading(false);
        resolve();
      }, 1500);
    });
  };

  // Mock function to start instance
  const startInstance = async () => {
    if (!instance) {
      setError('No instance available');
      return Promise.reject('No instance available');
    }
    
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const updatedInstance = { 
          ...instance, 
          status: 'running', 
          lastUpdated: new Date().toISOString() 
        };
        setInstance(updatedInstance);
        if (user) {
          localStorage.setItem(`devops-instance-${user.id}`, JSON.stringify(updatedInstance));
        }
        setIsLoading(false);
        
        toast({
          title: "Instance Started",
          description: `Your instance ${instance.name} is now running!`,
        });
        
        resolve();
      }, 1500);
    });
  };

  // Mock function to stop instance
  const stopInstance = async () => {
    if (!instance) {
      setError('No instance available');
      return Promise.reject('No instance available');
    }
    
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const updatedInstance = { 
          ...instance, 
          status: 'stopped', 
          lastUpdated: new Date().toISOString() 
        };
        setInstance(updatedInstance);
        if (user) {
          localStorage.setItem(`devops-instance-${user.id}`, JSON.stringify(updatedInstance));
        }
        setIsLoading(false);
        
        toast({
          title: "Instance Stopped",
          description: `Your instance ${instance.name} has been stopped.`,
        });
        
        resolve();
      }, 1500);
    });
  };

  // Mock function to delete instance
  const deleteInstance = async () => {
    if (!instance) {
      setError('No instance available');
      return Promise.reject('No instance available');
    }
    
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setInstance(null);
        if (user) {
          localStorage.removeItem(`devops-instance-${user.id}`);
        }
        setIsLoading(false);
        
        toast({
          title: "Instance Deleted",
          description: `Your instance ${instance.name} has been deleted.`,
          variant: "destructive"
        });
        
        resolve();
      }, 1500);
    });
  };

  // Update instance stats periodically when running
  useEffect(() => {
    if (instance?.status === 'running') {
      const interval = setInterval(() => {
        setStats(prev => ({
          cpuUsage: [...prev.cpuUsage.slice(1), Math.random() * 80 + 5],
          memoryUsage: [...prev.memoryUsage.slice(1), Math.random() * 60 + 20],
          networkIn: [...prev.networkIn.slice(1), Math.random() * 50],
          networkOut: [...prev.networkOut.slice(1), Math.random() * 30],
        }));
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [instance?.status]);

  return (
    <InstanceContext.Provider value={{
      instance,
      isLoading,
      error,
      createInstance,
      startInstance,
      stopInstance,
      deleteInstance,
      stats
    }}>
      {children}
    </InstanceContext.Provider>
  );
};

// Custom hook to use the instance context
export const useInstance = () => {
  const context = useContext(InstanceContext);
  if (context === undefined) {
    throw new Error('useInstance must be used within an InstanceProvider');
  }
  return context;
};

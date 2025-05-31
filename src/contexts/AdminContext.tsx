
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Instance, InstanceStatus } from './InstanceContext';

// Extended instance type with user information
export interface AdminInstance extends Instance {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Define the admin context type
type AdminContextType = {
  allInstances: AdminInstance[];
  isLoading: boolean;
  error: string | null;
  startInstance: (instanceId: string) => Promise<void>;
  stopInstance: (instanceId: string) => Promise<void>;
  deleteInstance: (instanceId: string) => Promise<void>;
  getInstanceDetails: (instanceId: string) => AdminInstance | null;
  getSystemStatus: () => {
    totalInstances: number;
    runningInstances: number;
    stoppedInstances: number;
    errorInstances: number;
    totalCpuUsage: number;
    totalMemoryUsage: number;
  };
};

// Create the admin context
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Admin provider props
type AdminProviderProps = {
  children: ReactNode;
};

// Generate a random instance with user data for mock data
const generateRandomInstance = (id: number): AdminInstance => {
  const statuses: InstanceStatus[] = ['running', 'stopped', 'error'];
  const plans = ['free', 'pro', 'enterprise'];
  const users = [
    { id: 'usr_1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    { id: 'usr_2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
    { id: 'usr_3', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com' },
    { id: 'usr_4', firstName: 'Alice', lastName: 'Brown', email: 'alice@example.com' },
    { id: 'usr_5', firstName: 'Charlie', lastName: 'Davis', email: 'charlie@example.com' },
  ];
  
  const randomIndex = Math.floor(Math.random() * statuses.length);
  const randomPlanIndex = Math.floor(Math.random() * plans.length);
  const randomUserIndex = Math.floor(Math.random() * users.length);
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
  
  return {
    id: `inst-${id}`,
    name: `instance-${id}`,
    status: statuses[randomIndex],
    createdAt: createdDate.toISOString(),
    lastUpdated: new Date().toISOString(),
    cpu: Math.floor(Math.random() * 4) + 1,
    memory: (Math.floor(Math.random() * 8) + 1) * 2,
    storage: (Math.floor(Math.random() * 5) + 1) * 10,
    plan: plans[randomPlanIndex] as 'free' | 'pro' | 'enterprise',
    user: users[randomUserIndex]
  };
};

// Create the admin provider
export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [allInstances, setAllInstances] = useState<AdminInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load mock instances when component mounts
  useEffect(() => {
    if (user?.isAdmin) {
      setIsLoading(true);
      
      // Generate mock data
      const mockInstances: AdminInstance[] = Array(12)
        .fill(null)
        .map((_, index) => generateRandomInstance(index + 1));
      
      // Simulate API call
      setTimeout(() => {
        setAllInstances(mockInstances);
        setIsLoading(false);
      }, 1000);
    }
  }, [user]);

  // Start instance mock function
  const startInstance = async (instanceId: string) => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setAllInstances(prev => prev.map(inst => 
          inst.id === instanceId 
            ? { ...inst, status: 'running', lastUpdated: new Date().toISOString() } 
            : inst
        ));
        setIsLoading(false);
        resolve();
      }, 1500);
    });
  };

  // Stop instance mock function
  const stopInstance = async (instanceId: string) => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setAllInstances(prev => prev.map(inst => 
          inst.id === instanceId 
            ? { ...inst, status: 'stopped', lastUpdated: new Date().toISOString() } 
            : inst
        ));
        setIsLoading(false);
        resolve();
      }, 1500);
    });
  };

  // Delete instance mock function
  const deleteInstance = async (instanceId: string) => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setAllInstances(prev => prev.filter(inst => inst.id !== instanceId));
        setIsLoading(false);
        resolve();
      }, 1500);
    });
  };

  // Get instance details
  const getInstanceDetails = (instanceId: string): AdminInstance | null => {
    return allInstances.find(inst => inst.id === instanceId) || null;
  };

  // Get system status
  const getSystemStatus = () => {
    const runningInstances = allInstances.filter(inst => inst.status === 'running').length;
    const stoppedInstances = allInstances.filter(inst => inst.status === 'stopped').length;
    const errorInstances = allInstances.filter(inst => inst.status === 'error').length;
    
    const totalCpuUsage = Math.min(
      95, 
      allInstances
        .filter(inst => inst.status === 'running')
        .reduce((acc, inst) => acc + (inst.cpu * (Math.random() * 30 + 30)), 0)
    );
    
    const totalMemoryUsage = Math.min(
      90, 
      allInstances
        .filter(inst => inst.status === 'running')
        .reduce((acc, inst) => acc + (inst.memory * (Math.random() * 10 + 40)), 0)
    );
    
    return {
      totalInstances: allInstances.length,
      runningInstances,
      stoppedInstances,
      errorInstances,
      totalCpuUsage,
      totalMemoryUsage
    };
  };

  return (
    <AdminContext.Provider value={{
      allInstances,
      isLoading,
      error,
      startInstance,
      stopInstance,
      deleteInstance,
      getInstanceDetails,
      getSystemStatus
    }}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook to use the admin context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

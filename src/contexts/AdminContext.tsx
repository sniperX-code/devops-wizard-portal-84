
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Instance, InstanceStatus } from './InstanceContext';

// Define the admin context type
type AdminContextType = {
  allInstances: Instance[];
  isLoading: boolean;
  error: string | null;
  startInstance: (instanceId: string) => Promise<void>;
  stopInstance: (instanceId: string) => Promise<void>;
  deleteInstance: (instanceId: string) => Promise<void>;
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

// Generate a random instance for mock data
const generateRandomInstance = (id: number): Instance => {
  const statuses: InstanceStatus[] = ['running', 'stopped', 'error'];
  const plans = ['free', 'pro', 'enterprise'];
  const randomIndex = Math.floor(Math.random() * statuses.length);
  const randomPlanIndex = Math.floor(Math.random() * plans.length);
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
    plan: plans[randomPlanIndex] as 'free' | 'pro' | 'enterprise'
  };
};

// Create the admin provider
export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [allInstances, setAllInstances] = useState<Instance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load mock instances when component mounts
  useEffect(() => {
    if (user?.isAdmin) {
      setIsLoading(true);
      
      // Generate mock data
      const mockInstances: Instance[] = Array(12)
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

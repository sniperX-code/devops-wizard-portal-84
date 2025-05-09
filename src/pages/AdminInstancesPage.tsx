
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAdmin } from '@/contexts/AdminContext';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminInstancesPage: React.FC = () => {
  const { allInstances, isLoading, startInstance, stopInstance, deleteInstance } = useAdmin();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [instanceToDelete, setInstanceToDelete] = useState<string | null>(null);

  // Handle instance start
  const handleStartInstance = async (instanceId: string) => {
    try {
      await startInstance(instanceId);
      toast({
        title: "Instance Started",
        description: "The instance has been started successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start the instance. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle instance stop
  const handleStopInstance = async (instanceId: string) => {
    try {
      await stopInstance(instanceId);
      toast({
        title: "Instance Stopped",
        description: "The instance has been stopped successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop the instance. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle instance delete
  const handleDeleteInstance = async () => {
    if (!instanceToDelete) return;
    
    try {
      await deleteInstance(instanceToDelete);
      setInstanceToDelete(null);
      toast({
        title: "Instance Deleted",
        description: "The instance has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the instance. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Filter instances based on search term and filters
  const filteredInstances = allInstances.filter(instance => {
    const matchesSearch = 
      instance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || instance.status === statusFilter;
    const matchesPlan = planFilter === 'all' || instance.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center h-full">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-t-2 border-primary rounded-full animate-spin mb-4"></div>
            <p className="text-lg">Loading instances...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">All Instances</h1>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <Input
              placeholder="Search by name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="stopped">Stopped</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="creating">Creating</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Plan: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Instances Table */}
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium">ID</th>
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Plan</th>
                  <th className="text-left py-3 px-4 font-medium">Resources</th>
                  <th className="text-left py-3 px-4 font-medium">Created</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstances.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground">
                      No instances found matching your filters
                    </td>
                  </tr>
                ) : (
                  filteredInstances.map((instance) => (
                    <tr key={instance.id} className="border-t">
                      <td className="py-3 px-4 text-sm">{instance.id}</td>
                      <td className="py-3 px-4 font-medium">{instance.name}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={instance.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 capitalize">{instance.plan}</td>
                      <td className="py-3 px-4">{instance.cpu}vCPU, {instance.memory}GB, {instance.storage}GB</td>
                      <td className="py-3 px-4 text-sm">{new Date(instance.createdAt).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {instance.status === 'running' ? (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 text-devops-red"
                              onClick={() => handleStopInstance(instance.id)}
                            >
                              Stop
                            </Button>
                          ) : instance.status === 'stopped' ? (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 text-devops-green"
                              onClick={() => handleStartInstance(instance.id)}
                            >
                              Start
                            </Button>
                          ) : null}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 text-destructive"
                            onClick={() => setInstanceToDelete(instance.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Instances</p>
            <p className="text-2xl font-bold">{filteredInstances.length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Running Instances</p>
            <p className="text-2xl font-bold">{filteredInstances.filter(i => i.status === 'running').length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total CPU</p>
            <p className="text-2xl font-bold">{filteredInstances.reduce((acc, i) => acc + i.cpu, 0)}vCPU</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total RAM</p>
            <p className="text-2xl font-bold">{filteredInstances.reduce((acc, i) => acc + i.memory, 0)}GB</p>
          </div>
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={!!instanceToDelete} onOpenChange={(open) => !open && setInstanceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete this instance and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteInstance}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AdminInstancesPage;


import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useInstance } from '@/contexts/InstanceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import StatusBadge from '@/components/ui/StatusBadge';
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

const InstancePage: React.FC = () => {
  const { instance, isLoading, startInstance, stopInstance, deleteInstance } = useInstance();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Handle instance start
  const handleStartInstance = async () => {
    try {
      await startInstance();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start your instance. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle instance stop
  const handleStopInstance = async () => {
    try {
      await stopInstance();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop your instance. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle instance delete
  const handleDeleteInstance = async () => {
    try {
      await deleteInstance();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete your instance. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center h-full">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-t-2 border-primary rounded-full animate-spin mb-4"></div>
            <p className="text-lg">Loading instance details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show message if no instance
  if (!instance) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-8">Instance Management</h1>
          
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>No Instance Found</CardTitle>
              <CardDescription>
                You don't have any Kubernetes instance yet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Create your first instance from the dashboard
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Show instance details
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Instance Management</h1>
        
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{instance.name}</CardTitle>
                  <CardDescription className="mt-2 flex items-center">
                    <StatusBadge status={instance.status} className="mr-2" />
                    <span>Created on {new Date(instance.createdAt).toLocaleDateString()}</span>
                  </CardDescription>
                </div>
                
                <div className="flex items-center space-x-2">
                  {instance.status === 'running' ? (
                    <Button 
                      variant="outline" 
                      className="bg-devops-red/10 text-devops-red hover:bg-devops-red/20 border-devops-red/20"
                      onClick={handleStopInstance}
                    >
                      Stop Instance
                    </Button>
                  ) : instance.status === 'stopped' ? (
                    <Button 
                      variant="outline" 
                      className="bg-devops-green/10 text-devops-green hover:bg-devops-green/20 border-devops-green/20"
                      onClick={handleStartInstance}
                    >
                      Start Instance
                    </Button>
                  ) : null}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-8">
                {/* Instance details */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Instance Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Instance ID</span>
                        <span className="font-medium">{instance.id}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium capitalize">{instance.status}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Created</span>
                        <span className="font-medium">{new Date(instance.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">vCPU</span>
                        <span className="font-medium">{instance.cpu} cores</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Memory</span>
                        <span className="font-medium">{instance.memory} GB</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Storage</span>
                        <span className="font-medium">{instance.storage} GB SSD</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Instance access */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Access Details</h3>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="mb-4">
                      <p className="font-medium">API Endpoint:</p>
                      <code className="block bg-card p-2 rounded mt-1 text-sm overflow-x-auto">
                        https://{instance.name}-{instance.id}.devopswizard.cloud/api
                      </code>
                    </div>
                    <div>
                      <p className="font-medium">Access Token:</p>
                      <div className="flex items-center mt-1">
                        <code className="bg-card p-2 rounded text-sm flex-grow overflow-hidden">
                          ••••••••••••••••••••••••••••••••••••••••••••••••••
                        </code>
                        <Button variant="outline" size="sm" className="ml-2 whitespace-nowrap">
                          Copy Token
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Instance logs */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Recent Logs</h3>
                  <div className="bg-devops-navy text-white p-4 rounded-lg h-40 overflow-y-auto text-sm font-mono">
                    {instance.status === 'running' ? (
                      <pre className="whitespace-pre-wrap">
                        {`[2025-05-09 12:34:12] INFO: Instance ${instance.name} is running
[2025-05-09 12:34:10] INFO: Kubernetes cluster initialized
[2025-05-09 12:34:08] INFO: Loading LLM models...
[2025-05-09 12:34:05] INFO: Setting up networking...
[2025-05-09 12:34:01] INFO: Starting instance...
[2025-05-09 12:34:00] INFO: Instance boot sequence initiated`}
                      </pre>
                    ) : (
                      <div className="h-full flex items-center justify-center text-white/70">
                        <p>No logs available - Instance is not running</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="border-t pt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={() => window.open(`https://${instance.name}-${instance.id}.devopswizard.cloud`, '_blank')}
                disabled={instance.status !== 'running'}
              >
                Open Console
              </Button>
              <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                Delete Instance
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete your instance "{instance?.name}". This action cannot be undone.
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

export default InstancePage;

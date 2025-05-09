
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useCredentials } from '@/contexts/CredentialsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useToast } from '@/hooks/use-toast';

const ProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { credentials, resetCredentials } = useCredentials();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    // Call the updateUserProfile function from AuthContext
    if (user) {
      const success = updateUserProfile({
        name,
        email,
        password: password || undefined
      });
      
      if (success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
        setPassword('');
        setConfirmPassword('');
      }
    }
  };

  const handleResetCredentials = () => {
    if (window.confirm("Are you sure you want to reset all your GitHub App credentials? This cannot be undone.")) {
      resetCredentials();
      toast({
        title: "Credentials reset",
        description: "All your GitHub App credentials have been reset.",
      });
    }
  };

  return (
    <MainLayout>
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <ThemeToggle />
          </div>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal information here. Your name will be visible to other users.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleProfileUpdate}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Your name" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New password" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password" 
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Save Changes</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="credentials" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>GitHub App Credentials</CardTitle>
                  <CardDescription>
                    Manage your GitHub App credentials used for DevOps integrations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Webhook Proxy URL</Label>
                    <div className="flex items-center gap-2">
                      <Input value={credentials.webhookProxyUrl} readOnly className="bg-muted" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>App ID</Label>
                    <div className="flex items-center gap-2">
                      <Input value={credentials.appId} readOnly className="bg-muted" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Webhook Secret</Label>
                    <div className="flex items-center gap-2">
                      <Input value={credentials.webhookSecret ? "••••••••••••••••" : ""} readOnly className="bg-muted" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>GitHub Client ID</Label>
                    <div className="flex items-center gap-2">
                      <Input value={credentials.githubClientId} readOnly className="bg-muted" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>GitHub Client Secret</Label>
                    <div className="flex items-center gap-2">
                      <Input value={credentials.githubClientSecret ? "••••••••••••••••" : ""} readOnly className="bg-muted" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => window.location.href = "/credentials"}>
                    Update Credentials
                  </Button>
                  <Button variant="destructive" className="ml-2" onClick={handleResetCredentials}>
                    Reset Credentials
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize how DevOpsWizard looks for you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Theme</h3>
                      <p className="text-sm text-muted-foreground">
                        Select light mode, dark mode, or follow your system settings.
                      </p>
                    </div>
                    <ThemeToggle />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;

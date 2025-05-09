
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCredentials } from '@/contexts/CredentialsContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import FileUploader from '@/components/ui/FileUploader';
import { useToast } from '@/hooks/use-toast';

const CredentialsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { credentials, updateCredentials, submitCredentials, isSubmitted } = useCredentials();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to dashboard if credentials are already submitted
  React.useEffect(() => {
    if (isSubmitted) {
      navigate('/dashboard');
    }
  }, [isSubmitted, navigate]);

  // Handle JSON file upload
  const handlePrivateKeyUpload = (fileContent: string) => {
    try {
      // For demo purposes, we're just storing the raw content
      // In a real app, you might want to validate this is actually JSON
      updateCredentials('privateKey', fileContent);
      toast({
        title: "File Uploaded",
        description: "Private key file has been uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse the private key file. Please make sure it's a valid JSON.",
        variant: "destructive"
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!credentials.webhookProxyUrl || !credentials.appId || !credentials.webhookSecret || 
        !credentials.privateKey || !credentials.githubClientId || !credentials.githubClientSecret) {
      toast({
        title: "Validation Error",
        description: "Please fill in all the required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      submitCredentials();
      toast({
        title: "Credentials Saved",
        description: "Your credentials have been saved successfully.",
      });
      navigate('/dashboard');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <MainLayout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-2xl">Set Up Your DevOps LLM Bot</CardTitle>
            <CardDescription>
              Please provide the required credentials to create your Kubernetes instance
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="webhookProxyUrl">WEBHOOK_PROXY_URL</Label>
                  <Input
                    id="webhookProxyUrl"
                    placeholder="https://example.com/webhook"
                    value={credentials.webhookProxyUrl}
                    onChange={(e) => updateCredentials('webhookProxyUrl', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">The URL where your webhook proxy is hosted</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="appId">APP_ID</Label>
                    <Input
                      id="appId"
                      placeholder="12345"
                      value={credentials.appId}
                      onChange={(e) => updateCredentials('appId', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">Your GitHub App ID</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="webhookSecret">WEBHOOK_SECRET</Label>
                    <Input
                      id="webhookSecret"
                      type="password"
                      placeholder="••••••••"
                      value={credentials.webhookSecret}
                      onChange={(e) => updateCredentials('webhookSecret', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">Your GitHub App webhook secret</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>PRIVATE_KEY</Label>
                  <FileUploader
                    onFileSelect={handlePrivateKeyUpload}
                    accept=".json"
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground">Upload the JSON file containing your private key</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="githubClientId">GITHUB_CLIENT_ID</Label>
                    <Input
                      id="githubClientId"
                      placeholder="Iv1.abcdef123456"
                      value={credentials.githubClientId}
                      onChange={(e) => updateCredentials('githubClientId', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">Your GitHub OAuth App client ID</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="githubClientSecret">GITHUB_CLIENT_SECRET</Label>
                    <Input
                      id="githubClientSecret"
                      type="password"
                      placeholder="••••••••"
                      value={credentials.githubClientSecret}
                      onChange={(e) => updateCredentials('githubClientSecret', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">Your GitHub OAuth App client secret</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Continue'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CredentialsPage;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserDetails } from '@/hooks/useUser';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, X } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  const { data: userDetails, isLoading: userLoading } = useUserDetails();
  const { data: subscriptions, isLoading: subscriptionsLoading } = useSubscriptions();

  const isLoading = userLoading || subscriptionsLoading;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const currentSubscription = userDetails?.subscription;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription plan and billing.
          </p>
        </div>

        {/* Current Subscription */}
        {currentSubscription && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Current Subscription
                <Badge variant="default">{currentSubscription.plan}</Badge>
              </CardTitle>
              <CardDescription>
                Your current subscription details and usage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Plan</p>
                  <p className="text-2xl font-bold">{currentSubscription.plan}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={currentSubscription.status === 'active' ? 'default' : 'destructive'}>
                    {currentSubscription.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Plans */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {subscriptions?.map((plan) => (
              <Card key={plan.id} className={currentSubscription?.id === plan.id ? 'border-primary' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    {currentSubscription?.id === plan.id && (
                      <Badge variant="default">Current</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{plan.interval}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <X className="h-4 w-4 text-red-500 mr-2" />
                        )}
                        <span className={!feature.included ? 'text-muted-foreground line-through' : ''}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-4" 
                    variant={currentSubscription?.id === plan.id ? 'outline' : 'default'}
                    disabled={currentSubscription?.id === plan.id}
                  >
                    {currentSubscription?.id === plan.id ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;

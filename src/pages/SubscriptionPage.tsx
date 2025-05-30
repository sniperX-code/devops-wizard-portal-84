import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserDetails } from '@/hooks/useUser';
import { useSubscriptions, useSelectSubscription } from '@/hooks/useSubscriptions';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Zap, Crown, Rocket, X } from 'lucide-react';

// Local mapping for subscription plans
const PLAN_DETAILS: Record<string, {
  name: string;
  description: string;
  price: number;
  interval: string;
  features: Array<{ name: string; included: boolean }>;
}> = {
  free: {
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    interval: 'month',
    features: [
      { name: '5 Projects', included: true },
      { name: 'Basic Support', included: true },
      { name: '1GB Storage', included: true },
      { name: 'Advanced Analytics', included: false },
      { name: 'Priority Support', included: false },
      { name: 'Custom Integrations', included: false }
    ]
  },
  basic: {
    name: 'Basic',
    description: 'Great for small teams',
    price: 9,
    interval: 'month',
    features: [
      { name: '25 Projects', included: true },
      { name: 'Email Support', included: true },
      { name: '10GB Storage', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Priority Support', included: false },
      { name: 'Custom Integrations', included: false }
    ]
  },
  pro: {
    name: 'Pro',
    description: 'Perfect for growing businesses',
    price: 29,
    interval: 'month',
    features: [
      { name: 'Unlimited Projects', included: true },
      { name: 'Priority Support', included: true },
      { name: '100GB Storage', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Custom Integrations', included: true },
      { name: 'API Access', included: true }
    ]
  }
};

const SubscriptionPage: React.FC = () => {
  const { data: userDetails, isLoading: userLoading } = useUserDetails();
  const { data: subscriptions, isLoading: subscriptionsLoading } = useSubscriptions();
  const selectSubscription = useSelectSubscription();

  const isLoading = userLoading || subscriptionsLoading;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <Skeleton className="h-12 w-96 mx-auto" />
              <Skeleton className="h-6 w-128 mx-auto" />
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <Skeleton className="h-[600px]" />
              <Skeleton className="h-[600px]" />
              <Skeleton className="h-[600px]" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Get current subscription details from type
  const currentSubscriptionType = userDetails?.subscription?.type;
  const currentSubscription = currentSubscriptionType ? PLAN_DETAILS[currentSubscriptionType] : undefined;

  // Compose available plans from backend types
  const availablePlans = subscriptions?.map((sub) => ({
    ...PLAN_DETAILS[sub.type],
    type: sub.type,
    id: sub.id // always use backend id for API calls
  })) ?? [];

  const handleSelectPlan = async (planId: string) => {
    try {
      await selectSubscription.mutateAsync(planId);
    } catch (error) {
      console.error('Failed to select subscription:', error);
    }
  };

  const getPlanIcon = (type: string) => {
    switch (type) {
      case 'free':
        return <Zap className="h-8 w-8 text-blue-500" />;
      case 'basic':
        return <Rocket className="h-8 w-8 text-green-500" />;
      case 'pro':
        return <Crown className="h-8 w-8 text-purple-500" />;
      default:
        return <Zap className="h-8 w-8 text-blue-500" />;
    }
  };

  const getPlanColor = (type: string) => {
    switch (type) {
      case 'free':
        return 'from-blue-500 to-blue-600';
      case 'basic':
        return 'from-green-500 to-green-600';
      case 'pro':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  const isPopular = (type: string) => type === 'basic';

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-white border-b">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
          <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Scale your DevOps operations with our flexible subscription plans. 
              Choose the perfect plan that fits your team's needs and budget.
            </p>
            
            {/* Current Plan Badge */}
            {currentSubscription && (
              <div className="mt-8 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-700">
                  Currently on {currentSubscription.name} Plan
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Current Subscription */}
        {currentSubscription && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Current Subscription
                <Badge variant="default">{currentSubscription.name}</Badge>
              </CardTitle>
              <CardDescription>
                Your current subscription details and usage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Plan</p>
                  <p className="text-2xl font-bold">{currentSubscription.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={userDetails?.subscription?.status === 'active' ? 'default' : 'destructive'}>
                    {userDetails?.subscription?.status}
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
            {availablePlans.map((plan) => {
              const isCurrentPlan = currentSubscriptionType === plan.type;
              return (
                <Card key={plan.type} className={isCurrentPlan ? 'border-primary ring-2 ring-primary/20' : ''}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {plan.name}
                      {isCurrentPlan && (
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
                    <ul className="space-y-2 mb-4">
                      {(plan.features ?? []).map((feature, index) => (
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
                      className="w-full" 
                      variant={isCurrentPlan ? 'outline' : 'default'}
                      disabled={isCurrentPlan || selectSubscription.isPending}
                      onClick={() => !isCurrentPlan && handleSelectPlan(plan.id)}
                    >
                      {selectSubscription.isPending ? 'Processing...' : isCurrentPlan ? 'Current Plan' : 'Select Plan'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center space-y-4">
          <h3 className="text-2xl font-semibold text-gray-900">
            Need a custom solution?
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            For enterprise teams with specific requirements, we offer custom plans 
            with dedicated support and tailored features.
          </p>
          <Button variant="outline" className="mt-4">
            Contact Sales
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;

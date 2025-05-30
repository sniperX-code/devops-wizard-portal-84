
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserDetails } from '@/hooks/useUser';
import { useSubscriptions, useSelectSubscription } from '@/hooks/useSubscriptions';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Zap, Crown, Rocket } from 'lucide-react';

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

  const currentSubscription = userDetails?.subscription;

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
                  Currently on {currentSubscription.plan.charAt(0).toUpperCase() + currentSubscription.plan.slice(1)} Plan
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
            {subscriptions?.map((plan) => {
              const isCurrentPlan = currentSubscription?.id === plan.id;
              const popular = isPopular(plan.type);
              
              return (
                <div key={plan.id} className={`relative ${popular ? 'lg:scale-105 lg:z-10' : ''}`}>
                  {/* Popular Badge */}
                  {popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <Card className={`relative h-full transition-all duration-300 hover:shadow-2xl ${
                    isCurrentPlan 
                      ? 'ring-2 ring-blue-500 shadow-xl' 
                      : popular 
                        ? 'border-green-200 shadow-xl' 
                        : 'hover:shadow-lg'
                  }`}>
                    {/* Plan Header */}
                    <CardHeader className="text-center pb-8 pt-8">
                      <div className="flex justify-center mb-4">
                        {getPlanIcon(plan.type)}
                      </div>
                      
                      <CardTitle className="text-2xl font-bold mb-2">
                        {plan.name}
                      </CardTitle>
                      
                      <CardDescription className="text-base text-gray-600 mb-6">
                        {plan.description}
                      </CardDescription>
                      
                      {/* Price */}
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-center">
                          <span className="text-5xl font-bold text-gray-900">
                            ${plan.price}
                          </span>
                          <span className="text-lg font-medium text-gray-500 ml-1">
                            /{plan.interval}
                          </span>
                        </div>
                        {plan.price > 0 && (
                          <p className="text-sm text-gray-500">
                            Billed {plan.interval}ly
                          </p>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="px-6 pb-8">
                      {/* Features List */}
                      <ul className="space-y-4 mb-8">
                        {(plan.features ?? []).map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 mr-3 ${
                              feature.included 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                              <Check className="h-3 w-3" />
                            </div>
                            <span className={`text-sm ${
                              feature.included 
                                ? 'text-gray-700' 
                                : 'text-gray-400 line-through'
                            }`}>
                              {feature.name}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Action Button */}
                      <Button 
                        className={`w-full h-12 text-base font-semibold transition-all duration-200 ${
                          isCurrentPlan
                            ? 'bg-gray-100 text-gray-600 cursor-default hover:bg-gray-100'
                            : popular
                              ? `bg-gradient-to-r ${getPlanColor(plan.type)} hover:shadow-lg transform hover:-translate-y-0.5`
                              : 'hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                        variant={isCurrentPlan ? 'outline' : popular ? 'default' : 'outline'}
                        disabled={isCurrentPlan || selectSubscription.isPending}
                        onClick={() => !isCurrentPlan && handleSelectPlan(plan.id)}
                      >
                        {selectSubscription.isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </div>
                        ) : isCurrentPlan ? (
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            Current Plan
                          </div>
                        ) : (
                          `Get Started with ${plan.name}`
                        )}
                      </Button>

                      {/* Additional Info */}
                      {isCurrentPlan && (
                        <div className="mt-4 text-center">
                          <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                            Active Subscription
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
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
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;

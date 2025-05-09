
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useInstance } from '@/contexts/InstanceContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import PricingCard, { PricingPlan } from '@/components/ui/PricingCard';
import { useToast } from '@/hooks/use-toast';

const SubscriptionPage: React.FC = () => {
  const { instance } = useInstance();
  const { toast } = useToast();
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(instance?.plan || 'free');

  // Define pricing plans
  const plans: PricingPlan[] = [
    {
      name: 'Free',
      price: {
        monthly: 0,
        yearly: 0
      },
      description: 'Basic features for personal projects',
      features: [
        'Single Kubernetes instance',
        '2 vCPU cores',
        '4GB RAM',
        '20GB SSD storage',
        'Community support'
      ],
      buttonText: selectedPlan === 'free' ? 'Current Plan' : 'Select Plan'
    },
    {
      name: 'Pro',
      price: {
        monthly: 19.99,
        yearly: 16.99 * 12
      },
      description: 'Advanced features for professional use',
      features: [
        'Up to 3 Kubernetes instances',
        '4 vCPU cores per instance',
        '8GB RAM per instance',
        '50GB SSD storage',
        'Email support',
        'API access'
      ],
      mostPopular: true,
      buttonText: 'Coming Soon',
      disabled: true
    },
    {
      name: 'Enterprise',
      price: {
        monthly: 49.99,
        yearly: 39.99 * 12
      },
      description: 'Maximum power for teams and organizations',
      features: [
        'Unlimited Kubernetes instances',
        '8 vCPU cores per instance',
        '16GB RAM per instance',
        '100GB SSD storage',
        'Priority support',
        'API access',
        'Custom LLM models',
        'Advanced security'
      ],
      buttonText: 'Coming Soon',
      disabled: true
    }
  ];

  // Handle plan selection
  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan.disabled) return;
    
    if (plan.name.toLowerCase() !== selectedPlan) {
      setSelectedPlan(plan.name.toLowerCase());
      toast({
        title: "Plan Selected",
        description: `You've selected the ${plan.name} plan.`,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Subscription</h1>
        <p className="text-muted-foreground mb-8">Choose the plan that's right for you</p>
        
        {/* Billing toggle */}
        <div className="flex justify-center items-center mb-8">
          <Label htmlFor="billing-toggle" className={!isYearly ? 'font-medium' : undefined}>Monthly</Label>
          <Switch
            id="billing-toggle"
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="mx-4"
          />
          <Label htmlFor="billing-toggle" className={isYearly ? 'font-medium' : undefined}>
            Yearly <span className="text-sm text-devops-green">(Save 15%)</span>
          </Label>
        </div>
        
        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              isYearly={isYearly}
              onSelectPlan={handleSelectPlan}
              currentPlan={selectedPlan || undefined}
            />
          ))}
        </div>
        
        {/* Feature comparison */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Compare Features</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-6 text-left">Feature</th>
                  <th className="py-4 px-6 text-center">Free</th>
                  <th className="py-4 px-6 text-center">Pro</th>
                  <th className="py-4 px-6 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Kubernetes Instances</td>
                  <td className="py-4 px-6 text-center">1</td>
                  <td className="py-4 px-6 text-center">Up to 3</td>
                  <td className="py-4 px-6 text-center">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">vCPU cores</td>
                  <td className="py-4 px-6 text-center">2</td>
                  <td className="py-4 px-6 text-center">4</td>
                  <td className="py-4 px-6 text-center">8</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Memory (RAM)</td>
                  <td className="py-4 px-6 text-center">4GB</td>
                  <td className="py-4 px-6 text-center">8GB</td>
                  <td className="py-4 px-6 text-center">16GB</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Storage</td>
                  <td className="py-4 px-6 text-center">20GB SSD</td>
                  <td className="py-4 px-6 text-center">50GB SSD</td>
                  <td className="py-4 px-6 text-center">100GB SSD</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">API Access</td>
                  <td className="py-4 px-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-devops-red inline-block">
                      <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
                    </svg>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-devops-green inline-block">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-devops-green inline-block">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Custom LLM Models</td>
                  <td className="py-4 px-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-devops-red inline-block">
                      <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
                    </svg>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-devops-red inline-block">
                      <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
                    </svg>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-devops-green inline-block">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Support</td>
                  <td className="py-4 px-6 text-center">Community</td>
                  <td className="py-4 px-6 text-center">Email</td>
                  <td className="py-4 px-6 text-center">Priority</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">When will Pro and Enterprise plans be available?</h3>
              <p className="text-muted-foreground">
                We're currently working on implementing the Pro and Enterprise plans. They are planned to be released within the next few months.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I upgrade my plan later?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade your plan at any time. When you upgrade, you'll be charged the prorated amount for the remainder of your billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I cancel my subscription?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. If you cancel, you'll continue to have access until the end of your current billing period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;

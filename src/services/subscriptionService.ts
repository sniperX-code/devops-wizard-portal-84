import { httpClient, API_CONFIG } from '@/config/api';

// Types for subscriptions
export interface Subscription {
  id: string;
  type: string;
}

export interface UserSubscriptionResponse {
  user: any; // Replace with your actual user type
}

export class SubscriptionService {
  static async getAllSubscriptions(): Promise<Subscription[]> {
    return httpClient.makeRequest<Subscription[]>(
      API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.GET_ALL,
      {
        method: 'GET',
      }
    );
  }

  static async selectSubscription(subscriptionId: string): Promise<UserSubscriptionResponse> {
    return httpClient.makeRequest<UserSubscriptionResponse>(
      `${API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.SELECT}/${subscriptionId}`,
      {
        method: 'POST',
      }
    );
  }
}

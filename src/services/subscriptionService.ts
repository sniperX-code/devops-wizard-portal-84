
import { API_CONFIG, TokenManager } from '@/config/api';

// Types for subscriptions
export interface Subscription {
  id: string;
  type: string;
}

export interface UserSubscriptionResponse {
  user: any; // Replace with your actual user type
}

export class SubscriptionService {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...TokenManager.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    return response.json();
  }

  static async getAllSubscriptions(): Promise<Subscription[]> {
    return this.makeRequest<Subscription[]>(
      API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.GET_ALL,
      {
        method: 'GET',
      }
    );
  }

  static async selectSubscription(subscriptionId: string): Promise<UserSubscriptionResponse> {
    return this.makeRequest<UserSubscriptionResponse>(
      `${API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.SELECT}/${subscriptionId}`,
      {
        method: 'POST',
      }
    );
  }
}

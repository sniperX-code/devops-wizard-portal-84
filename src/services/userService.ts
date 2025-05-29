
import { API_CONFIG, TokenManager } from '@/config/api';
import type { Instance } from './instanceService';
import type { Subscription } from './subscriptionService';
import type { ConfigRequest } from './configService';

// Types for user details
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetailsResponse {
  user: UserProfile;
  configuration?: ConfigRequest;
  instance?: Instance;
  subscription?: Subscription;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
}

export class UserService {
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

    // Handle no content responses
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    return response.json();
  }

  static async getUserDetails(): Promise<UserDetailsResponse> {
    return this.makeRequest<UserDetailsResponse>(
      API_CONFIG.ENDPOINTS.USER.GET_ME
    );
  }

  static async updateUserProfile(data: UpdateUserRequest): Promise<UserDetailsResponse> {
    return this.makeRequest<UserDetailsResponse>(
      API_CONFIG.ENDPOINTS.USER.UPDATE_ME,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }
}

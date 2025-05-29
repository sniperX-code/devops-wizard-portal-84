
import { API_CONFIG, TokenManager } from '@/config/api';

// Types for instance management
export interface Instance {
  id: string;
  name: string;
  status: 'creating' | 'running' | 'stopped' | 'error';
  createdAt: string;
  lastUpdated: string;
  cpu: number;
  memory: number;
  storage: number;
  plan: 'free' | 'pro' | 'enterprise';
  userId: string;
  configId?: string;
}

export interface CreateInstanceRequest {
  name?: string;
}

export interface InstancesListResponse {
  instances: Instance[];
}

export class InstanceService {
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

  static async getAllInstances(): Promise<InstancesListResponse> {
    return this.makeRequest<InstancesListResponse>(
      API_CONFIG.ENDPOINTS.INSTANCES.GET_ALL
    );
  }

  static async createInstance(data: CreateInstanceRequest = {}): Promise<Instance> {
    return this.makeRequest<Instance>(
      API_CONFIG.ENDPOINTS.INSTANCES.CREATE,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  static async deleteInstance(instanceId: string): Promise<void> {
    await this.makeRequest<void>(
      `${API_CONFIG.ENDPOINTS.INSTANCES.DELETE}/${instanceId}`,
      {
        method: 'DELETE',
      }
    );
  }
}

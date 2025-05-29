
import { API_CONFIG, TokenManager } from '@/config/api';

// Types for configuration
export interface ConfigRequest {
  webhookProxyUrl: string;
  appId: string;
  privateKey: string;
  webhookSecret: string;
  githubClientId: string;
  githubClientSecret: string;
}

export interface ConfigUpdateRequest extends Partial<ConfigRequest> {}

export class ConfigService {
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

  static async createConfig(data: ConfigRequest): Promise<void> {
    await this.makeRequest<void>(
      API_CONFIG.ENDPOINTS.CONFIGS.CREATE,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  static async updateConfig(id: string, data: ConfigUpdateRequest): Promise<void> {
    await this.makeRequest<void>(
      `${API_CONFIG.ENDPOINTS.CONFIGS.UPDATE}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }
}

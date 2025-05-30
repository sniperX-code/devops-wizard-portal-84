import { httpClient, API_CONFIG } from '@/config/api';

// Types for configuration
export interface ConfigRequest {
  id?: string;
  webhookProxyUrl: string;
  appId: string;
  privateKey: string;
  webhookSecret: string;
  githubClientId: string;
  githubClientSecret: string;
}

export interface ConfigUpdateRequest extends Partial<ConfigRequest> {}

export class ConfigService {
  static async createConfig(data: ConfigRequest): Promise<void> {
    await httpClient.makeRequest<void>(
      API_CONFIG.ENDPOINTS.CONFIGS.CREATE,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  static async updateConfig(id: string, data: ConfigUpdateRequest): Promise<void> {
    await httpClient.makeRequest<void>(
      `${API_CONFIG.ENDPOINTS.CONFIGS.UPDATE}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  static async getConfigs(): Promise<ConfigRequest | null> {
    return httpClient.makeRequest<ConfigRequest | null>(
      API_CONFIG.ENDPOINTS.CONFIGS.CREATE, // GET /configs
      {
        method: 'GET',
      }
    );
  }
}

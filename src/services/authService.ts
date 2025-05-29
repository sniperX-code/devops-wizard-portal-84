
import { API_CONFIG, TokenManager } from '@/config/api';

// Types for authentication
export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  location?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  email: string;
  newPassword: string;
  passwordConfirmation: string;
}

export interface AuthResponse {
  accessToken: string;
}

export class AuthService {
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

  static async signUp(data: SignUpRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.SIGN_UP,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    // Store the token
    if (response.accessToken) {
      TokenManager.setToken(response.accessToken);
    }

    return response;
  }

  static async signIn(data: SignInRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.SIGN_IN,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    // Store the token
    if (response.accessToken) {
      TokenManager.setToken(response.accessToken);
    }

    return response;
  }

  static async changePassword(data: ChangePasswordRequest): Promise<void> {
    await this.makeRequest<void>(
      API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  static logout(): void {
    TokenManager.removeToken();
  }
}

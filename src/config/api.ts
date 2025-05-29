
// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://your-api-base-url.com/api', // Replace with your actual API base URL
  ENDPOINTS: {
    AUTH: {
      SIGN_UP: '/auth/sign-up',
      SIGN_IN: '/auth/sign-in',
      CHANGE_PASSWORD: '/auth/change-password',
    },
    CONFIGS: {
      CREATE: '/configs',
      UPDATE: '/configs', // /:id will be appended
    },
    SUBSCRIPTIONS: {
      GET_ALL: '/subscriptions',
      SELECT: '/subscriptions/users', // /:subscriptionId will be appended
    },
    INSTANCES: {
      GET_ALL: '/instances',
      CREATE: '/instances',
      DELETE: '/instances', // /:instanceId will be appended
    },
    USER: {
      GET_ME: '/me',
      UPDATE_ME: '/me',
    },
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Token management
export const TokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem('devops-auth-token');
  },
  
  setToken: (token: string): void => {
    localStorage.setItem('devops-auth-token', token);
  },
  
  removeToken: (): void => {
    localStorage.removeItem('devops-auth-token');
  },
  
  getAuthHeaders: (): { [key: string]: string } => {
    const token = TokenManager.getToken();
    return {
      ...API_CONFIG.HEADERS,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  },
};

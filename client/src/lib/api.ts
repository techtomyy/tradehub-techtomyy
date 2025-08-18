const API_BASE_URL = 'https://tradehub-techtomyy-production.up.railway.app';

export interface LoginBody {
  email: string;
  password: string;
}

export interface SignupBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  conditionagree: boolean;
}

// Add user profile interface
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
  kycVerified?: boolean;
  username?: string;
  bio?: string;
  rating?: number;
  totalSales?: number;
  walletBalance?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Updated interface to match actual API response
export interface ApiResponse<T = any> {
  success?: boolean;
  status?: string;
  data?: T;
  message?: string;
  error?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If we can't parse the error response, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      
      throw new ApiError(errorMessage, response.status);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0
    );
  }
}

export const authApi = {
  async login(credentials: LoginBody): Promise<ApiResponse> {
    return makeRequest<ApiResponse>('/auth/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async signup(userData: SignupBody): Promise<ApiResponse> {
    return makeRequest<ApiResponse>('/auth/register/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Add new method to fetch user profile
  async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      console.log('API - Attempting to fetch user profile...');
      const response = await makeRequest<ApiResponse<UserProfile>>('/auth/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
      });
      console.log('API - User profile response:', response);
      return response;
    } catch (error) {
      // If profile endpoint doesn't exist, return null
      console.warn('User profile endpoint not available:', error);
      return { success: false, message: 'Profile endpoint not available' };
    }
  },

  // Fallback method to get user data from login response
  async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    try {
      console.log('API - Attempting to fetch current user...');
      const response = await makeRequest<ApiResponse<UserProfile>>('/auth/user/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
      });
      console.log('API - Current user response:', response);
      return response;
    } catch (error) {
      console.warn('Current user endpoint not available:', error);
      return { success: false, message: 'Current user endpoint not available' };
    }
  },
};

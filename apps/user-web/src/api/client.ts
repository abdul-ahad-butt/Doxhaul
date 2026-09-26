export class ApiError extends Error {
  constructor(public code: string, message: string, public details?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

// @ts-ignore
const BASE_URL = import.meta.env.VITE_API_URL || 'https://doxhaul.abdulahadbutt420.workers.dev/api';

export const apiClient = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token: string) => localStorage.setItem('token', token),
  clearToken: () => localStorage.removeItem('token'),

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    
    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.clearToken();
      // Only dispatch if we are actively logged out by a 401
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    const isJson = response.headers.get('content-type')?.includes('application/json');
    
    if (!response.ok) {
      if (isJson) {
        const errorData = await response.json();
        throw new ApiError(
          errorData.error?.code || 'UNKNOWN_ERROR',
          errorData.error?.message || 'An error occurred',
          errorData.error?.details
        );
      }
      throw new ApiError('NETWORK_ERROR', response.statusText);
    }

    if (isJson) {
      const data = await response.json();
      return data.data as T;
    }

    // For file downloads
    return response.blob() as unknown as T;
  },

  get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: any, options?: RequestInit) {
    const isFormData = body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
    });
  },

  put<T>(endpoint: string, body: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
};

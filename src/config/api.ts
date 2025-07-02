  // API configuration for different environments
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000' : '');

// Helper function to create API URLs
export const createApiUrl = (path: string): string => {
  return `${API_BASE_URL}${path}`;
};

// API endpoints
export const API_ENDPOINTS = {
  characters: '/api/characters',
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout'
  }
} as const; 
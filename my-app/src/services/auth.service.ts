import apiClient from './api.client';
import { Token, UserCreate, UserLogin, UserResponse } from '../types';

export const authService = {
  // Register a new user
  register: async (userData: UserCreate): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>('/api/v1/users/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials: UserLogin): Promise<Token> => {
    const response = await apiClient.post<Token>('/api/v1/users/login', credentials);

    // Store token in localStorage
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }

    return response.data;
  },

  // Get current user info
  me: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/api/v1/users/me');
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('access_token');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },
};

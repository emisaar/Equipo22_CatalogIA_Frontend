import apiClient from './api.client';
import { OrderCreate, OrderResponse, OrderList, OrderStatusUpdate } from '../types';

export const orderService = {
  // Create a new order
  createOrder: async (orderData: OrderCreate): Promise<OrderResponse> => {
    const response = await apiClient.post<OrderResponse>('/api/v1/orders/', orderData);
    return response.data;
  },

  // List all user orders
  listOrders: async (params?: {
    skip?: number;
    limit?: number;
  }): Promise<OrderList> => {
    const response = await apiClient.get<OrderList>('/api/v1/orders/', { params });
    return response.data;
  },

  // Get a single order by ID
  getOrder: async (orderId: string): Promise<OrderResponse> => {
    const response = await apiClient.get<OrderResponse>(`/api/v1/orders/${orderId}`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId: string, statusUpdate: OrderStatusUpdate): Promise<OrderResponse> => {
    const response = await apiClient.put<OrderResponse>(
      `/api/v1/orders/${orderId}/status`,
      statusUpdate
    );
    return response.data;
  },

  // Cancel order (delete)
  cancelOrder: async (orderId: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/api/v1/orders/${orderId}`);
    return response.data;
  },
};

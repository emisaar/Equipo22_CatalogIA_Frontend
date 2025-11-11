import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OrderResponse, OrderCreate, OrderStatusUpdate } from '../types';
import { orderService } from '../services';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: OrderResponse[];
  pendingOrdersCount: number;
  loading: boolean;
  error: string | null;
  createOrder: (orderData: OrderCreate) => Promise<OrderResponse>;
  updateOrderStatus: (orderId: number, status: 'pending' | 'completed' | 'cancelled') => Promise<void>;
  cancelOrder: (orderId: number) => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    } else {
      setOrders([]);
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.listOrders({ limit: 100 });
      setOrders(data.orders);
    } catch (err: any) {
      console.error('Error loading orders:', err);
      setError(err.response?.data?.detail || 'Error al cargar las órdenes');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: OrderCreate): Promise<OrderResponse> => {
    const newOrder = await orderService.createOrder(orderData);
    setOrders([newOrder, ...orders]);
    return newOrder;
  };

  const updateOrderStatus = async (orderId: number, status: 'pending' | 'completed' | 'cancelled') => {
    const statusUpdate: OrderStatusUpdate = { status };
    const updatedOrder = await orderService.updateOrderStatus(orderId.toString(), statusUpdate);
    setOrders(orders.map(order => order.id === orderId ? updatedOrder : order));
  };

  const cancelOrder = async (orderId: number) => {
    await orderService.cancelOrder(orderId.toString());
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: 'cancelled' } : order
    ));
  };

  const refreshOrders = async () => {
    await loadOrders();
  };

  const pendingOrdersCount = orders.filter(order => order.status.toLowerCase() === 'pending').length;

  return (
    <OrderContext.Provider
      value={{
        orders,
        pendingOrdersCount,
        loading,
        error,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        refreshOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

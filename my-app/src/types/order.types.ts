// Order Types based on backend API schemas

export interface OrderCreate {
  product_id: number;
  quantity: number;
}

export interface OrderResponse {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  total_amount: string;
  status: string;
  created_at: string;
}

export interface OrderStatusUpdate {
  status: 'pending' | 'completed' | 'cancelled';
}

export interface OrderList {
  orders: OrderResponse[];
  total: number;
  skip: number;
  limit: number;
}

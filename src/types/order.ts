import { SavedOrderedProduct } from './orderProducts';

interface UserId {
  userId: string;
}

export interface OrderedProduct {
  productId: string;
  quantity: number;
}

export interface OrderDetails extends UserId {
  status?: string;
  products: OrderedProduct[];
}

export interface Order extends UserId {
  status?: string;
  id: string;
  products: SavedOrderedProduct[];
  createdAt: Date;
  completedAt: Date | null;
}

export interface CompletOrderDetails extends UserId {
  orderId: string;
}

export interface SaveInfo {
  values: (string | number | undefined)[];
  sql: string;
}

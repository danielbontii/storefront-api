// interface UserAndProductId {
//   productId: string;
//   userId: string;
// }

import { SavedOrderedProduct } from "./orderProducts";

interface UserId {
  // productId: string;
  userId: string;
}

// export interface OrderDetails extends UserAndProductId {
//   quantity: number;
//   status?: string;
//   cost?: string;
// }
export interface OrderedProduct {
  productId: string;
  // userId: string;
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

// export interface CompletOrderDetails extends UserAndProductId {
//   orderId: string;
// }

export interface CompletOrderDetails extends UserId {
  orderId: string;
}

export interface SaveInfo {
  values: (string | number | undefined)[];
  sql: string;
}

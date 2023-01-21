// interface UserAndProductId {
//   productId: string;
//   userId: string;
// }

interface UserId {
  productId: string;
  userId: string;
}

// export interface OrderDetails extends UserAndProductId {
//   quantity: number;
//   status?: string;
//   cost?: string;
// }
interface OrderedProduct {
  productId: string;
  userId: string;
}

export interface OrderDetails extends UserId {
  status?: string;
  products: OrderedProduct[];
}

export interface Order extends OrderDetails {
  id: string;
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

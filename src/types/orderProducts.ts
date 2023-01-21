import { OrderedProduct } from "./order";

export interface SavedOrderedProduct extends OrderedProduct {
    id: string;
    orderId: string;
}

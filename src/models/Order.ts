import { OrderRepository } from '../repositories/OrderRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { CompletOrderDetails, Order, OrderDetails } from '../types/order';
import {
  completOrderSchema,
  orderSchema,
  uuidSchema
} from '../utils/validations';

export class OrderStore {
  /**
   *
   * @param details the details or array of details
   * @returns the created order or array of orders
   */
  static async create(
    details: OrderDetails | OrderDetails[]
  ): Promise<Order | Order[]> {
    if (Array.isArray(details)) {
      await orderSchema.validateAsync(details);
      return await OrderRepository.saveAll(details);
    }

    await orderSchema.validateAsync([details]);
    return await OrderRepository.save(details);
  }

  /**
   *
   * @param id the user id
   * @returns current orders by user with the given id
   */
  static async currentOrdersByUser(id: string): Promise<Order[]> {
    await uuidSchema.validateAsync({ id });
    return await OrderRepository.findByCurrentUserOrders(id);
  }

  /**
   *
   * @param id the id of the order
   * @returns completed orders by user with given id
   */
  static async completedOrdersByUser(id: string): Promise<Order[]> {
    await uuidSchema.validateAsync({ id });
    return await OrderRepository.findByCompletedUserOrders(id);
  }

  /**
   *
   * @param details the details of the order or array of orders
   * @returns the completed order or array of completed orders
   */
  static async completeUserOrder(
    details: CompletOrderDetails | CompletOrderDetails[]
  ): Promise<Order | Order[]> {
    if (Array.isArray(details)) {
      await completOrderSchema.validateAsync(details);
      return await OrderRepository.completeAll(details);
    }

    await completOrderSchema.validateAsync([details]);
    return await OrderRepository.complete(details);
  }
}

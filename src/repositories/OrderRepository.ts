import { QueryResult } from 'pg';
import client from '../database';
import {
  CompletOrderDetails,
  Order,
  OrderDetails,
  SaveInfo
} from '../types/order';

export class OrderRepository {
  /**
   *
   * @param details the order details
   * @returns the value of the order and the sql string
   */
  static getSaveInfo(details: OrderDetails): SaveInfo {
    const fields = details.status
      ? 'product_id, user_id, quantity, cost, status'
      : 'product_id, user_id, quantity, cost';

    if (!details.status) {
      delete details.status;
    }

    const values = details.status
      ? [
          details.productId,
          details.userId,
          details.quantity,
          details.cost,
          details.status
        ]
      : [details.productId, details.userId, details.quantity, details.cost];

    const sql =
      `INSERT INTO orders(${fields}) VALUES ${
        details.status ? '($1, $2, $3, $4, $5)' : '($1, $2, $3, $4)'
      } ` +
      'RETURNING id, product_id AS "productId", quantity, cost, user_id AS "userId", ' +
      'status, created_at AS "createdAt", completed_at AS "completedAt"';

    return { values, sql };
  }

  /**
   *
   * @param details the details of the order
   * @returns the created user
   */
  static async save(details: OrderDetails): Promise<Order> {
    const conn = await client.connect();
    const saveInfo = OrderRepository.getSaveInfo(details);
    const result: QueryResult<Order> = await conn.query(
      saveInfo.sql,
      saveInfo.values
    );
    conn.release();
    return result.rows[0];
  }

  /**
   *
   * @param details an array of order details
   * @returns an array of the created orders
   */
  static async saveAll(details: OrderDetails[]): Promise<Order[]> {
    const savedOrders: Order[] = [];

    const conn = await client.connect();

    for (const detail of details) {
      const saveInfo = OrderRepository.getSaveInfo(detail);
      const result: QueryResult<Order> = await conn.query(
        saveInfo.sql,
        saveInfo.values
      );
      savedOrders.push(result.rows[0]);
    }
    conn.release();
    return savedOrders;
  }

  /**
   *
   * @param status
   * @param id
   * @returns an order with the given id and status
   */
  static async findByStatus(status: string, id: string): Promise<Order[]> {
    const conn = await client.connect();

    const ordersQuery =
      'SELECT id, product_id AS "productId", quantity, cost, ' +
      'user_id AS "userId", status, created_at AS "createdAt", ' +
      'completed_at AS "completedAt" FROM orders WHERE status = ' +
      `'${status}'` +
      ' AND user_id = ($1)';

    const result: QueryResult<Order> = await conn.query(ordersQuery, [id]);

    conn.release();
    return result.rows;
  }

  /**
   *
   * @param id
   * @returns order with given id and status active
   */
  static async findByCurrentUserOrders(id: string): Promise<Order[]> {
    return await OrderRepository.findByStatus('active', id);
  }

  /**
   *
   * @param id
   * @returns order with given id and status completed
   */
  static async findByCompletedUserOrders(id: string): Promise<Order[]> {
    return await OrderRepository.findByStatus('completed', id);
  }

  /**
   *
   * @param details the details of the order
   * @returns the completed order
   */
  static async complete(details: CompletOrderDetails): Promise<Order> {
    const conn = await client.connect();
    const updateOrderQuery =
      "UPDATE orders SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ($1) " +
      'AND user_id = ($2) AND product_id = ($3) ' +
      'RETURNING id, product_id AS "productId", quantity, cost, user_id AS "userId", ' +
      'status, created_at AS "createdAt", completed_at AS "completedAt"';

    const result: QueryResult<Order> = await conn.query(updateOrderQuery, [
      details.orderId,
      details.userId,
      details.productId
    ]);
    conn.release();
    return result.rows[0];
  }

  /**
   *
   * @param details an array of order details
   * @returns an array of completed orders
   */
  static async completeAll(details: CompletOrderDetails[]): Promise<Order[]> {
    const completed: Order[] = [];

    for (const detail of details) {
      completed.push(await OrderRepository.complete(detail));
    }

    return completed;
  }
}

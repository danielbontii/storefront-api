import { QueryResult } from 'pg';
import client from '../database';
import { OrderedProduct } from '../types/order';
import { SavedOrderedProduct } from '../types/orderProducts';

export class OrderProductsRepository {
  static async saveAll(
    orderId: string,
    products: OrderedProduct[]
  ): Promise<SavedOrderedProduct[]> {

    const saved: SavedOrderedProduct[] = [];
    const conn = await client.connect();

    for (const product of products) {
      const sql =
        'INSERT INTO order_products (product_id, quantity, order_id) ' +
        'VALUES ($1, $2, $3) RETURNING id, product_id AS "productId", ' +
        'order_id AS "orderId", quantity';
      const result: QueryResult<SavedOrderedProduct> = await conn.query(sql, [
        product.productId,
        product.quantity,
        orderId
      ]);
      saved.push(result.rows[0]);
    }
    conn.release();
    return saved;
  }

  static async findByOrderId(orderId: string): Promise<SavedOrderedProduct[]> {
    const conn = await client.connect();
    const sql = 'SELECT * FROM order_products WHERE order_id = ($1)';
    const result:QueryResult<SavedOrderedProduct> = await conn.query(sql, [orderId]);
    conn.release();
    return result.rows;
  }
}

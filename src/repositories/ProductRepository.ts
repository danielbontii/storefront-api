import { QueryResult } from 'pg';

import client from '../database';
import { CategoryStore } from '../models/Category';
import { Category } from '../types/category';
import { Product, ProductDetails } from '../types/product';

export class ProductRepository {
  static async findAll(): Promise<Product[]> {
    const conn = await client.connect();
    const result: QueryResult<Product> = await conn.query(
      'SELECT products.id, products.price, products.product_name AS name, ' +
        'categories.id AS "categoryId", categories.category_name as category ' +
        'FROM products JOIN categories ON products.category_id = categories.id'
    );
    conn.release();
    return result.rows;
  }

  static async findById(id: string): Promise<Product> {
    const conn = await client.connect();
    const productQuery =
      'SELECT products.id, products.product_name as name, products.price, ' +
      'categories.id AS "categoryId", categories.category_name as category ' +
      'FROM products JOIN categories ON products.category_id = categories.id ' +
      'WHERE products.id = ($1)';
    const result: QueryResult<Product> = await conn.query(productQuery, [id]);
    conn.release();
    return result.rows[0];
  }

  static async save(details: ProductDetails): Promise<Product> {
    const conn = await client.connect();
    const createProductQuery =
      'INSERT INTO products (product_name, price, category_id) VALUES ($1, $2, $3) ' +
      'RETURNING id, product_name AS name, price, category_id AS "categoryId"';

    const categoryIdQuery =
      'SELECT id from categories WHERE LOWER(category_name) = ($1)';
    const categoryIdResult = await conn.query(categoryIdQuery, [
      details.category.toLowerCase()
    ]);

    let result: QueryResult<Product>;
    let newCategory: Category;

    if (categoryIdResult.rowCount) {
      result = await conn.query(createProductQuery, [
        details.name,
        details.price,
        categoryIdResult.rows[0].id
      ]);
    } else {
      newCategory = await CategoryStore.create(details.category);
      result = await conn.query(createProductQuery, [
        details.name,
        details.price,
        newCategory.id
      ]);
    }

    conn.release();

    return { ...result.rows[0], category: details.category };
  }

  static async findByCategory(category: string): Promise<Product[]> {
    const conn = await client.connect();
    const productIdQuery =
      'SELECT id from categories WHERE LOWER(category_name) = ($1)';
    const productIdResult = await conn.query(productIdQuery, [
      category.toLowerCase()
    ]);
    const categoryId = productIdResult.rows[0].id;

    const categoryQuery =
      'SELECT products.id, products.product_name as name, products.price, ' +
      'categories.id AS "categoryId", categories.category_name as category ' +
      'FROM products JOIN categories ON products.category_id = categories.id ' +
      'WHERE categories.id = ($1)';

    const categoryResult: QueryResult<Product> = await conn.query(
      categoryQuery,
      [categoryId]
    );

    return categoryResult.rows;
  }
}

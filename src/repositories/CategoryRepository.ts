import { Category } from '../types/category';
import client from '../database';
import { QueryResult } from 'pg';

export class CategoryRepository {
  /**
   *
   * @returns all categories
   */
  static async findAll(): Promise<Category[]> {
    const conn = await client.connect();
    const result: QueryResult<Category> = await conn.query(
      'SELECT id, category_name AS name FROM categories'
    );
    conn.release();
    return result.rows;
  }

  /**
   *
   * @param name the name of the category
   * @returns the created category
   */
  static async save(name: string): Promise<Category> {
    const conn = await client.connect();
    const createCategoryQuery =
      'INSERT INTO categories(category_name) VALUES($1) ' +
      'RETURNING id, category_name AS name';
    const result: QueryResult<Category> = await conn.query(
      createCategoryQuery,
      [name]
    );
    conn.release();
    return result.rows[0];
  }

  /**
   *
   * @param name the name of the category
   * @returns category with the given name
   */
  static async findByName(name: string): Promise<Category> {
    const conn = await client.connect();
    const categoryQuery =
      'SELECT id, category_name AS name FROM categories ' +
      'WHERE LOWER(category_name) = ($1)';
    const result: QueryResult<Category> = await conn.query(categoryQuery, [
      name.toLowerCase()
    ]);
    conn.release();
    return result.rows[0];
  }
}

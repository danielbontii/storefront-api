import { QueryResult } from 'pg';
import bcrypt from 'bcrypt';

import client from '../database';
import { User, UserDetails } from '../types/user';

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export class UserRepository {
  /**
   *
   * @returns all users
   */
  static async findAll(): Promise<User[]> {
    const conn = await client.connect();
    const findUsersQuery =
      'SELECT id, first_name AS "firstName", last_name as "lastName" FROM users';
    const result: QueryResult<User> = await conn.query(findUsersQuery);
    conn.release();
    return result.rows;
  }

  /**
   *
   * @param id the id of the user
   * @returns user with the given id
   */
  static async findById(id: string): Promise<User> {
    const conn = await client.connect();
    const findUserQuery =
      'SELECT id, first_name AS "firstName", last_name AS "lastName" ' +
      'FROM users WHERE id=($1)';
    const result: QueryResult<User> = await conn.query(findUserQuery, [id]);
    conn.release();
    return result.rows[0];
  }

  /**
   *
   * @param details details of the user to save
   * @returns User the created user
   */
  static async save(details: UserDetails): Promise<User> {
    const conn = await client.connect();
    const createUserQuery =
      'INSERT INTO users (first_name, last_name, password_digest) ' +
      'VALUES($1, $2, $3) RETURNING id, first_name AS "firstName", last_name AS "lastName"';

    const hash = bcrypt.hashSync(
      details.password + BCRYPT_PASSWORD,
      parseInt(SALT_ROUNDS as string)
    );

    const result: QueryResult<User> = await conn.query(createUserQuery, [
      details.firstName,
      details.lastName,
      hash
    ]);
    conn.release();
    return result.rows[0];
  }
}

import client from '../database';

/**
 *
 * @param table the name of the table to truncate
 */
const truncateTable = async (table: string): Promise<void> => {
  const conn = await client.connect();
  await conn.query(`TRUNCATE ${table} CASCADE`);
  conn.release();
};

export { truncateTable };

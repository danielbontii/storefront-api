import client from '../database';

const truncateTable = async (table: string): Promise<void> => {
  const conn = await client.connect();
  await conn.query(`TRUNCATE ${table} CASCADE`);
  conn.release();
};

export { truncateTable };

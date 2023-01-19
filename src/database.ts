import path from 'path';
import fs from 'fs';

import { Pool } from 'pg';

import dotenv from 'dotenv';
dotenv.config();

const {
  DEV_DB_HOST,
  DEV_DB,
  DEV_DB_USER,
  DEV_DB_PASS,
  TEST_DB_HOST,
  TEST_DB,
  TEST_DB_USER,
  TEST_DB_PASS,
  ENV
} = process.env;

let client: Pool;

if (ENV === 'dev') {
  client = new Pool({
    host: DEV_DB_HOST,
    user: DEV_DB_USER,
    database: DEV_DB,
    password: DEV_DB_PASS
  });
} else {
  client = new Pool({
    host: TEST_DB_HOST,
    user: TEST_DB_USER,
    database: TEST_DB,
    password: TEST_DB_PASS
  });
}

const createDbIfNotExists = async (database: string): Promise<void> => {
  const conn = await client.connect();
  const db = await conn.query(
    `SELECT FROM pg_database WHERE datname = '${database}'`
  );
  if (db.rowCount <= 0) {
    await conn.query(`CREATE DATABASE ${database}`);
  }
};

const initDb = async (): Promise<void> => {
  const DEV_DB = process.env.DEV_DB || 'postgres';
  const { TEST_DB } = process.env;
  console.log(DEV_DB, TEST_DB);

  createDbIfNotExists(DEV_DB);
  const conn = await client.connect();

  const migrationsPath = path.join(__dirname, '../migrations/sqls');
  const migrations = fs.readdirSync(migrationsPath);
  for (const migration of migrations) {
    const filePath = `${migrationsPath}/${migration}`;
    if (path.basename(filePath).split('-').includes('up.sql')) {
      const sql = fs.readFileSync(filePath).toString();
      await client.query(sql);
    }
  }

  conn.release();
  createDbIfNotExists(TEST_DB as string);
};

export  { initDb };
export default client;

import { Pool } from 'pg';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from '../config/env';

const pool = new Pool({
 host: DB_HOST,
 port: DB_PORT,
 user: DB_USER,
 password: DB_PASSWORD,
 database: DB_NAME,
});

export default pool;

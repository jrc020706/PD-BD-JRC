import pkg from 'pg';
const { Pool } = pkg;
import { config } from "./env.js"; // Importante el .js y el nombre 'config'

const pool = new Pool({
    connectionString: config.DATABASE_URL
});

pool.on('error', (err) => {
    console.error('[PostgreSQL] Error inesperado:', err);
});

export const query = (text, params) => pool.query(text, params);
export const getClient = () => pool.connect();
export default pool;

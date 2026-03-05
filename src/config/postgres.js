import pg from 'pg';
import { config } from "./env.js";

const { Pool } = pg;

export const pool = new Pool({
    connectionString: config.POSTGRES_URL,
});

export async function createTables() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Categorías (Debe ir antes que product por la relación)
        await client.query(`CREATE TABLE IF NOT EXISTS product_categories (
            id_pcategory SERIAL PRIMARY KEY,
            category_name VARCHAR(255) UNIQUE NOT NULL 
        )`);

        // 2. Clientes
        await client.query(`CREATE TABLE IF NOT EXISTS customer (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50),
            email VARCHAR(50) UNIQUE  ,
            phone VARCHAR(20) ,
            address TEXT 
        )`);

        // 3. productos
        await client.query(`CREATE TABLE IF NOT EXISTS product (
            id SERIAL PRIMARY KEY,
            product_sku VARCHAR(255) UNIQUE,
            product_name VARCHAR(255),
            unit_price NUMERIC,
            id_pcategory INTEGER REFERENCES product_categories(id_pcategory)
        )`);
        
        // 4. Proveedores
        await client.query(`CREATE TABLE IF NOT EXISTS suppliers (
            id SERIAL PRIMARY KEY,
            supplier_name VARCHAR(255),
            supplier_email VARCHAR(255)UNIQUE
        )`);

        // 5. Órdenes
        await client.query(`CREATE TABLE IF NOT EXISTS orders (
            id_orders SERIAL PRIMARY KEY,
            orders_date DATE NOT NULL
        )`);  

        // 6. Transacciones (Detalle de la orden)
        await client.query(`CREATE TABLE IF NOT EXISTS transactions (
            id_transactions SERIAL PRIMARY KEY,
            id_orders VARCHAR(50) REFERENCES orders(id_orders),
            id_customer INTEGER REFERENCES customer(id),
            id_supplier INTEGER REFERENCES suppliers(id),
            id_product INTEGER REFERENCES product(id),
            quantity NUMERIC NOT NULL,
            total_line_value DECIMAL NOT NULL
        )`);

        // Índices para optimizar búsquedas frecuentes
        await client.query(`CREATE INDEX IF NOT EXISTS idx_transactions_customer ON transactions(id_customer)`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_product_sku ON product(product_sku)`);

        await client.query('COMMIT');
        console.log("Tablas creadas exitosamente.");
    } catch (e) {
        await client.query('ROLLBACK');
        console.error("Error creando tablas:", e);
        throw e;
    } finally {
        client.release();
    }
}


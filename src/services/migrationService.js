import { readFile } from "fs/promises";
import { resolve } from "path";
import { parse } from "csv-parse/sync";
import { pool } from "../config/postgres.js";
import { config } from "../config/env.js";

export async function runMigration(clearBefore = false) {
  const client = await pool.connect();
  const dbCheck = await client.query("SELECT current_database()");
  console.log("Base conectada:", dbCheck.rows[0].current_database);

Ejecuta:
  try {
    const csvPath = resolve(config.CSV_PATH);
    const fileContent = await readFile(csvPath, "utf-8");

    const rows = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: '\t',
      relax_quotes: true
    });

    await client.query("BEGIN");

    if (clearBefore) {
      await client.query(`
        TRUNCATE TABLE transactions, product, product_categories, 
        suppliers, customer, orders CASCADE
      `);
    }

    for (const row of rows) {

      // 1️CATEGORÍA
      console.log(row);
      await client.query(
        `INSERT INTO product_categories (category_name)
          VALUES ($1)
          ON CONFLICT (category_name) DO NOTHING`,
        [row.product_category]
      );

      const { rows: [cat] } = await client.query(
        `SELECT id_pcategory 
         FROM product_categories 
         WHERE category_name = $1`,
        [row.product_category]
      );
      if (!cat) throw new Error(`Categoría no encontrada: ${row.product_category}`);

      // 2️ CLIENTE
      await client.query(
        `INSERT INTO customer (name, email, address, phone)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO NOTHING`,
        [
          row.customer_name,
          row.customer_email,
          row.customer_address,
          row.customer_phone
        ]
      );

      const { rows: [cust] } = await client.query(
        `SELECT id FROM customer WHERE email = $1`,
        [row.customer_email]
      );
      if (!cust) throw new Error(`Cliente no encontrado: ${row.customer_email}`);

      // 3️ PROVEEDOR
      await client.query(
        `INSERT INTO suppliers (supplier_name, supplier_email)
         VALUES ($1, $2)
         ON CONFLICT (supplier_email) DO NOTHING`,
        [row.supplier_name, row.supplier_email]
      );

      const { rows: [supp] } = await client.query(
        `SELECT id FROM suppliers WHERE supplier_email = $1`,
        [row.supplier_email]
      );
      if (!supp) throw new Error(`Proveedor no encontrado: ${row.supplier_email}`);

      // 4️ ORDEN
      const { rows: [order] } = await client.query(
        `INSERT INTO orders (id_orders, orders_date)
         VALUES ($1, $2)
         ON CONFLICT (id_orders) DO NOTHING
         RETURNING id_orders`,
        [row.id_orders || row.transactions_id, row.date]
      );

      // 5️ PRODUCTO
      await client.query(
        `INSERT INTO product (product_sku, product_name, unit_price, id_pcategory)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (product_sku) DO NOTHING`,
        [
          row.product_sku,
          row.product_name,
          Number(row.unit_price),
          cat.id_pcategory
        ]
      );

      const { rows: [prod] } = await client.query(
        `SELECT id FROM product WHERE product_sku = $1`,
        [row.product_sku]
      );
      if (!prod) throw new Error(`Producto no encontrado: ${row.product_sku}`);

      //  TRANSACCIÓN
      await client.query(
        `INSERT INTO transactions
         (id_orders, id_customer, id_supplier, id_product, quantity, total_line_value)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          row.id_orders || row.transactions_id,
          cust.id,
          supp.id,
          prod.id,
          Number(row.quantity),
          Number(row.total_line_value)
        ]
      );
    }

    await client.query("COMMIT");

    return {
      message: `Migración exitosa: ${rows.length} filas procesadas.`
    };

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error en migración:", error);
    throw error;
  } finally {
    client.release();
  }
}

import { readFile } from "fs/promises";
import { resolve } from "path";
import { parse } from "csv-parse/sync";
import { pool } from "../config/postgres.js";
import { config } from "../config/env.js";

export async function runMigration(clearBefore = false) {
  const client = await pool.connect();

  try {
    const csvPath = resolve(config.CSV_PATH);
    const fileContent = await readFile(csvPath, "utf-8");

    // Usamos delimiter: '\t' porque tus datos parecen ser TSV (Tab Separated)
    const rows = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: '\t' 
    });

    await client.query("BEGIN");

    if (clearBefore) {
      await client.query(`TRUNCATE TABLE "Transaction", "Product", "product_categories", "Suppliers", "Customer", "orders" CASCADE`);
    }

    for (const row of rows) {
      // 1. Insertar Categoría
      await client.query(
        `INSERT INTO "product_categories" (category_name) VALUES ($1) ON CONFLICT DO NOTHING`,
        [row.product_category]
      );
      const { rows: [cat] } = await client.query(`SELECT id_pcategory FROM "product_categories" WHERE category_name=$1`, [row.product_category]);

      // 2. Insertar Cliente
      await client.query(
        `INSERT INTO "Customer" (customer_name, customer_email, customer_address, customer_phone) 
         VALUES ($1, $2, $3, $4) ON CONFLICT (customer_email) DO NOTHING`,
        [row.customer_name, row.customer_email, row.customer_address, row.customer_phone]
      );
      const { rows: [cust] } = await client.query(`SELECT id_customer FROM "Customer" WHERE customer_email=$1`, [row.customer_email]);

      // 3. Insertar Proveedor
      await client.query(
        `INSERT INTO "Suppliers" (supplier_name, supplier_email) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [row.supplier_name, row.supplier_email]
      );
      const { rows: [supp] } = await client.query(`SELECT id_supplier FROM "Suppliers" WHERE supplier_email=$1`, [row.supplier_email]);

      // 4. Insertar Orden (Usando el transaction_id como referencia si no tienes id_orders en el CSV)
      await client.query(
        `INSERT INTO "orders" (orders_date) VALUES ($1) ON CONFLICT DO NOTHING`,
        [row.date]
      );
      // Nota: Aquí podrías necesitar lógica extra si una orden tiene varios productos (mismo ID)

      // 5. Insertar Producto
      await client.query(
        `INSERT INTO "Product" (product_sku, product_name, unit_price, id_pcategory) 
         VALUES ($1, $2, $3, $4) ON CONFLICT (product_sku) DO NOTHING`,
        [row.product_sku, row.product_name, Number(row.unit_price), cat.id_pcategory]
      );
      const { rows: [prod] } = await client.query(`SELECT id_product FROM "Product" WHERE product_sku=$1`, [row.product_sku]);

      // 6. Insertar Transacción Final
      await client.query(
        `INSERT INTO "Transaction" (id_orders, id_customer, id_supplier, id_product, quantity, total_line_value)
         VALUES ((SELECT MAX(id_orders) FROM "orders"), $1, $2, $3, $4, $5)`,
        [cust.id_customer, supp.id_supplier, prod.id_product, Number(row.quantity), Number(row.total_line_value)]
      );
    }

    await client.query("COMMIT");
    return { message: `Migración exitosa: ${rows.length} filas procesadas.` };

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error en migración:", error);
    throw error;
  } finally {
    client.release();
  }
}

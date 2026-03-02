import fs from 'fs';
import csv from 'csv-parser';
import { query } from '../db/postgres.js'; // Ajusta la ruta a tu conexión
import { config } from '../env.js';

export const runMigration = async () => {
    const results = [];
    
    return new Promise((resolve, reject) => {
        fs.createReadStream(config.CSV_PATH)
            .pipe(csv({ separator: '\t' })) // Tu data usa tabs según el ejemplo
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    for (const row of results) {
                        // 1. Insertar Cliente (evitando duplicados)
                        const resCust = await query(
                            `INSERT INTO "Customer" (customer_name, customer_email, customer_address, customer_phone) 
                             VALUES ($1, $2, $3, $4) ON CONFLICT (customer_email) DO UPDATE SET customer_name = EXCLUDED.customer_name 
                             RETURNING id_customer`,
                            [row.customer_name, row.customer_email, row.customer_address, row.customer_phone]
                        );

                        // 2. Insertar Categoría
                        const resCat = await query(
                            `INSERT INTO "product_categories" (category_name) VALUES ($1) 
                             ON CONFLICT (category_name) DO UPDATE SET category_name = EXCLUDED.category_name 
                             RETURNING id_pcategory`,
                            [row.product_category]
                        );

                        // Aquí seguirías con Product, Orders y finalmente Transaction...
                    }
                    resolve({ message: "Migración completada", total: results.length });
                } catch (err) {
                    reject(err);
                }
            });
    });
};

import app from './app.js';
import { config } from '../src/config/env.js'; // Usa tu validador centralizado
import { createTables } from './config/postgres.js';
import { runMigration } from './services/migrationService.js';
const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
  console.log(` CSV configurado en: ${config.CSV_PATH}`);
});

try {
  console.log("Iniciando creación de tablas en PostgreSQL...");
  await createTables();
  console.log("Tablas creadas exitosamente.");
} catch (error) {
  console.error("Error al crear tablas en PostgreSQL:", error);
}

try {
  console.log("Iniciando migración...");
  const result = await runMigration(true); // true = limpia antes
  console.log(result.message);
} catch (error) {
  console.error("Error ejecutando migración:", error);
}

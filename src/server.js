import app from './app.js';
import { config } from '../src/config/env.js'; // Usa tu validador centralizado

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
  console.log(` CSV configurado en: ${config.CSV_PATH}`);
});

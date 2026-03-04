import 'dotenv/config'; // Forma simplificada de cargar dotenv en ESM

const required = ['POSTGRES_URL', 'MONGODB_URI',];

for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

// Exportación compatible con ES Modules
export const config = {
    PORT: process.env.PORT || 3000,
    POSTGRES_URL: process.env.POSTGRES_URL,
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
    CSV_PATH: process.env.CSV_PATH || './data/pd_logitech.csv',
};

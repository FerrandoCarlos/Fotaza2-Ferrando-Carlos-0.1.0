import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sequelize from './config/db.js';
import indexRouter from './src/routes/index.js';

dotenv.config();

/**
 * @fileoverview Entry point de la app Fotaza 2.
 * Configura Express, middlewares, rutas y sincronización con la BD.
 * @module app
 */

const app = express();
const PORT = process.env.PORT;

// __dirname con ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Motor de plantillas
app.set('view engine', 'pug');
app.set('views', join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Rutas
app.use('/', indexRouter);

// Sincronización BD + arranque del servidor

try {
  await sequelize.authenticate();
  console.log('✔️ Conexión a la BD establecida');

  await sequelize.sync({ alter: true });
  console.log('✔️ BD sincronizada');

  app.listen(PORT, () => {
    console.log(`🚀 Fotaza 2 corriendo desde http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('✖️ Error al conectar la BD:', error.message);
  process.exit(1);
}

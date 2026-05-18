import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDatabase } from './config/database.js';
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

// Conexión BD + arranque del servidor

connectDatabase()
  .then(() => {
    app.listen(PORT, (err) => {
      if (err) {
        console.error('✖️ Error al iniciar el servidor:', err);
        return;
      }

      console.log(`🚀 Fotaza 2 corriendo desde http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('✖️ Error sincronizando con BD:', err);
  });

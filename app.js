import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDatabase } from './config/database.js';
import { authMiddleware } from './src/middlewares/auth.js';
import indexRouter from './src/routes/index.js';
import authRoutes from './src/routes/authRoutes.js';
import publicacionRoutes from './src/routes/publicacionRoutes.js';

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

// TRUST PROXY (Render no tire las sesiones)
app.set('trust proxy', 1);

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(join(__dirname, 'public')));

// Sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
  })
);

// Middleware de autenticación global
app.use(authMiddleware);
app.use((req, res, next) => {
  res.locals.queryActual = req.query.search || '';
  next();
});
// Rutas
// rutas de autenticación
app.use('/', authRoutes);
// rutas de publicaciones
app.use('/', publicacionRoutes);
// rutas de index
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

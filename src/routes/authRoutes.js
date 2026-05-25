import { Router } from 'express';

/**
 * @fileoverview Rutas de autenticación.
 * @module routes/authRoutes
 */

const router = Router();

/**
 * @route GET /register
 * @description Página de registro.
 */

router.get('/register', (req, res) => {
  res.render('pages/register', { title: 'Registrarse' });
});

/**
 * @route GET /login
 * @description Página de login.
 */

router.get('/login', (req, res) => {
  res.render('pages/login', { title: 'Ingresar' });
});

export default router;

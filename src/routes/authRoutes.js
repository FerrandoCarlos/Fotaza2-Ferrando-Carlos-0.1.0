import { Router } from 'express';
import {
  mostrarLogin,
  mostrarRegistro,
  login,
  registro,
  logout,
} from '../controllers/authController.js';

/**
 * @fileoverview Rutas de autenticación.
 * @module routes/authRoutes
 */

const router = Router();

/**
 * @route GET /register
 * @description Página de registro.
 */
router.get('/register', mostrarRegistro);
/**
 * @route POST /register
 * @description Procesa el formulario de registro.
 */
router.post('/register', registro);
/**
 * @route GET /login
 * @description Página de login.
 */

router.get('/login', mostrarLogin);

/**
 * @route POST /login
 * @description Procesa el formulario de login.
 */
router.post('/login', login);
/**
 * @route POST /logout
 * @description Cierra la sesión del usuario.
 */
router.get('/logout', logout);

export default router;

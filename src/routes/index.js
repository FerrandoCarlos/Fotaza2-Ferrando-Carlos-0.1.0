import { Router } from 'express';
import { index } from '../controllers/homeController.js';

/**
 * @fileoverview Rutas principales de la app
 * @module routes/index
 */

const router = Router();

/**
 * @route GET/
 * @description Página de inicio
 */
router.get('/', index);

export default router;

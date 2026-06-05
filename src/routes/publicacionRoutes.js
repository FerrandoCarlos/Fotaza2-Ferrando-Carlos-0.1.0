import { Router } from 'express';
import {
  mostrarFormulario,
  crear,
} from '../controllers/publicacionController.js';
import { requireAuth } from '../middlewares/auth.js';

/**
 * @fileoverview Rutas de publicaciones.
 * @module routes/publicacionRoutes
 */
const router = Router();

/**
 * @route GET /publicacion/nueva
 * @description Muestra el formulario de nueva publicación.
 */
router.get('/publicacion/nueva', requireAuth, mostrarFormulario);

/**
 * @route POST /publicacion
 * @description Procesa la creación de una nueva publicación.
 */
router.post('/publicacion', requireAuth, crear);

export default router;

import { Router } from 'express';
import { crear, eliminar } from '../controllers/comentarioController.js';
import { requireAuth } from '../middlewares/auth.js';

/**
 * @fileoverview Rutas de comentarios.
 * @module routes/comentarioRoutes
 */

const router = Router();

/**
 * @route POST /comentario
 * @description Crea un comentario.
 */
router.post('/comentario', requireAuth, crear);
/**
 * @route POST /comentario/eliminar/:id
 * @description Elimina un comentario.
 */
router.post('/comentario/eliminar/:id', requireAuth, eliminar);

export default router;

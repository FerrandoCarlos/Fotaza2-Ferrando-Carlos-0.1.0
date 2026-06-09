import { Router } from 'express';
import { seguir, dejarDeSeguir } from '../controllers/seguimientoController.js';
import { requireAuth } from '../middlewares/auth.js';
/**
 * @fileoverview Rutas de seguimiento.
 * @module routes/seguimientoRoutes
 */
const router = Router();
/**
 * @route POST /usuario/:id/seguir
 * @description Procesa el cambio del seguir a un usuario.
 */
router.post('/usuario/:id/seguir', requireAuth, seguir);
/**
 * @route POST /usuario/:id/dejar-de-seguir
 * @description Procesa el cambio del dejar de seguir a un usuario.
 */

router.post('/usuario/:id/dejar-de-seguir', requireAuth, dejarDeSeguir);

export default router;

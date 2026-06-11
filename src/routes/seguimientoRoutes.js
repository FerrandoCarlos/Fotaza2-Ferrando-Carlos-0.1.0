import { Router } from 'express';
import { seguir, dejarDeSeguir } from '../controllers/seguimientoController.js';
import { verPerfil, verMiPerfil } from '../controllers/perfilController.js';
import { requireAuth } from '../middlewares/auth.js';
/**
 * @fileoverview Rutas de seguimiento.
 * @module routes/seguimientoRoutes
 */
const router = Router();
/**
 * @route GET /perfil
 * @description muestra el perfil.
 */

router.get('/perfil', requireAuth, verMiPerfil);
/**
 * @route GET /usuario/:id
 * @description muestra el perfil de un usuario.
 */
router.get('/usuario/:id', verPerfil);
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

import { Router } from 'express';
import {
  mostrarFormulario,
  crear,
  mostrarEditar,
  editar,
  eliminar,
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
 * @route GET /publicacion/editar/:id
 * @description Procesa la edición de una publicación.
 */
router.get('/publicacion/editar/:id', requireAuth, mostrarEditar);

/**
 * @route POST /publicacion/editar/:id
 * @description Procesa el cambio de la edición de una publicación.
 */
router.post('/publicacion/editar/:id', requireAuth, editar);

/**
 * @route POST /publicacion/eliminar/:id
 * @description Procesa la eliminación de una publicación.
 */
router.post('/publicacion/eliminar/:id', requireAuth, eliminar);

/**
 * @route POST /publicacion
 * @description Procesa la creación de una nueva publicación.
 */
router.post('/publicacion', requireAuth, crear);
export default router;

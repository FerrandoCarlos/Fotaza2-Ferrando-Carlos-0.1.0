import { Router } from 'express';
/**
 * @fileoverview Rutas principales de la app
 * @module routes/index
 */
const router = Router();

/**
 * @route GET/
 * @description Página de inicio
 */
router.get('/', (req, res) => {
  res.render('pages/index', { title: 'Inicio' });
});

export default router;

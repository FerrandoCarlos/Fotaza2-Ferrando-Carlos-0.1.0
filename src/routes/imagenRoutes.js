import { Router } from 'express';
import { Imagen } from '../models/Imagen.js';

/**
 * @fileoverview Rutas de imágenes.
 * @module routes/imagenRoutes
 */

const router = Router();
/**
 * @route GET /imagen/:id
 * @description Sirve una imagen desde la base de datos.
 */

router.get('/imagen/:id', async (req, res) => {
  try {
    const imagen = await Imagen.findByPk(req.params.id);
    if (!imagen) return res.status(404).send('Imagen no encontrada');

    // Si tiene copyright y no está logueado → imagen bloqueada
    if (imagen.Licencium?.tiene_copyright && !req.session.userId) {
      return res.redirect('/img/bloqueada.png');
    }
    const base64 = imagen.datos.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    res.set('Content-type', imagen.mime_type);
    res.set('Cache-Control', 'public, max-age=86400'); // cache 24hs
    res.send(buffer);
  } catch (error) {
    console.error('✖️ Error al servir imagen:', error.message);
    res.status(500).send('Error al cargar imagen');
  }
});

export default router;

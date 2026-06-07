import { Router } from 'express';
import { Imagen } from '../models/Imagen.js';
import { Licencia } from '../models/Licencia.js';
import sharp from 'sharp';
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
    const imagen = await Imagen.findByPk(req.params.id, {
      include: [{ model: Licencia, as: 'Licencium' }],
    });
    if (!imagen) return res.status(404).send('Imagen no encontrada');

    const base64 = imagen.datos.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    // Si tiene copyright y no está logueado → imagen bloqueada
    if (imagen.Licencium?.tiene_copyright && !req.session.userId) {
      const texto = imagen.marca_agua_texto || '© Copyright';

      const svgMarcaAgua = Buffer.from(`
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
          <style>
            text {
              fill: rgba(255,255,255,0.35);
              font-size: 32px;
              font-family: sans-serif;
              font-weight: bold;
            }
          </style>
          <g transform="rotate(-30, 400, 300)">
            <text x="-100" y="100">${texto}</text>
            <text x="200" y="100">${texto}</text>
            <text x="500" y="100">${texto}</text>
            <text x="-100" y="220">${texto}</text>
            <text x="200" y="220">${texto}</text>
            <text x="500" y="220">${texto}</text>
            <text x="-100" y="340">${texto}</text>
            <text x="200" y="340">${texto}</text>
            <text x="500" y="340">${texto}</text>
            <text x="-100" y="460">${texto}</text>
            <text x="200" y="460">${texto}</text>
            <text x="500" y="460">${texto}</text>
            <text x="-100" y="580">${texto}</text>
            <text x="200" y="580">${texto}</text>
            <text x="500" y="580">${texto}</text>
          </g>
        </svg>

      `);

      const imagenConMarca = await sharp(buffer)
        .composite([{ input: svgMarcaAgua, gravity: 'center' }])
        .jpeg()
        .toBuffer();

      res.set('Content-Type', 'image/jpeg');
      return res.send(imagenConMarca);
    }
    // Usuario logueado → imagen original
    res.set('Content-type', imagen.mime_type);
    res.set('Cache-Control', 'public, max-age=86400'); // cache 24hs
    res.send(buffer);
  } catch (error) {
    console.error('✖️ Error al servir imagen:', error.message);
    res.status(500).send('Error al cargar imagen');
  }
});

export default router;

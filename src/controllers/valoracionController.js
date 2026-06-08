import { Valoracion } from '../models/Valoracion.js';
import { Publicacion } from '../models/Publicacion.js';
import { Imagen } from '../models/Imagen.js';

/**
 * @fileoverview Controller de valoraciones.
 * @module controllers/valoracionController
 */

/**
 * @function valorar
 * @description Registra o actualiza la valoración de una imagen.
 * El autor no puede valorar su propia publicación.
 * Cada usuario puede valorar una imagen solo una vez (se puede actualizar).
 */
export async function valorar(req, res) {
  try {
    const { id } = req.params;
    const { valor } = req.body;
    const imagen_id = parseInt(req.body.imagen_id);
    const usuario_id = req.session.userId;

    const valorNum = parseInt(valor);
    if (!valorNum || valorNum < 1 || valorNum > 5) {
      //que pasaría con 0
      return res.redirect(`/publicacion/${id}`);
    }
    const publicacion = await Publicacion.findByPk(id);
    if (!publicacion) return res.redirect('/');

    if (publicacion.usuario_id === usuario_id) {
      return res.redirect(`/publicacion/${id}`);
    }

    const [valoracion, creada] = await Valoracion.findOrCreate({
      where: { imagen_id, usuario_id },
      defaults: { valor: valorNum },
    });

    if (!creada) {
      return res.redirect(`/publicacion/${id}`);
    }
    res.redirect(`/publicacion/${id}`);
  } catch (error) {
    console.error('✖️ Error al valorar:', error.message);
    res.redirect('/');
  }
}

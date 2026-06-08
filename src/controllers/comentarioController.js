import { Comentario } from '../models/Comentario.js';
import { Usuario } from '../models/Usuario.js';
import { z } from 'zod';
/**
 * @fileoverview Controller de comentarios.
 * @module controllers/comentarioController
 */
const schemaComentario = z.object({
  contenido: z
    .string()
    .min(1, 'El comentario no puede estar vacío')
    .max(1000, 'Máximo 1000 caracteres'),
  publicacion_id: z.coerce.number().int().positive(),
});
/**
 * @function crear
 * @description Crea un comentario en una publicación.
 */

export async function crear(req, res) {
  const resultado = schemaComentario.safeParse(req.body);

  if (!resultado.success) {
    return res.redirect(`/publicacion/${req.body.publicacion_id}`);
  }

  const { publicacion_id, contenido } = resultado.data;
  try {
    await Comentario.create({
      publicacion_id,
      usuario_id: req.session.userId,
      contenido,
    });
    res.redirect(`/publicacion/${req.body.publicacion_id}`);
  } catch (error) {
    console.error('✖️ Error al crear comentario:', error.message);
    res.redirect('/');
  }
}
/**
 * @function eliminar
 * @description Elimina un comentario (soft delete).
 */
export async function eliminar(req, res) {
  try {
    const comentario = await Comentario.findOne({
      where: { id: req.params.id, usuario_id: req.session.userId },
    });
    if (!comentario) return res.redirect('/');

    await comentario.destroy();
    res.redirect(`/publicacion/${comentario.publicacion_id}`);
  } catch (error) {
    console.error('✖️ Error al eliminar comentario:', error.message);
    res.redirect('/');
  }
}

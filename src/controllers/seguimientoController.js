import { Seguimiento } from '../models/Seguimiento.js';
import { Usuario } from '../models/Usuario.js';

/**
 * @fileoverview Controller de seguimiento de usuarios.
 * @module controllers/seguimientoController
 */

/**
 * @function seguir
 * @description Sigue a un usuario.
 */

export async function seguir(req, res) {
  try {
    const seguido_id = parseInt(req.params.id, 10);
    const seguidor_id = req.session.userId;

    if (seguidor_id === seguido_id) return res.redirect('/');

    await Seguimiento.findOrCreate({
      where: { seguidor_id, seguido_id },
    });

    res.redirect(`/usuario/${seguido_id}`);
  } catch (error) {
    console.error('✖️ Error al seguir:', error.message);
    res.redirect('/');
  }
}
/**
 * @function dejarDeSeguir
 * @description Deja de seguir a un usuario.
 */
export async function dejarDeSeguir(req, res) {
  try {
    const seguido_id = parseInt(req.params.id, 10);
    const seguidor_id = req.session.userId;

    await Seguimiento.destroy({
      where: { seguidor_id, seguido_id },
    });

    res.redirect(`/usuario/${seguido_id}`);
  } catch (error) {
    console.error('✖️ Error al dejar de seguir:', error.message);
    res.redirect('/');
  }
}

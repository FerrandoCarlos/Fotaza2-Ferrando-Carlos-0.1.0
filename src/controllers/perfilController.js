import { Usuario } from '../models/Usuario.js';
import { Publicacion } from '../models/Publicacion.js';
import { Imagen } from '../models/Imagen.js';
import { Seguimiento } from '../models/Seguimiento.js';

/**
 * @fileoverview Controller de perfil de usuario.
 * @module controllers/perfilController
 */
/**
 * @function verMiPerfil
 * @description Redirige al perfil propio del usuario logueado.
 */
export async function verMiPerfil(req, res) {
  res.redirect(`/usuario/${req.session.userId}`);
}

/**
 * @function verPerfil
 * @description Muestra el perfil público de un usuario.
 */

export async function verPerfil(req, res) {
  try {
    const usuario_id = parseInt(req.params.id, 10);
    const currentUser = res.locals.currentUser;

    const usuario = await Usuario.findByPk(usuario_id, {
      attributes: ['id', 'nombre', 'apellido', 'avatar_url', 'createdAt'],
    });

    if (!usuario) return res.redirect('/');

    const publicaciones = await Publicacion.findAll({
      where: { usuario_id, estado: 'activo' },
      include: [{ model: Imagen, as: 'Imagens' }],
      order: [['createdAt', 'DESC']],
    });

    const seguidores = await Seguimiento.count({
      where: { seguido_id: usuario_id },
    });
    const siguiendo = await Seguimiento.count({
      where: { seguidor_id: usuario_id },
    });

    let yaSigue = false;

    if (currentUser && currentUser.id !== usuario_id) {
      const relacion = await Seguimiento.findOne({
        where: { seguidor_id: currentUser.id, seguido_id: usuario_id },
      });
      yaSigue = !!relacion;
    }

    res.render('pages/perfil-usuario', {
      title: `Perfil de ${usuario.nombre} ${usuario.apellido}`,
      usuario,
      publicaciones,
      seguidores,
      siguiendo,
      yaSigue,
    });
  } catch (error) {
    console.error('✖️ Error en perfil:', error.message);
    res.redirect('/');
  }
}

import { Publicacion } from '../models/Publicacion.js';
import { Imagen } from '../models/Imagen.js';
import { Usuario } from '../models/Usuario.js';
import { Etiqueta } from '../models/Etiqueta.js';
import { Licencia } from '../models/Licencia.js';

/**
 * @fileoverview Controller de la página de inicio.
 * @module controllers/homeController
 */
/**
 * @function detalle
 * @description Muestra el detalle de una publicación.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function detalle(req, res) {
  try {
    const { id } = req.params;

    const publicacion = await Publicacion.findOne({
      where: { id, estado: 'activo' },
      include: [
        { model: Usuario, attributes: ['nombre', 'apellido'] },
        {
          model: Imagen,
          as: 'Imagens',
          include: [{ model: Licencia }],
        },
        { model: Etiqueta },
      ],
    });

    if (!publicacion) return res.redirect('/');

    // si anónimo ingresa a una imagen con copy a registro
    const tieneCopyright = publicacion.Imagens.some(
      (img) => img.Licencium?.tiene_copyright
    );

    if (tieneCopyright && !res.locals.currentUser) {
      return res.redirect('/login');
    }

    res.render('pages/detalle', {
      title: publicacion.titulo,
      publicacion,
    });
  } catch (error) {
    console.error('✖️ Error en detalle: ', error.message);
    res.redirect('/');
  }
}
/**
 * @function index
 * @description Muestra la galería pública de publicaciones.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export async function index(req, res) {
  try {
    const currentUser = res.locals.currentUser;

    const publicaciones = await Publicacion.findAll({
      where: { estado: 'activo' },
      include: [
        { model: Usuario, attributes: ['nombre', 'apellido'] },
        {
          model: Imagen,
          include: [{ model: Licencia }],
        },
        { model: Etiqueta },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Se muestran en carrusel solo publicaciones publicas
    const publicacionesCarrusel = publicaciones.filter((p) => {
      return (
        p.Imagens &&
        p.Imagens.length &&
        p.Imagens[0].Licencium &&
        !p.Imagens[0].Licencium.tiene_copyright
      );
    });

    const etiquetas = await Etiqueta.findAll();

    res.render('pages/index', {
      title: 'Inicio',
      publicaciones,
      publicacionesCarrusel,
      etiquetas,
    });
  } catch (error) {
    console.error('❌ Error en home:', error.message);
    res.render('pages/index', {
      title: 'Inicio',
      publicaciones: [],
      publicacionesCarrusel: [],
      etiquetas: [],
    });
  }
}

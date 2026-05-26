import { Publicacion } from '../models/Publicacion';
import { Imagen } from '../models/Imagen';
import { Usuario } from '../models/Usuario';
import { Etiqueta } from '../models/Etiqueta';
import { Licencia } from '../models/Licencia';

/**
 * @fileoverview Controller de la página de inicio.
 * @module controllers/homeController
 */

/**
 * @function index
 * @description Muestra la galería pública de publicaciones.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export async function index(req, res) {
  try {
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

    const etiquetas = await Etiqueta.findAll();

    res.render('pages/index', {
      title: 'Inicio',
      publicaciones,
      etiquetas,
    });
  } catch (error) {
    console.error('❌ Error en home:', error.message);
    res.render('pages/index', {
      title: 'Inicio',
      publicaciones: [],
      etiquetas: [],
    });
  }
}

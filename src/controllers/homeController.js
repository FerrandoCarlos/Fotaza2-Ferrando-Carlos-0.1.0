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
